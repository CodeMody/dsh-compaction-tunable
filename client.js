window.__ModuleLoader__.load({
  id: '@local/dsh-compaction-tunable',
  factory: (require) => {
    const React = require('react')
    const h = React.createElement

    const PACKAGE = '@local/dsh-compaction-tunable'
    const NAMESPACE = 'compaction-policy'
    const NS = 'compactionTunable'

    const en = {
      title: 'Auto-compaction trigger',
      summary: 'Choose when older history is condensed.',
      description:
        'Automatic compaction summarizes older history when the input grows past a threshold. Pick an absolute token count or a fraction of the model window. Changes apply to agents started after you save.',
      tokenMode: 'At a token count',
      tokenHint:
        'Compaction starts once the input history reaches this many tokens. For a 204,800-token window with a 32,768-token output reserve, 155,648 leaves 16,384 tokens spare.',
      ratioMode: 'At a window fraction',
      ratioHint:
        'Fraction of the context window; 0.8 means 80%. The backend also subtracts the output reserve and the headroom below.',
      startAt: 'Start at',
      tokens: 'tokens',
      windowFraction: 'Window fraction',
      headroom: 'Headroom',
      headroomHint: 'Extra tokens kept free beyond the routed output reservation.',
      keepRecent: 'Keep recent history',
      keepRecentHint:
        'Tokens kept verbatim before the summary. 0 uses the recent fraction instead.',
      recentFraction: 'Recent fraction',
      summaryCap: 'Summary output cap',
      summaryCapHint: 'Maximum tokens the generated checkpoint may use.',
      save: 'Save',
      saving: 'Saving…',
      saved: 'Saved.',
      reset: 'Reset to defaults',
      invalid: 'Check the numbers: token fields are whole numbers, fractions are between 0 and 0.95.',
      saveFailed: 'The profile did not accept these values.',
      unavailable: 'The compaction policy plugin is not loaded in this profile.',
      loading: 'Loading the current policy…',
      appliesLater: 'Applies to new sessions in every agent preset.',
    }

    const de = {
      title: 'Automatische Kompaktierung',
      summary: 'Wählen Sie, wann ältere Historie zusammengefasst wird.',
      description:
        'Die automatische Kompaktierung fasst ältere Historie zusammen, sobald die Eingabe eine Schwelle überschreitet. Wählen Sie eine absolute Tokenzahl oder einen Anteil des Modellfensters. Änderungen gelten für Agenten, die nach dem Speichern gestartet werden.',
      tokenMode: 'Ab einer Tokenzahl',
      tokenHint:
        'Die Kompaktierung beginnt, sobald die Eingabe diese Tokenzahl erreicht. Bei 204.800 Token Fenster und 32.768 Token Ausgabereserve bleiben bei 155.648 noch 16.384 Token Luft.',
      ratioMode: 'Ab einem Fensteranteil',
      ratioHint:
        'Anteil des Kontextfensters; 0,8 bedeutet 80 %. Zusätzlich werden Ausgabereserve und der untenstehende Puffer abgezogen.',
      startAt: 'Beginnen bei',
      tokens: 'Token',
      windowFraction: 'Fensteranteil',
      headroom: 'Puffer',
      headroomHint: 'Zusätzliche Token, die über die Ausgabereserve hinaus frei bleiben.',
      keepRecent: 'Aktuelle Historie behalten',
      keepRecentHint:
        'Token, die vor der Zusammenfassung unverändert bleiben. 0 verwendet den Anteil darunter.',
      recentFraction: 'Anteil aktueller Historie',
      summaryCap: 'Obergrenze der Zusammenfassung',
      summaryCapHint: 'Maximale Tokenzahl für den erzeugten Checkpoint.',
      save: 'Speichern',
      saving: 'Speichern…',
      saved: 'Gespeichert.',
      reset: 'Auf Standard zurücksetzen',
      invalid: 'Bitte Zahlen prüfen: Tokenfelder sind ganze Zahlen, Anteile liegen zwischen 0 und 0,95.',
      saveFailed: 'Das Profil hat diese Werte nicht übernommen.',
      unavailable: 'Das Kompaktierungs-Plugin ist in diesem Profil nicht geladen.',
      loading: 'Aktuelle Richtlinie wird geladen…',
      appliesLater: 'Gilt für neue Sitzungen in jedem Agent-Preset.',
    }

    const zh = {
      title: '自动压缩触发点',
      summary: '选择何时压缩较早的对话历史。',
      description:
        '当输入超过阈值时，自动压缩会把较早的历史总结成一段检查点。可以按绝对 token 数或模型窗口比例设置。保存后新建的代理才会使用新值。',
      tokenMode: '按 token 数',
      tokenHint:
        '输入历史达到该 token 数时开始压缩。例如窗口 204,800、输出预留 32,768 时，155,648 会保留 16,384 token 余量。',
      ratioMode: '按窗口比例',
      ratioHint: '上下文窗口的比例；0.8 表示 80%。后端还会扣除输出预留和下面的余量。',
      startAt: '开始于',
      tokens: 'token',
      windowFraction: '窗口比例',
      headroom: '余量',
      headroomHint: '在输出预留之外额外保留的 token 数。',
      keepRecent: '保留最近历史',
      keepRecentHint: '压缩前原样保留的 token 数。0 表示使用下面的比例。',
      recentFraction: '最近历史比例',
      summaryCap: '摘要输出上限',
      summaryCapHint: '生成的检查点最多使用的 token 数。',
      save: '保存',
      saving: '保存中…',
      saved: '已保存。',
      reset: '恢复默认值',
      invalid: '请检查数字：token 字段为整数，比例在 0 到 0.95 之间。',
      saveFailed: '配置文件没有接受这些值。',
      unavailable: '此配置文件中未加载压缩策略插件。',
      loading: '正在读取当前策略…',
      appliesLater: '对任意预设下新建的会话生效。',
    }

    const S = {
      card: { display: 'flex', flexDirection: 'column', gap: '14px' },
      title: {
        margin: 0,
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-primary)',
      },
      body: {
        margin: 0,
        fontSize: '13px',
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-secondary)',
      },
      hint: {
        margin: 0,
        fontSize: '12px',
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary)',
      },
      current: {
        margin: 0,
        fontSize: '13px',
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-primary)',
      },
      group: { display: 'flex', flexDirection: 'column', gap: '10px' },
      row: { display: 'flex', flexDirection: 'column', gap: '4px' },
      label: { fontSize: '13px', lineHeight: '20px', color: 'var(--dsw-alias-label-primary)' },
      choice: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-primary)',
        cursor: 'pointer',
      },
      inputRow: { display: 'flex', alignItems: 'center', gap: '8px' },
      input: {
        boxSizing: 'border-box',
        width: '180px',
        height: '32px',
        border: '0.5px solid var(--dsw-alias-border-l4)',
        borderRadius: 'var(--dsw-radius-md)',
        background: 'var(--dsw-alias-bg-layer-3)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: '13px',
        padding: '0 10px',
        outline: 'none',
      },
      unit: { fontSize: '12px', color: 'var(--dsw-alias-label-tertiary)' },
      actions: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
      primary: {
        height: '32px',
        padding: '0 14px',
        border: 0,
        borderRadius: 'var(--dsw-radius-md)',
        background: 'var(--dsw-alias-state-business-primary)',
        color: '#fff',
        fontSize: '13px',
        cursor: 'pointer',
      },
      secondary: {
        height: '32px',
        padding: '0 12px',
        border: '0.5px solid var(--dsw-alias-border-l4)',
        borderRadius: 'var(--dsw-radius-md)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: '13px',
        cursor: 'pointer',
      },
      status: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' },
      error: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-state-error-primary)' },
    }

    const GROUPS = [
      { label: 'tokenMode', value: true },
      { label: 'ratioMode', value: false },
    ]

    function numberInput(value, onChange, disabled) {
      return h('input', {
        type: 'text',
        inputMode: 'decimal',
        value,
        disabled,
        onChange: (event) => onChange(event.target.value),
        style: { ...S.input, opacity: disabled ? 0.55 : 1 },
      })
    }

    function field(label, hint, controls) {
      return h(
        'div',
        { style: S.row },
        h('span', { style: S.label }, label),
        controls,
        hint ? h('span', { style: S.hint }, hint) : null,
      )
    }

    function toDraft(value) {
      return {
        tokenMode: value.useTokenTrigger !== false,
        triggerTokens: String(value.triggerTokens ?? 155648),
        thresholdRatio: String(value.thresholdRatio ?? 0.8),
        headroomTokens: String(value.headroomTokens ?? 65536),
        retainTokens: String(value.retainTokens ?? 0),
        retainRatio: String(value.retainRatio ?? 0.16),
        maxTokens: String(value.maxTokens ?? 32768),
      }
    }

    function parseDraft(draft) {
      const number = (text) => {
        const trimmed = String(text).trim()
        return trimmed === '' ? Number.NaN : Number(trimmed)
      }
      return {
        triggerTokens: number(draft.triggerTokens),
        thresholdRatio: number(draft.thresholdRatio),
        headroomTokens: number(draft.headroomTokens),
        retainTokens: number(draft.retainTokens),
        retainRatio: number(draft.retainRatio),
        maxTokens: number(draft.maxTokens),
      }
    }

    function validate(draft, numbers) {
      const whole = (value) => Number.isInteger(value)
      if (!whole(numbers.triggerTokens) || numbers.triggerTokens < 1) return false
      if (!whole(numbers.headroomTokens) || numbers.headroomTokens < 1) return false
      if (!whole(numbers.retainTokens) || numbers.retainTokens < 0) return false
      if (!whole(numbers.maxTokens) || numbers.maxTokens < 1) return false
      if (!Number.isFinite(numbers.thresholdRatio) || numbers.thresholdRatio < 0.05 || numbers.thresholdRatio > 0.95) return false
      if (!Number.isFinite(numbers.retainRatio) || numbers.retainRatio < 0 || numbers.retainRatio > 0.95) return false
      return true
    }

    function describe(t, value) {
      const tokens = Math.round(value.triggerTokens ?? 0)
      const ratio = value.thresholdRatio ?? 0.8
      const headroom = Math.round(value.headroomTokens ?? 0)
      const retain = Math.round(value.retainTokens ?? 0)
      const retainRatio = value.retainRatio ?? 0.16
      const trigger =
        value.useTokenTrigger !== false
          ? `${t('startAt')} ${tokens} ${t('tokens')}`
          : `${t('windowFraction')} ${ratio} (${t('headroom')} ${headroom} ${t('tokens')})`
      const kept =
        retain > 0
          ? `${retain} ${t('tokens')}`
          : `${Math.round(retainRatio * 100)}%`
      return `${trigger} · ${t('keepRecent')}: ${kept}`
    }

    function Card(props) {
      const t = props.t
      const snapshot = props.useCompactionPolicy((state) => state)
      const [draft, setDraft] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const [saved, setSaved] = React.useState(false)

      if (props.view === 'summary') return t('summary')
      if (snapshot === undefined || snapshot.status === 'loading') {
        return h('p', { style: S.hint }, t('loading'))
      }
      if (snapshot.value === undefined) {
        return h('p', { style: S.hint }, t('unavailable'))
      }

      const effective = snapshot.value
      const model = draft ?? toDraft(effective)
      const edit = (key, value) => {
        setSaved(false)
        setError('')
        setDraft({ ...model, [key]: value })
      }

      const save = async () => {
        const numbers = parseDraft(model)
        if (!validate(model, numbers)) {
          setError(t('invalid'))
          return
        }
        setBusy(true)
        setError('')
        try {
          const ok = await props.save([
            { op: 'set', path: ['useTokenTrigger'], value: model.tokenMode },
            { op: 'set', path: ['triggerTokens'], value: numbers.triggerTokens },
            { op: 'set', path: ['thresholdRatio'], value: numbers.thresholdRatio },
            { op: 'set', path: ['headroomTokens'], value: numbers.headroomTokens },
            { op: 'set', path: ['retainTokens'], value: numbers.retainTokens },
            { op: 'set', path: ['retainRatio'], value: numbers.retainRatio },
            { op: 'set', path: ['maxTokens'], value: numbers.maxTokens },
          ])
          if (ok) {
            setDraft(null)
            setSaved(true)
          } else {
            setError(t('saveFailed'))
          }
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : String(failure))
        } finally {
          setBusy(false)
        }
      }

      const reset = async () => {
        setBusy(true)
        setError('')
        try {
          await Promise.all([
            'useTokenTrigger',
            'triggerTokens',
            'thresholdRatio',
            'headroomTokens',
            'retainTokens',
            'retainRatio',
            'maxTokens',
          ].map((name) => props.clear(name)))
          setDraft(null)
          setSaved(true)
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : String(failure))
        } finally {
          setBusy(false)
        }
      }

      const tokenMode = model.tokenMode

      return h(
        'section',
        { style: S.card },
        h('h3', { style: S.title }, t('title')),
        h('p', { style: S.body }, t('description')),
        h('p', { style: S.current }, describe(t, effective)),
        h('p', { style: S.hint }, t('appliesLater')),
        h(
          'div',
          { style: S.group, role: 'radiogroup', 'aria-label': t('title') },
          ...GROUPS.map((group) =>
            h(
              'label',
              { style: S.choice, key: String(group.value) },
              h('input', {
                type: 'radio',
                name: 'compaction-trigger-mode',
                checked: tokenMode === group.value,
                onChange: () => edit('tokenMode', group.value),
              }),
              t(group.label),
            ),
          ),
        ),
        tokenMode
          ? field(
              `${t('startAt')} (${t('tokens')})`,
              t('tokenHint'),
              h(
                'div',
                { style: S.inputRow },
                numberInput(model.triggerTokens, (value) => edit('triggerTokens', value), false),
                h('span', { style: S.unit }, t('tokens')),
              ),
            )
          : h(
              React.Fragment,
              null,
              field(
                t('windowFraction'),
                t('ratioHint'),
                numberInput(model.thresholdRatio, (value) => edit('thresholdRatio', value), false),
              ),
              field(
                `${t('headroom')} (${t('tokens')})`,
                t('headroomHint'),
                h(
                  'div',
                  { style: S.inputRow },
                  numberInput(model.headroomTokens, (value) => edit('headroomTokens', value), false),
                  h('span', { style: S.unit }, t('tokens')),
                ),
              ),
            ),
        field(
          `${t('keepRecent')} (${t('tokens')})`,
          t('keepRecentHint'),
          h(
            'div',
            { style: S.inputRow },
            numberInput(model.retainTokens, (value) => edit('retainTokens', value), false),
            h('span', { style: S.unit }, t('tokens')),
          ),
        ),
        field(
          t('recentFraction'),
          null,
          numberInput(model.retainRatio, (value) => edit('retainRatio', value), false),
        ),
        field(
          `${t('summaryCap')} (${t('tokens')})`,
          t('summaryCapHint'),
          h(
            'div',
            { style: S.inputRow },
            numberInput(model.maxTokens, (value) => edit('maxTokens', value), false),
            h('span', { style: S.unit }, t('tokens')),
          ),
        ),
        h(
          'div',
          { style: S.actions },
          h(
            'button',
            {
              type: 'button',
              style: { ...S.primary, opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer' },
              disabled: busy,
              onClick: save,
            },
            busy ? t('saving') : t('save'),
          ),
          h(
            'button',
            { type: 'button', style: S.secondary, disabled: busy, onClick: reset },
            t('reset'),
          ),
          saved ? h('span', { style: S.status }, t('saved')) : null,
          error ? h('span', { style: S.error, role: 'alert' }, error) : null,
        ),
      )
    }

    return {
      inject: ['slots', 'locale', 'configForms'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, de, zh }), 'compaction-tunable: dictionaries')
        const form = ctx.configForms.get(NAMESPACE)
        const store = {
          getSnapshot: () => form.getSnapshot(),
          subscribe: (listener) => form.subscribe(listener),
        }
        const inject = () => ({
          hooks: { compactionPolicy: store },
          save: (operations) => form.mutate(operations),
          clear: (name) => form.unset(name),
        })
        ctx.effect(
          () =>
            ctx.slots.inject('plugins.bundle.config', () =>
              ctx.slots.register(
                {
                  name: 'plugins.bundle.config',
                  key: PACKAGE,
                  locale: NS,
                  inject,
                },
                Card,
              ),
            ),
          'compaction-tunable: settings page',
        )
      },
    }
  },
})
