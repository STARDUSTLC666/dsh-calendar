/**
 * Harness 0.1.7 起，可编辑字段住在 profile 里，插件拿到的是「活引用」。
 *
 * 这一层只解决两件事：
 *   1. 用宿主的 schemastery 声明 entry 的 Config —— 字段标 `.volatile()`，
 *      设置面板改完立刻生效、不必重启；三个凭据标 `role('secret')`，
 *      于是它们永远不会经设置接口回到浏览器（只回「有没有」）。
 *   2. `liveConfig` 把活引用摊平成普通值：老宿主（0.1.6 及更早）直接给字面量，
 *      新宿主给 `{ get() }`，同一份业务代码两边都能读。
 *
 * @module dsh-calendar/host-config
 */
import z from '@deepseek-ai/schemastery';
import type { CalendarConfig } from './config.js';
/**
 * entry 的 Config 形状。字段与 `CalendarSettingsSchema` 一一对应，但这里不给默认值：
 * 「没填」必须保持 undefined，否则表单默认值会盖掉 cordis.patch.yml 与 provider 预设。
 */
export declare const Config: z;
/** 活引用视图；同时接受老宿主与直接调用方给的普通值。 */
export declare function liveConfig(config: object): CalendarConfig;
