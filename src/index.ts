/**
 * dsh-calendar —— CalDAV 日历工具插件（node 半身，配置走 cordis.patch.yml）。
 *
 * 插件导出 apply(ctx, config)：把五个面向模型的工具（calendar_list / calendar_create /
 * calendar_update / calendar_delete / calendar_search）注册进宿主进程的工具注册表。
 * 配置缺失时插件照常加载，工具在 execute 时才抛出带中文指引的错误。
 *
 * @module dsh-calendar
 */

import { resolveConfig, type CalendarConfig } from './config.js'
import { buildCalendarTools, type CalendarToolDefinition } from './tools.js'
import { CalendarSettingsSchema, SETTINGS_NAMESPACE, toCalendarConfig, toSettingsBase, validateSettingsValue, type CalendarSettingsValue } from './settings.js'
import { CalendarSettingsBackend, installCalendarSettingsWeb } from './web.js'

/** cordis 服务注入：apply 里要用 ctx.tools，必须显式声明注入，否则宿主会抛 cannot get property without inject。 */
export const name = 'calendar'
export const inject = ['tools']


/** 插件所需的最小 ctx 面（社区插件不依赖宿主内部类型）。 */
export interface CalendarPluginContext {
  tools: { register(definition: CalendarToolDefinition): () => void }
  on?(event: string, listener: () => void): () => void
  /** 设置页面板需要挂路由；隔离环境（测试/headless）可以没有。 */
  inject?(services: string[], callback: (ctx: any) => void): void
}

/**
 * 插件入口：惰性解析配置并注册五个日历工具。
 * @param ctx - 宿主上下文（至少含 tools.register）。
 * @param config - 插件配置（可缺省）。
 */
export function apply(ctx: CalendarPluginContext, config?: CalendarConfig | null): void {
  const cfg = config ?? {}
  try {
    resolveConfig(cfg)
  } catch (error) {
    console.warn('dsh-calendar: ' + (error instanceof Error ? error.message : String(error)))
  }

  // 面板把连接配置写进 settings 之后，工具的下一次调用就该用新配置 —— 所以工具与面板
  // 拿到的是一个 getter，而不是启动时那一份静态对象。
  let effective: CalendarConfig = cfg
  const configOf = (): CalendarConfig => effective

  const disposers: Array<() => void> = []
  for (const definition of buildCalendarTools(configOf)) {
    disposers.push(ctx.tools.register(definition))
  }

  // 面板路由先挂上：没有 settings 服务时它仍然可看（只读），设置面板只是不能保存。
  const backend = new CalendarSettingsBackend({ config: configOf })
  try {
    installCalendarSettingsWeb(ctx, backend)
  } catch (error) {
    console.warn('dsh-calendar: 面板路由未挂载：' + (error instanceof Error ? error.message : String(error)))
  }

  // settings 服务到了再「升级」这个 backend：注册命名空间、把面板的读写接进去。
  if (typeof ctx.inject === 'function') {
    try {
      ctx.inject(['settings'], (settingsCtx: any) => {
        if (settingsCtx === undefined || settingsCtx.settings === undefined || typeof settingsCtx.effect !== 'function') return
        settingsCtx.effect(() => {
          const scope = settingsCtx.settings.register(SETTINGS_NAMESPACE, CalendarSettingsSchema, {
            base: toSettingsBase(cfg),
            applies: 'live',
            validate: (value: unknown) => validateSettingsValue(value as CalendarSettingsValue),
          })
          const descriptor = (): any => (settingsCtx.settings.describe?.() ?? []).find((row: any) => row.ns === SETTINGS_NAMESPACE)
          const readRaw = (): Record<string, unknown> => ((scope.get() ?? {}) as Record<string, unknown>)
          const read = (): CalendarSettingsValue => readRaw() as unknown as CalendarSettingsValue
          // 有效配置 = patch 行配置 + 面板真的设过的字段（面板优先，未设的字段由 YAML 兜底）。
          const merge = (value: CalendarSettingsValue): CalendarConfig => ({ ...cfg, ...toCalendarConfig(value, descriptor()?.user as Partial<CalendarSettingsValue> | undefined) })
          effective = merge(read())
          backend.attachSettings({
            read: readRaw,
            descriptor: () => descriptor() as { revision?: number; user?: Record<string, unknown> } | undefined,
            replace: async (value: Record<string, unknown>, revision: number): Promise<void> => {
              await settingsCtx.settings.replace(SETTINGS_NAMESPACE, value, revision)
              effective = { ...cfg, ...toCalendarConfig(value as Partial<CalendarSettingsValue>, null) }
            },
          })
          return () => {
            backend.attachSettings(undefined)
            effective = cfg
          }
        }, 'dsh-calendar: settings namespace')
      })
    } catch (error) {
      console.warn('dsh-calendar: 设置服务不可用，面板只能只读：' + (error instanceof Error ? error.message : String(error)))
    }
  }
  if (typeof ctx.on === 'function') {
    ctx.on('dispose', () => {
      for (const dispose of disposers) dispose()
    })
  }
}


export * from './parameters.js'
export * from './config.js'
export * from './ical.js'
export * from './caldav.js'
export * from './tools.js'
export * from './web.js'
export * from './settings.js'
