import { AsyncLocalStorage } from 'node:async_hooks'
import BasicCompactionEngine from '@deepseek-ai/dsh-compaction-basic'

/**
 * Per-call model capacity, carried across the engine's awaits so concurrent
 * compactions on different sessions cannot see each other's runtime numbers.
 */
const runtimeStore = new AsyncLocalStorage()

const DEFAULTS = Object.freeze({
  useTokenTrigger: true,
  triggerTokens: 155648,
  thresholdRatio: 0.8,
  headroomTokens: 65536,
  retainTokens: 0,
  retainRatio: 0.16,
  maxTokens: 32768,
})

/** Coerce a value to a whole number at or above `min`, or the fallback. */
function intAtLeast(value, fallback, min) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.max(min, Math.floor(n)) : fallback
}

/** Clamp a finite number into a closed range. */
function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value))
}

/** Ratio policy: the shipped backend's window-fraction knobs. */
function ratioPolicy(policy, common) {
  const thresholdRatio = clamp(
    Number(policy.thresholdRatio) || DEFAULTS.thresholdRatio,
    0.05,
    1,
  )
  const headroomTokens = intAtLeast(policy.headroomTokens, DEFAULTS.headroomTokens, 1)
  const retainTokens = intAtLeast(policy.retainTokens, 0, 0)
  const retention =
    retainTokens > 0
      ? { retainTokens }
      : { retainRatio: clamp(Number(policy.retainRatio) || DEFAULTS.retainRatio, 0, 0.95) }
  return { ...common, thresholdRatio, headroomTokens, ...retention }
}

/**
 * Build the config shape the shipped engine expects, resolving an absolute
 * token trigger into a headroom for the routed model.
 * @param policy the user's live policy (or undefined).
 * @param runtime the routed model's context window and output reservation.
 * @returns a resolved policy object.
 */
export function buildPolicyConfig(policy, runtime) {
  const p = { ...DEFAULTS, ...(policy ?? {}) }
  const maxTokens = intAtLeast(p.maxTokens, DEFAULTS.maxTokens, 1)
  const common = {
    summarizationProvider: '',
    summarizationModel: '',
    maxTokens,
    compactionRetries: 1,
    maxOverflowRetries: 1,
    modelPolicies: [],
    auto: true,
  }
  const absolute = intAtLeast(p.triggerTokens, 0, 0)
  if (p.useTokenTrigger === false || absolute <= 0) return ratioPolicy(p, common)
  // Outside a pressure check there is no routed capacity to convert against.
  if (runtime === undefined) return ratioPolicy(p, common)

  const budget = Math.max(2, Math.floor(runtime.contextWindow - Math.max(0, runtime.reserved)))
  const trigger = clamp(absolute, 1, budget - 1)
  const retainTokens =
    intAtLeast(p.retainTokens, 0, 0) > 0
      ? clamp(intAtLeast(p.retainTokens, 0, 0), 0, trigger - 1)
      : clamp(
          Math.floor(budget * clamp(Number(p.retainRatio) || DEFAULTS.retainRatio, 0, 0.95)),
          0,
          trigger - 1,
        )
  // thresholdRatio 1 makes the backend's floor(min(W * ratio, W - output - headroom))
  // resolve to exactly the requested trigger.
  return { ...common, thresholdRatio: 1, headroomTokens: budget - trigger, retainTokens }
}

/**
 * Resolve the routed model's context window and reserved output tokens.
 * Failures are returned as undefined; the shipped engine surfaces its own
 * diagnostic for the same target.
 */
async function resolveRuntime(ctx, header, signal) {
  const target = header.config
  try {
    const info = await ctx.llm.resolveModelInfo(target.provider, target.model, signal)
    const contextWindow = info?.context?.contextWindow
    if (!Number.isInteger(contextWindow) || contextWindow <= 0) return undefined
    const reserved = header.config.maxTokens ?? info.defaultMaxTokens ?? 0
    return { contextWindow, reserved }
  } catch {
    return undefined
  }
}

/**
 * The shipped compaction engine with a live policy: the pressure threshold and
 * kept-tail budget are read from `ctx.compactionPolicy` on every check, so an
 * edit in the Web UI takes effect without restarting the process.
 */
export default class TunableCompactionEngine extends BasicCompactionEngine {
  static inject = ['llm', 'tokenMeter', 'sessions', 'compactionPolicy']

  /** Last threshold logged per routed target, to avoid one log line per step. */
  #logged = new Map()

  constructor(ctx, config = {}) {
    super(ctx, config)
    Object.defineProperty(this, 'config', {
      configurable: true,
      enumerable: false,
      get: () =>
        buildPolicyConfig(
          ctx.compactionPolicy?.snapshot?.(),
          runtimeStore.getStore(),
        ),
    })
  }

  /**
   * Resolve the target's capacity before the shipped pressure check runs, so
   * the policy getter can convert an absolute trigger into a headroom.
   */
  async compactPressure(agent, header, signal, requireBelowThreshold) {
    const policy = this.ctx.compactionPolicy?.snapshot?.()
    if (policy !== undefined && policy.useTokenTrigger === false) {
      return super.compactPressure(agent, header, signal, requireBelowThreshold)
    }
    const runtime = await resolveRuntime(this.ctx, header, signal)
    if (runtime !== undefined) this.#logThreshold(header.config, runtime, policy)
    return runtimeStore.run(runtime, () =>
      super.compactPressure(agent, header, signal, requireBelowThreshold),
    )
  }

  /** Log the resolved start point once per routed target and threshold. */
  #logThreshold(target, runtime, policy) {
    const budget = Math.max(2, runtime.contextWindow - Math.max(0, runtime.reserved))
    const p = { ...DEFAULTS, ...(policy ?? {}) }
    const absolute = intAtLeast(p.triggerTokens, 0, 0)
    const usesTokens = p.useTokenTrigger !== false && absolute > 0
    const threshold = usesTokens
      ? clamp(absolute, 1, budget - 1)
      : Math.floor(
          Math.min(
            runtime.contextWindow * clamp(Number(p.thresholdRatio) || DEFAULTS.thresholdRatio, 0.05, 1),
            budget - intAtLeast(p.headroomTokens, DEFAULTS.headroomTokens, 1),
          ),
        )
    const key = `${target.provider}/${target.model}@${threshold}`
    if (this.#logged.has(key)) return
    if (this.#logged.size > 64) this.#logged.clear()
    this.#logged.set(key, true)
    this.ctx.logger.info(
      `compaction-tunable: ${target.provider}/${target.model} starts compaction at ~${threshold} tokens (context ${runtime.contextWindow}, output reserve ${runtime.reserved})`,
    )
  }
}
