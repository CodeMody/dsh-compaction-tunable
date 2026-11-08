import { Service } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

/**
 * User-owned compaction policy. This plugin owns no model surface: it only
 * exposes live (volatile) settings that the compaction engine in the Standard
 * preset reads on every pressure check.
 */
export default class CompactionPolicy extends Service {
  static Config = z.object({
    /** When true, trigger at an absolute input-token count; otherwise use the window fraction. */
    useTokenTrigger: z.boolean().default(true).volatile(),
    /** Absolute input-token level at which automatic compaction starts. */
    triggerTokens: z.number().step(1).min(0).default(155648).volatile(),
    /** Window fraction used when the token trigger is off. */
    thresholdRatio: z.number().min(0.05).max(0.95).default(0.8).volatile(),
    /** Extra headroom beyond the routed output reservation, in fraction mode. */
    headroomTokens: z.number().step(1).min(1).default(65536).volatile(),
    /** Recent history kept verbatim; 0 selects the fraction below. */
    retainTokens: z.number().step(1).min(0).default(0).volatile(),
    /** Fraction of the input budget kept verbatim when retainTokens is 0. */
    retainRatio: z.number().min(0).max(0.95).default(0.16).volatile(),
    /** Output cap for the generated checkpoint. */
    maxTokens: z.number().step(1).min(1).default(32768).volatile(),
  })

  constructor(ctx, config) {
    super(ctx, 'compactionPolicy')
    this.values = config
    ctx.logger.info(
      'compaction-policy: provider loaded; edit it from sidebar Plugins > Auto-compaction trigger',
    )
  }

  /**
   * Read the live policy. Volatile fields are references, so a settings save
   * updates these values in place without restarting the plugin.
   * @returns the current user-selected policy.
   */
  snapshot() {
    const v = this.values
    return {
      useTokenTrigger: v.useTokenTrigger.get(),
      triggerTokens: v.triggerTokens.get(),
      thresholdRatio: v.thresholdRatio.get(),
      headroomTokens: v.headroomTokens.get(),
      retainTokens: v.retainTokens.get(),
      retainRatio: v.retainRatio.get(),
      maxTokens: v.maxTokens.get(),
    }
  }
}
