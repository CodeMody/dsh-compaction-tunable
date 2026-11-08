# Auto-compaction trigger

Source: <https://github.com/CodeMody/dsh-compaction-tunable>

A DSH profile bundle that adds a **Plugins → Auto-compaction trigger** settings
page, so you can choose the input-token level at which automatic context
compaction starts instead of accepting the shipped default.

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

For `W = 204800`, `O = 32768`: `min(163840, 106496) = 106496` — the ~100k trigger.

## What this bundle does

1. Inserts a root row `compaction-policy` (this package) whose Config is entirely
   **volatile**: the Settings form writes it through the normal profile patch and
   the running service updates in place.
2. Re-declares the shipped `standard` preset with its exact child list, replacing
   `compaction-basic` with `@local/dsh-compaction-tunable/engine`.
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

- Controls the **Standard** preset. Other presets keep their shipped policy.
- To uninstall, use **Plugins → Auto-compaction trigger bundle → uninstall** (or
  `plugin_manager` `remove_bundle`). The profile then returns to the shipped
  preset and the default 65,536-token headroom.
- The preset copy is pinned to DSH `0.2.2-rc.1`. After a DSH upgrade that changes
  `standard.patch.yml`, reinstall an updated copy to pick up new preset plugins.
