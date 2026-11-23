import { CalendarSettingsBackend } from './web.js'
import { CalendarImportBackend } from './import-web.js'
export const AUTH_SETTINGS_ROUTE = '/api/dsh-calendar/settings'
export const AUTH_DRAFT_ROUTE = '/api/dsh-calendar/draft'

/** Register only on the Host's authenticated Fetch carrier; never trust proxy identity headers. */
export function installAuthenticatedCalendar(
  ctx: any,
  resolve: (principal: unknown) => { settings: CalendarSettingsBackend; imports: CalendarImportBackend },
  perUser = true,
): void {
  ctx.inject?.(['connection'], (host: any) => {
    const connection = host.connection
    const carrier = connection?.fetch
    if (typeof carrier?.register !== 'function') return
    for (const [path, type] of [[AUTH_SETTINGS_ROUTE,'settings'],[AUTH_DRAFT_ROUTE,'draft'],['/api/dsh-calendar/import','import']] as const) {
      const settings = type === 'settings'
      const dispose = carrier.register({
        path,
        methods: settings ? ['GET', 'POST'] : ['POST'],
        requestBody: settings ? 'buffered' : 'streaming',
        fetch: async (request: Request): Promise<Response> => {
          try {
            // The standard Fetch carrier dispatches only authenticated owners. Deployments
            // using per-user identity still resolve their verified principal from the request.
            const admission = perUser ? connection.admit?.(request) : { peer: connection.browserPeer }
            if (!admission || admission.rejection !== undefined) {
              return Response.json({ ok: false, message: 'Authentication required' }, { status: admission?.rejection ?? 403 })
            }
            const principal = admission.peer?.principal
            if (!principal || (!perUser && principal.kind !== 'owner')) {
              return Response.json({ ok: false, message: 'Calendar identity unavailable' }, { status: 403 })
            }
            const backend = resolve(principal)
            return type === 'import'
              ? backend.imports.fetch(request)
              : backend.settings.fetchAuthenticated(request, type === 'draft')
          } catch {
            return Response.json({ ok: false, message: 'Calendar identity or private settings unavailable' }, { status: 403 })
          }
        },
      })
      host.effect?.(() => () => { void dispose() })
    }
  })
}
