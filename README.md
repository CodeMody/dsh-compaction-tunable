# Auto-compaction trigger


A DSH profile bundle that adds a **Plugins → Auto-compaction trigger** settings
page, so you can choose the input-token level at which automatic context
compaction starts instead of accepting the shipped default.

## Install

In DSH, install this repo as a plugin bundle — full CLI command (desktop app or web app):

```
dsh plugin --profile desktop add @codemody/dsh-compaction-tunable
dsh plugin --profile web add @codemody/dsh-compaction-tunable
```

Or paste `@codemody/dsh-compaction-tunable` (npm) or
`github:CodeMody/dsh-compaction-tunable` (source) into the Plugins manager's
install field. DSH pulls
it via pnpm into the profile's `node_modules` — no app restart needed.
The plugin card appears under **Plugins** with its settings page, and each **new**
session picks the engine up (a session that is already open keeps the preset
revision it started with). Disabling or removing the bundle returns every preset
to its shipped compaction defaults again.

> **Note:** this bundle restates DSH's own agent presets, and its copies are pinned
> to DSH `0.2.2-rc.1`. After a DSH app update, update this bundle too, so the
> restated preset lists stay in step with the shipped ones — see
> [Scope and removal](#scope-and-removal).

## Why the YAML override did not work

The Web app composes agents behind **agent presets**. `dsh-web-app` disables the
host-plane rows (`- id: compaction-basic, disabled: true`) and each preset mounts
its own compaction backend:

```yaml
- id: compaction
  name: cordis:group
  isolate: { compaction: true, toolResultPruner: true }
  config:
    - id: compaction-basic
      name: '@deepseek-ai/dsh-compaction-basic'
    ...
```

A profile patch that targets `id: compaction-basic` edits that disabled host row,
not the preset-owned engine. The preset keeps the default policy:

```
trigger = floor(min(W × 0.8, W − O − 65536))
```

For `W = 204800` with the default `O = 32768`: `min(163840, 106496) = 106496` — the
~100k trigger. But `O` is the routed model's output reservation (its `maxTokens`),
not a constant: a profile that raises `maxTokens` to 65536 starts much earlier —
`min(163840, 204800 − 65536 − 65536) = 73728`, so compaction fires around 73k.

## What this bundle does

1. Inserts a root row `compaction-policy` (this package) whose Config is entirely
   **volatile**: the Settings form writes it through the normal profile patch and
   the running service updates in place.
2. Re-declares every shipped agent preset (`standard`, `ptc`, `minimal`, `cordis`)
   with its exact child list, replacing `compaction-basic` with
   `@codemody/dsh-compaction-tunable/engine`. The engine must live inside each
   preset's own `compaction` isolate group: host rows never reach the agent tree,
   and a patch override replaces the whole row config, so each list is restated.
3. The engine subclasses the shipped `BasicCompactionEngine` and builds its policy
   from `ctx.compactionPolicy` on every pressure check. An absolute trigger is
   converted to a headroom per routed model:

   ```
   budget  = contextWindow − reservedOutput
   trigger = clamp(triggerTokens, 1, budget − 1)
   headroom = budget − trigger            # threshold becomes exactly trigger
   ```

   If `triggerTokens` is `0` or the token mode is off, the window-fraction fields
   (`thresholdRatio`, `headroomTokens`) are used instead.

   Because `budget` subtracts the routed model's output reservation, the start point
   can never sit above `contextWindow − maxTokens`: with a 65536-token reservation
   the default `155648` clamps to `139263`. Lower the model's `maxTokens` (e.g. to
   `32768`) in your LLM settings if you want the full trigger.

## Use

Open **Plugins** in the sidebar (the bundle appears under *Installed plugins*),
open **Auto-compaction trigger**, then:

- pick **At a token count** and set the start point (default `155648`); or
- pick **At a window fraction** and set the fraction and headroom;
- optionally set the recent-history budget and the summary output cap;
- **Save**.

The change is written to `$DSH_HOME/profiles/desktop/cordis.patch.yml` and
applies to agents started after saving. Existing sessions keep the preset
revision they started with, so open a new session to use the new threshold.

The host log prints the resolved start point once per routed target:

```
compaction-tunable: strata/Qwen3.8-flash-next starts compaction at ~155648 tokens (context 204800, output reserve 32768)
```

## Scope and removal

- Controls all four shipped presets: `standard`, `ptc`, `minimal`, and `cordis`.
  A preset you author yourself in the Web editor keeps the shipped basic engine
  until a bundle update restates it too.
- To uninstall, use **Plugins → Auto-compaction trigger bundle → uninstall** (or
  `plugin_manager` `remove_bundle`). The profile then returns to the shipped
  preset and the default 65,536-token headroom.
- The preset copies are pinned to DSH `0.2.2-rc.1`. After a DSH upgrade that
  changes the preset lists, update the bundle to pick up new preset plugins.
  `preset-cordis` additionally pins its `skill-filesystem` skills directory to
  the installed app's `app.asar` path (the shipped `!!js` expression resolves
  relative to the web-app patch layer only).

## Compatibility

- **DSH:** `0.2.2-rc.1` — the restated preset copies are pinned to this
  revision (see [Scope and removal](#scope-and-removal)). Installs into any
  profile (`desktop` or `web`): the patch resolves everything through package
  exports and contains no profile-specific paths.
- **Runtime:** settings are volatile — saving applies in place, no app
  restart; sessions started afterwards pick the new threshold up.
- **License:** MIT ([LICENSE](LICENSE)).
