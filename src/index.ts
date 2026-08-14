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

/** cordis 服务注入：apply 里要用 ctx.tools，必须显式声明注入，否则宿主会抛 cannot get property without inject。 */
export const inject = ['tools']


/** 插件所需的最小 ctx 面（社区插件不依赖宿主内部类型）。 */
export interface CalendarPluginContext {
  tools: { register(definition: CalendarToolDefinition): () => void }
  on?(event: string, listener: () => void): () => void
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

  const disposers: Array<() => void> = []
  for (const definition of buildCalendarTools(cfg)) {
    disposers.push(ctx.tools.register(definition))
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
