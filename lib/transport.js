export const AUTH_SETTINGS_ROUTE = '/api/dsh-calendar/settings';
export const AUTH_DRAFT_ROUTE = '/api/dsh-calendar/draft';
/** Register only on the Host's authenticated Fetch carrier; never trust proxy identity headers. */
export function installAuthenticatedCalendar(ctx, resolve) {
    ctx.inject?.(['connection'], (host) => {
        if (typeof host.connection?.admit !== 'function' || typeof host.connection?.fetch?.register !== 'function')
            return;
        for (const [path, type] of [[AUTH_SETTINGS_ROUTE, 'settings'], [AUTH_DRAFT_ROUTE, 'draft'], ['/api/dsh-calendar/import', 'import']]) {
            const dispose = host.connection.fetch.register({ path, methods: type === 'settings' ? ['GET', 'POST'] : ['POST'], requestBody: 'streaming',
                fetch: async (request) => {
                    const admission = host.connection.admit({ headers: request.headers });
                    if (!admission || admission.rejection)
                        return Response.json({ ok: false, message: 'Authentication required' }, { status: admission?.rejection ?? 403 });
                    try {
                        const backend = resolve(admission.peer.principal);
                        return type === 'import' ? backend.imports.fetch(request) : backend.settings.fetchAuthenticated(request, type === 'draft');
                    }
                    catch {
                        return Response.json({ ok: false, message: 'Calendar identity or private settings unavailable' }, { status: 403 });
                    }
                },
            });
            host.effect?.(() => () => { void dispose(); });
        }
    });
}
