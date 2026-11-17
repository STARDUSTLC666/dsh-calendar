// Generated: shared optional update controls; edit the original client templates.
(function(){
/* DSH workbench UI v1. MIT. Canonical source: dsh-suite/ui/workbench-ui.js.
 * Vendored into each plugin: no Suite or extra runtime dependency is required.
 * Styles are scoped to .dshw and never replace the host chrome or theme.
 */
function createWorkbenchUI(React) {
  const h = React.createElement;
  const { useEffect, useId, useRef } = React;
  const cx = (...values) => values.filter(Boolean).join(' ');
  const paths = {
    book: ['M4 4h6a3 3 0 0 1 2 2v15a4 4 0 0 0-4-2H4z', 'M20 4h-6a3 3 0 0 0-2 2v15a4 4 0 0 1 4-2h4z'],
    calendar: ['M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z', 'M7 3v4M17 3v4M3 10h18'],
    mail: ['M3 5h18v14H3z', 'm3 6 9 7 9-7'],
    rss: ['M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16', 'M4 19h.01'],
    slides: ['M3 4h18v13H3z', 'M12 17v4M8 21h8'],
    shield: ['m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6z', 'm8 12 3 3 5-6'],
    layers: ['M5 3h16v16H5z', 'M2 7v15h15'],
    play: ['m9 6 9 6-9 6Z'],
    video: ['M3 5h12v14H3z', 'm15 10 6-4v12l-6-4'],
    search: ['M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z', 'm16 16 5 5'],
    plus: ['M12 5v14M5 12h14'],
    refresh: ['M20 7a9 9 0 1 0 1 8', 'M20 2v5h-5'],
    settings: ['m9 3-.7 2.4-2 .9L4 5.8 2.5 8.4l1.7 1.8v2.3L2.5 14 4 17l2.5-.4 1.9 1L9 20h3l.8-2.4 2-1 2.5.4 1.5-2.7-1.7-1.9v-2.2l1.7-1.8-1.5-2.6-2.5.4-2-1L12 3Z', 'M14 11.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'],
    close: ['m6 6 12 12M18 6 6 18'],
    left: ['m14 5-7 7 7 7'],
    right: ['m10 5 7 7-7 7'],
    down: ['m5 9 7 7 7-7'],
    filter: ['M4 5h16M7 12h10M10 19h4'],
    download: ['M12 3v12m-5-5 5 5 5-5', 'M4 16v5h16v-5'],
    upload: ['M12 16V4m-5 5 5-5 5 5', 'M4 16v5h16v-5'],
    copy: ['M8 8h13v13H8z', 'M16 8V3H3v13h5'],
    external: ['M14 3h7v7m0-7L10 14', 'M10 3H3v18h18v-7'],
    file: ['M4 3h10l6 6v12H4z', 'M14 3v6h6M8 13h8M8 17h6'],
    folder: ['M3 5h7l2 3h9v12H3z'],
    edit: ['m15 4 5 5-10 10-6 1 1-6Z', 'm13 6 5 5'],
    trash: ['M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7'],
    more: ['M5 12h.01M12 12h.01M19 12h.01'],
    info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 11v6M12 7h.01'],
    check: ['m5 12 4 4L19 6'],
    quote: ['M4 12h6v7H3v-7c0-4 2-6 5-7M15 12h6v7h-7v-7c0-4 2-6 5-7'],
    star: ['m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z'],
    reply: ['m9 5-7 7 7 7v-5h6c3 0 5 2 6 5 0-8-4-11-12-11Z'],
    link: ['m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0', 'm14 8 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0'],
  };
  function Icon({ name = 'file', size = 20, ...props }) {
    return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false, ...props },
      (paths[name] || paths.file).map((d, index) => h('path', { key: index, d })));
  }
  function Button({ children, icon, variant, className, ...props }) {
    return h('button', { type: 'button', ...props, className: cx('w-button', variant && 'w-' + variant, className) }, icon ? h(Icon, { name: icon, size: 18 }) : null, children);
  }
  function IconButton({ label, icon, ...props }) {
    return h(Button, { ...props, icon, className: cx('w-icon-button', props.className), 'aria-label': label, title: label });
  }
  function Page({ title, subtitle, actions, children, workbench = false, className, rootRef, ...props }) {
    return h('section', { ...props, ref: rootRef, className: cx('dshw', 'w-page', className), 'data-main': workbench ? 'true' : 'false' },
      h(Styles, { key: 'styles' }),
      h('header', { className: 'w-page-header' }, h('div', { className: 'w-heading' }, h('h1', null, title), subtitle ? h('p', { className: 'w-subtitle' }, subtitle) : null), actions ? h('div', { className: 'w-header-actions' }, actions) : null),
      h('div', { className: 'w-body' }, children));
  }
  function Tabs({ items, value, onChange, label, children }) {
    const id = useId();
    const active = items.some(item => item.id === value) ? value : items[0]?.id;
    function keys(event, index) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
      const node = event.currentTarget.parentElement?.querySelectorAll('[role=tab]')[next];
      if (node) { onChange(items[next].id); node.focus(); }
    }
    return h('div', { className: 'w-tabs-layout' },
      h('div', { className: 'w-tabs', role: 'tablist', 'aria-label': label }, items.map((item, index) => h('button', {
        type: 'button', role: 'tab', key: item.id, id: id + '-' + item.id, 'aria-controls': id + '-panel', 'aria-selected': active === item.id, tabIndex: active === item.id ? 0 : -1,
        onClick: () => onChange(item.id), onKeyDown: event => keys(event, index),
      }, item.label, item.count !== undefined ? h('span', { className: 'w-count' }, item.count) : null))),
      h('div', { className: 'w-tab-panel', id: id + '-panel', role: 'tabpanel', 'aria-labelledby': id + '-' + active }, children));
  }
  function Status({ children, tone = 'info', className }) {
    if (!children) return null;
    return h('div', { className: cx('dshw', 'w-status', 'w-status-' + tone, className), role: tone === 'error' ? 'alert' : 'status', 'aria-live': tone === 'error' ? 'assertive' : 'polite' }, h(Icon, { name: tone === 'success' ? 'check' : 'info', size: 18 }), h('div', null, children));
  }
  function Empty({ title, children, action, icon = 'file' }) {
    return h('div', { className: 'dshw w-empty' }, h(Styles, { key: 'styles' }), h(Icon, { name: icon, size: 32 }), h('h2', null, title), children ? h('div', { className: 'w-muted' }, children) : null, action ? h('div', { className: 'w-toolbar' }, action) : null);
  }
  function Split({ list, detail, selected, onBack, backLabel, className, listWidth = 360 }) {
    const ref = useRef(null);
    useEffect(() => {
      if (!selected || !ref.current || ref.current.clientWidth > 760) return;
      const heading = ref.current.querySelector('.w-detail h2');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }, [selected]);
    return h('div', { ref, className: cx('w-split', className), 'data-selected': selected ? 'true' : 'false', style: { '--w-list-width': listWidth + 'px' } },
      h('div', { className: 'w-master' }, list),
      h('div', { className: 'w-detail' }, selected ? h(Button, { className: 'w-back', icon: 'left', variant: 'ghost', onClick: onBack }, backLabel) : null, detail));
  }
  function Row({ title, meta, description, active, onClick, children, status, className, disabled }) {
    return h('div', { className: cx('w-row', active && 'w-selected', className) },
      children ? h('div', { className: 'w-row-select' }, children) : null,
      h('button', { type: 'button', className: 'w-row-button', onClick, disabled, 'aria-pressed': !!active },
        h('span', { className: 'w-row-head' }, h('strong', null, title), status ? h('span', { className: 'w-tag' }, status) : null),
        meta ? h('span', { className: 'w-row-meta' }, meta) : null,
        description ? h('span', { className: 'w-row-description' }, description) : null));
  }
  function Search({ label, value, onChange, ...props }) {
    const id = useId();
    return h('div', { className: 'w-search' }, h(Icon, { name: 'search', size: 18 }), h('input', { type: 'search', id, 'aria-label': label, placeholder: label, value, onChange, ...props }));
  }
  function Switch({ label, checked, onChange, disabled }) {
    return h('label', { className: 'w-switch-label' }, h('span', null, label), h('input', { type: 'checkbox', role: 'switch', checked, disabled, onChange, 'aria-label': label }), h('span', { className: 'w-switch-track', 'aria-hidden': true }));
  }
  function Dialog({ title, children, onClose, closeLabel, className, busy = false }) {
    const id = useId(), panel = useRef(null);
    useEffect(() => {
      const previous = document.activeElement;
      panel.current?.querySelector('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')?.focus();
      return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
    }, []);
    function keydown(event) {
      if (event.key === 'Escape' && !event.isComposing) { event.preventDefault(); event.stopPropagation(); if (!busy) onClose(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...panel.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')].filter(node => node.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (!controls.length) { event.preventDefault(); panel.current.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    return h('div', { className: 'dshw w-overlay', onClick: event => { if (!busy && event.target === event.currentTarget) onClose(); } },
      h(Styles, { key: 'styles' }),
      h('section', { ref: panel, className: cx('w-dialog', className), role: 'dialog', 'aria-modal': true, 'aria-labelledby': id, tabIndex: -1, onKeyDown: keydown },
        h('header', { className: 'w-dialog-header' }, h('h2', { id }, title), h(IconButton, { icon: 'close', label: closeLabel, disabled: busy, onClick: onClose })), h('div', { className: 'w-dialog-body' }, children)));
  }
  function register(ctx, { id, label, icon, component, inject, order = 50 }) {
    // The two slots are optional. Existing settings and manual tools still load
    // in hosts without a workbench, while RC.3 owns navigation/pinning itself.
    ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: id, inject: () => ({ ...(inject?.() || {}), workbench: true }) }, component));
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id, order, label }, function WorkbenchIcon({ size }) { return h(Icon, { name: icon, size }); }));
  }
  const styles = `
.dshw{--w-bg:var(--dsw-alias-bg-layer-1,#fff);--w-soft:var(--dsw-alias-bg-layer-2,#f7f8fa);--w-text:var(--dsw-alias-label-primary,#18202c);--w-muted:var(--dsw-alias-label-secondary,#667085);--w-border:var(--dsw-alias-border-l3,#e7e9ef);--w-accent:var(--dsh-plugin-workbench-accent,#4f6bdb);--w-selected:color-mix(in srgb,var(--w-accent) 10%,var(--w-bg));--w-primary:var(--w-text);--w-on-primary:var(--w-bg);container-type:inline-size;container-name:dsh-workbench;color:var(--w-text);font:14px/1.65 var(--dsh-font-family-content,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif);min-width:0;max-width:100%;box-sizing:border-box;text-align:start;color-scheme:inherit}
.dshw *,.dshw *:before,.dshw *:after{box-sizing:border-box}.dshw h1,.dshw h2,.dshw h3,.dshw h4,.dshw p{margin:0}.dshw h1{font-size:30px;line-height:1.25;letter-spacing:-.025em;font-weight:650}.dshw h2{font-size:24px;line-height:1.35;font-weight:650;letter-spacing:-.015em;overflow-wrap:anywhere}.dshw h3,.dshw h4{font-size:16px;line-height:1.4;font-weight:600}.dshw a{color:var(--w-accent);text-underline-offset:3px;overflow-wrap:anywhere}.dshw button,.dshw input,.dshw select,.dshw textarea{font:inherit;color:inherit;max-width:100%}.dshw input:not([type=checkbox]):not([type=radio]):not([type=file]),.dshw select,.dshw textarea{background:var(--dsw-specific-input-major,var(--w-bg));border:1px solid var(--w-border);border-radius:8px;padding:8px 11px;min-width:0;line-height:1.5}.dshw input:not([type=checkbox]):not([type=radio]):not([type=file]),.dshw select{min-height:38px}.dshw textarea{resize:vertical}.dshw input[type=checkbox],.dshw input[type=radio]{width:16px;height:16px;flex-shrink:0;accent-color:var(--w-accent)}.dshw :focus-visible{outline:2px solid var(--w-accent);outline-offset:3px}.dshw button:disabled,.dshw input:disabled,.dshw select:disabled,.dshw textarea:disabled{opacity:.5;cursor:not-allowed}.dshw label{font-size:13px}.dshw fieldset{min-width:0;border:1px solid var(--w-border);border-radius:8px}.dshw summary{cursor:pointer;font-weight:550;list-style:none;display:flex;align-items:center;gap:8px}.dshw summary::-webkit-details-marker{display:none}.dshw summary:after{content:'';display:block;margin-inline-start:auto;width:7px;height:7px;border-inline-end:1.75px solid currentColor;border-bottom:1.75px solid currentColor;transform:rotate(45deg);flex-shrink:0}.dshw details[open]>summary:after{transform:rotate(225deg)}.dshw details>summary+*{margin-top:12px}.dshw pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;max-width:100%;background:var(--w-soft);border-radius:6px;padding:14px}.dshw img,.dshw video,.dshw iframe{max-width:100%}
.w-page{display:flex;flex-direction:column;position:relative;padding:0;min-height:540px;gap:0}.w-page[data-main=true]{height:100%;min-height:0;padding:calc(24px + var(--dsh-frame-top-clearance,0px)) 28px 0 max(28px,var(--dsh-frame-leading-clearance,0px));overflow:auto}.dshw[data-main=true]{background:var(--w-bg)}.dshw.w-page,.dshw .w-body,.dshw .w-tab-panel{overflow-x:clip}.w-page-header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding-bottom:22px;flex-shrink:0}.w-heading{min-width:0}.w-subtitle{margin-top:8px!important;font-size:14px;color:var(--w-muted);line-height:1.6}.w-header-actions,.w-toolbar,.w-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}.w-header-actions{justify-content:flex-end}.w-body,.w-tabs-layout{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}.w-body{overflow:auto}.w-tab-panel{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:auto}.w-tabs{display:flex;align-items:stretch;gap:20px;border-bottom:1px solid var(--w-border);flex-shrink:0;overflow-x:auto;scrollbar-width:thin}.dshw .w-tabs>button{border:0;border-bottom:2px solid transparent;background:transparent;padding:11px 8px 13px;white-space:nowrap;font-size:14px;font-weight:550;cursor:pointer;color:var(--w-muted);display:flex;align-items:center;gap:7px}.dshw .w-tabs>button[aria-selected=true]{border-bottom-color:var(--w-accent);color:var(--w-accent)}.w-count,.w-tag{font-size:12px;line-height:1.5;display:inline-flex;align-items:center;flex-shrink:0;background:var(--w-soft);border-radius:5px;padding:1px 6px;color:var(--w-muted)}.w-tabs [aria-selected=true] .w-count,.w-selected .w-tag{color:var(--w-accent);background:var(--w-selected)}
.dshw .w-button{display:inline-flex;justify-content:center;align-items:center;gap:7px;background:var(--w-bg);border:1px solid var(--w-border);border-radius:8px;padding:8px 12px;min-height:36px;line-height:1.4;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;white-space:normal}.dshw .w-button:not(:disabled):hover{background:var(--w-soft)}.dshw .w-primary{background:var(--w-primary);border-color:var(--w-primary);color:var(--w-on-primary)}.dshw .w-primary:not(:disabled):hover{background:var(--w-primary);opacity:.9}.dshw .w-ghost{background:transparent;border-color:transparent}.dshw .w-danger{color:var(--dsw-alias-state-error-primary,#b43c3c)}.dshw .w-icon-button{width:36px;min-width:36px;padding:8px}.dshw .w-button svg{flex-shrink:0}.w-muted{color:var(--w-muted);font-size:12px;line-height:1.6}.w-section{padding:24px 0;border-bottom:1px solid var(--w-border);min-width:0}.w-section>h3{margin-bottom:12px}.w-section>p+p{margin-top:8px}.w-fields{display:grid;gap:16px;min-width:0}.w-field{display:grid;gap:6px;min-width:0}.w-field>input,.w-field>select,.w-field>textarea{width:100%}.w-status{display:flex;align-items:flex-start;gap:8px;padding:11px 13px;margin:12px 0;border:1px solid var(--w-border);border-radius:8px;background:var(--w-soft);font-size:13px;overflow-wrap:anywhere;flex-shrink:0}.w-status>svg{flex-shrink:0;margin-top:2px}.w-status-error{color:var(--dsw-alias-state-error-primary,#ad3636)}.w-status-success{color:var(--dsw-alias-state-success-primary,#24794a)}.w-status-warn{color:var(--dsw-alias-state-warning-primary,#8a5a00)}.w-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;width:100%;max-width:580px;padding:48px 24px;margin:auto;min-height:280px;overflow-wrap:anywhere}.w-empty>svg{color:var(--w-muted)}.w-empty h2{font-size:20px}.w-empty .w-muted{font-size:14px}.w-empty .w-toolbar{justify-content:center}
.w-split{display:grid;grid-template-columns:minmax(240px,var(--w-list-width)) minmax(0,1fr);min-height:460px;flex:1;min-width:0}.w-master{min-width:0;border-inline-end:1px solid var(--w-border);overflow:auto;padding-bottom:24px}.w-detail{min-width:0;padding:26px 28px;overflow:auto;overflow-wrap:anywhere;display:flex;flex-direction:column}.w-master-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:20px 16px}.w-search{display:flex;align-items:center;gap:8px;border:1px solid var(--w-border);border-radius:8px;padding:0 10px;min-width:0;flex:1;background:var(--w-bg)}.w-search>svg{color:var(--w-muted);flex-shrink:0}.dshw .w-search>input{border:0!important;background:transparent!important;padding:8px 0!important;width:100%;outline-offset:0}.w-row{display:flex;gap:0;min-width:0;position:relative;border-bottom:1px solid var(--w-border);border-inline-start:3px solid transparent}.w-row-select{display:flex;align-items:flex-start;padding:21px 0 0 14px}.dshw .w-row-button{display:flex;flex-direction:column;align-items:stretch;gap:7px;text-align:start;width:100%;padding:18px 18px 18px 16px;border:0;background:transparent;color:inherit;min-width:0;cursor:pointer;line-height:1.5}.dshw .w-row-button:hover{background:var(--w-soft)}.w-row-head{display:flex;align-items:flex-start;gap:10px;justify-content:space-between;min-width:0}.w-row-head>strong{font-size:14px;line-height:1.5;font-weight:600;overflow-wrap:anywhere}.w-row-meta,.w-row-description{color:var(--w-muted);font-size:12px;line-height:1.6;overflow-wrap:anywhere}.w-row-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.w-selected{background:var(--w-selected);border-inline-start-color:var(--w-accent)}.w-back{display:none!important}.w-detail-title{margin-bottom:12px!important}.w-detail-meta{color:var(--w-muted);font-size:13px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.w-detail-footer{padding:24px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:auto;border-top:1px solid var(--w-border)}.w-detail-footer .w-muted{flex:1;min-width:160px}.w-definition{display:grid;grid-template-columns:minmax(80px,120px) minmax(0,1fr);gap:8px 16px;font-size:14px;margin:20px 0}.w-definition dt{color:var(--w-muted)}.w-definition dd{margin:0;min-width:0;overflow-wrap:anywhere}
.w-switch-label{display:inline-flex;align-items:center;gap:8px;font-size:13px;position:relative;cursor:pointer}.w-switch-label>input{position:absolute;opacity:0;inset-inline-end:0;width:36px!important;height:22px!important;margin:0;cursor:pointer}.w-switch-track{width:36px;height:22px;border-radius:12px;display:block;background:var(--w-border);border:1px solid var(--w-border);pointer-events:none;padding:2px;transition:background .15s}.w-switch-track:before{content:'';display:block;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0002;transition:transform .15s}.w-switch-label>input:checked+.w-switch-track{background:var(--w-accent);border-color:var(--w-accent)}.w-switch-label>input:checked+.w-switch-track:before{transform:translateX(14px)}.w-switch-label>input:focus-visible+.w-switch-track{outline:2px solid var(--w-accent);outline-offset:3px}.w-switch-label:has(>input:disabled){opacity:.5;cursor:not-allowed}
.w-overlay{position:fixed;inset:0;background:#0005;display:flex;justify-content:flex-end;z-index:1000;padding:12px;overflow:auto}.w-dialog{width:min(620px,100%);max-height:100%;display:flex;flex-direction:column;min-height:0;background:var(--w-bg);color:var(--w-text);border:1px solid var(--w-border);border-radius:12px;box-shadow:0 18px 70px #0003}.w-dialog-header{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid var(--w-border);flex-shrink:0}.w-dialog-header>h2{font-size:20px}.w-dialog-body{overflow:auto;padding:20px 24px;min-height:0}.w-editor-grid{display:grid;grid-template-columns:210px minmax(0,1fr) 300px;min-height:500px;flex:1}.w-editor-list{padding:20px 12px;border-inline-end:1px solid var(--w-border);min-width:0}.w-editor-canvas{background:var(--w-soft);padding:20px;min-width:0;display:flex;flex-direction:column;gap:14px}.w-editor-inspector{padding:24px;border-inline-start:1px solid var(--w-border);min-width:0;overflow:auto}.w-editor-inspector h3{margin-bottom:18px}.w-preview-empty{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:12px;aspect-ratio:16/9;min-height:180px;background:var(--w-soft);border:1px solid var(--w-border);border-radius:8px;padding:24px;color:var(--w-muted)}.w-content-pad{padding:24px 0}.w-stack{display:flex;flex-direction:column;gap:16px;min-width:0}.w-scroll-x{overflow:auto;max-width:100%}
@container dsh-workbench (max-width:1000px){.w-editor-grid{grid-template-columns:160px minmax(0,1fr)}.w-editor-inspector{grid-column:1/-1;border-inline-start:0;border-top:1px solid var(--w-border)}.w-header-actions{max-width:60%}.w-split{grid-template-columns:minmax(240px,32%) minmax(0,1fr)}}
@container dsh-workbench (max-width:760px){.w-page-header{gap:14px;flex-wrap:wrap;padding-bottom:18px}.w-heading{flex:1;min-width:170px}.dshw h1{font-size:24px}.w-header-actions{max-width:100%;justify-content:flex-start}.w-subtitle{font-size:13px}.w-tabs{gap:12px}.dshw .w-tabs>button{padding:10px 4px 12px}.w-split{display:block;min-height:360px}.w-split[data-selected=false]>.w-detail{display:none}.w-split[data-selected=true]>.w-master{display:none}.w-master{border-inline-end:0}.w-detail{padding:20px 0}.w-back{display:inline-flex!important;align-self:flex-start;margin:0 0 16px!important}.w-detail h2{font-size:22px}.w-master-toolbar{padding:16px 0}.dshw .w-row-button{padding:16px 10px}.w-detail-footer{position:static}.w-detail-footer .w-muted{flex-basis:100%}.w-editor-grid{display:flex;flex-direction:column}.w-editor-list{border-inline-end:0;border-bottom:1px solid var(--w-border);padding:16px 0}.w-editor-canvas{padding:16px 0;background:var(--w-bg)}.w-editor-inspector{padding:20px 0}.w-dialog-header,.w-dialog-body{padding:16px}.w-button{min-height:40px}.w-definition{grid-template-columns:80px minmax(0,1fr)}}
@media(max-width:700px){.w-page[data-main=true]{padding:calc(16px + var(--dsh-frame-top-clearance,0px)) 16px 0 max(16px,var(--dsh-frame-leading-clearance,0px))}.w-overlay{padding:8px}.w-dialog{width:100%}}
@media(prefers-reduced-motion:reduce){.dshw *,.dshw *:before{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;
  function Styles() { return h('style', null, styles); }
  return { Icon, Button, IconButton, Page, Tabs, Status, Empty, Split, Row, Search, Switch, Dialog, Styles, register, styles };
}

/* One update control per plugin. Only transport, idle guards and installation
 * coordination are shared; no global update page or update-all action exists. */
function __stardustUpdatesGuards() {
  const key = Symbol.for('stardustlc.plugin-updates.guards.v1');
  return globalThis[key] ||= { values: new Map(), listeners: new Set(), viewListeners: new Set(), clients: new Set() };
}
function __stardustUpdatesGuard(React, name, { dirty = false, busy = false, retainOnClose = false } = {}) {
  const token = React.useRef(null);
  if (!token.current) token.current = {};
  React.useLayoutEffect(() => {
    const pool = __stardustUpdatesGuards();
    if (!dirty && !busy) for (const [key, value] of pool.values) if (value.name === name && value.orphan) pool.values.delete(key);
    pool.values.set(token.current, { name, dirty: !!dirty, busy: !!busy, retainOnClose, orphan: false });
    for (const listener of pool.listeners) listener();
  }, [name, !!dirty, !!busy, retainOnClose]);
  React.useEffect(() => () => {
    const pool = __stardustUpdatesGuards(), value = pool.values.get(token.current);
    if (value?.retainOnClose && (value.dirty || value.busy)) value.orphan = true;
    else pool.values.delete(token.current);
    for (const listener of pool.listeners) listener();
  }, []);
}
function __StardustPluginUpdatesFooter({ React, name }) {
  const [, render] = React.useState(0), pool = __stardustUpdatesGuards();
  React.useEffect(() => { const fn = () => render(value => value + 1); pool.viewListeners.add(fn); return () => pool.viewListeners.delete(fn); }, []);
  const client = [...pool.clients].find(client => typeof client.Footer === 'function' && client.has(name));
  if (!client) return null;
  return React.createElement(client.Footer, { name });
}
function __stardustUpdatesFooter(React, name) {
  return React.createElement(__StardustPluginUpdatesFooter, { key: 'plugin-updates', React, name });
}
function __stardustUpdatesInlinePage(React, element, name) {
  return React.cloneElement(element, null, element.props.children, __stardustUpdatesFooter(React, name));
}
function __stardustUpdatesDetailName(subject, rows) {
  if (!subject || !['bundle', 'row'].includes(subject.kind)) return null;
  if (subject.kind === 'row' && subject.pkg?.name === '@stardustlc/dsh-suite') {
    const component = rows.find(row => row.bundledBy === subject.pkg.name && (subject.row?.moduleName === row.name || subject.row?.moduleName?.startsWith(row.name + '/')));
    if (component) return component.name;
  }
  return rows.some(row => row.name === subject.pkg?.name) ? subject.pkg.name : null;
}
function __stardustUpdatesNativeFormState(document) {
  let dirty = false, busy = false;
  for (const scope of document.querySelectorAll('[data-plugin-detail],[data-plugin-row-detail]')) for (const button of scope.querySelectorAll('button')) {
    if (!button.getClientRects().length || button.closest('.plugin-updates-footer')) continue;
    const label = (button.getAttribute('aria-label') || button.textContent || '').trim();
    if (/^(?:正在保存|保存中|Saving)(?:[.…\s]|$)/i.test(label) || button.getAttribute('aria-busy') === 'true') busy = true;
    if (!button.disabled && button.getAttribute('aria-disabled') !== 'true' && /^(?:保存(?:更改|设置|配置)?|Save(?: changes| settings| configuration)?)(?:\s+(?:Ctrl|⌘|Enter|↵).*)?$/i.test(label)) dirty = true;
  }
  return { dirty, busy };
}
function __stardustUpdatesDisplayRows(next, known) {
  for (const row of next.rows) known.set(row.name, row);
  if (!['verifying', 'installing', 'cancelling', 'unknown', 'restore-failed'].includes(next.job?.state)) return next;
  const rows = [...next.rows];
  for (const row of known.values()) if ((row.name === next.job.name || row.bundledBy === next.job.name) && !rows.some(item => item.name === row.name)) rows.push({ ...row, updating: true });
  return { ...next, rows };
}
function __stardustUpdatesSuiteRows(next, participants) {
  // Transitive Suite rows identify the migration entry in existing workbenches.
  const suite = next.rows.find(row => row.name === '@stardustlc/dsh-suite' && row.enabled);
  if (!suite) return next;
  const rows = [...next.rows], names = new Set(rows.map(row => row.name));
  for (const item of participants) if (item.suiteComponent && item.packageVersion && item.label && !names.has(item.name)) {
    names.add(item.name);
    rows.push({ name: item.name, version: item.packageVersion, enabled: true, sourceKind: 'suite', loadError: false, label: item.label, labelEn: item.labelEn, bundledBy: suite.name });
  }
  return { ...next, rows };
}
function __stardustUpdatesWrap(definition, participant) {
  return { ...definition, factory(require) {
    const original = definition.factory(require);
    if (!original || typeof original !== 'object') return original;
    const React = require('react');
    return { ...original, apply(ctx, ...args) {
      const result = original.apply?.call(this, ctx, ...args);
      // The optional alpha.3 slot stays dormant in older hosts; its scoped
      // injection unregisters naturally when the plugin is unloaded.
      if (participant.iconData && participant.sectionIds?.length && typeof ctx.inject === 'function') ctx.inject(['slots'], host => {
        for (const id of new Set(participant.sectionIds)) host.slots.inject('settings.section.icon', () => host.slots.register({ name: 'settings.section.icon', id }, function PluginSettingsIcon({ size = 20 }) {
          return React.createElement('img', { src: participant.iconData, alt: '', 'aria-hidden': true, width: size, height: size, style: { objectFit: 'contain', display: 'block', flexShrink: 0 } });
        }));
      });
      if (typeof ctx.inject === 'function') ctx.inject(['slots', 'locale', 'remote', 'remote.pluginManager'], host => __stardustUpdatesJoin(host, React, require, participant));
      return result;
    } };
  } };
}
function __stardustUpdatesJoin(host, React, require, participant) {
  const key = Symbol.for('stardustlc.plugin-updates.client.v1'), pools = globalThis[key] ||= new WeakMap(), root = host.root || host;
  if (typeof root.plugin !== 'function') return;
  let record = pools.get(root);
  if (!record) {
    record = { refs: new Map(), timer: null, version: participant.version, alive: true, hold: false, uiRevision: 3, migration: Promise.resolve() };
    pools.set(root, record);
    __stardustUpdatesActivate(record, pools, root, React, require);
  } else if ((record.uiRevision || 0) < 3 && !record.upgrading) {
    // The first loaded participant may still own a pre-footer client. Keep
    // its references and draft guards, wait for any admitted install, then
    // replace that one client fiber instead of running two window heartbeats.
    const shared = record;
    const previousMigration = record.migration;
    record.upgrading = record.migration = Promise.resolve(previousMigration).then(async () => {
      while (shared.alive && shared.hold) await new Promise(resolve => setTimeout(resolve, 500));
      if (!shared.alive || !shared.refs.size) return;
      await shared.fiber?.dispose?.();
      if (!shared.refs.size) return;
      shared.alive = true; shared.uiRevision = 3; pools.set(root, shared);
      __stardustUpdatesActivate(shared, pools, root, React, require);
    }).catch(() => { /* The original page remains usable if host disposal fails. */ });
  }
  clearTimeout(record.timer);
  const ref = {}; record.refs.set(ref, participant);
  host.effect(() => () => {
    record.refs.delete(ref);
    const stop = () => {
      if (record.refs.size || !record.alive) return;
      if (record.hold) { record.timer = setTimeout(stop, 1000); return; }
      record.alive = false; Promise.resolve(record.fiber?.dispose?.()).catch(() => {});
    };
    if (!record.refs.size) record.timer = setTimeout(stop, 1000);
  });
}
function __stardustUpdatesActivate(shared, pools, root, React, require) {
  shared.fiber = root.plugin({ name: 'stardustlc-plugin-updates-client', inject: ['slots', 'locale', 'remote', 'remote.pluginManager'], apply(ctx) {
    const client = __stardustUpdatesClient(ctx, React, require, shared);
    ctx.effect(() => () => { shared.alive = false; client.dispose(); if (pools.get(root) === shared) pools.delete(root); });
  } });
  Promise.resolve(shared.fiber).catch(() => { shared.alive = false; if (pools.get(root) === shared) pools.delete(root); });
}
function __stardustUpdatesClient(ctx, React, require, shared) {
  const h = React.createElement, W = createWorkbenchUI(React), route = new URL('api/stardustlc/plugin-updates', document.baseURI);
  const { useState, useEffect } = React, id = crypto.randomUUID(), listeners = new Set(), pool = __stardustUpdatesGuards(), requests = new Set(), notified = new Set(), knownRows = new Map();
  let alive = true, registered = false, state = null, lastInteraction = Date.now(), inPoll = false, manualOperation = false, legacyHint = null;
  const language = () => String(ctx.locale?.getSnapshot?.().active || '').startsWith('en') ? 'en' : 'zh';
  const t = (zh, en) => language() === 'en' ? en : zh;
  const preferences = name => state?.preferences.packages[name] || { checkEnabled: true, autoInstall: false, deferredUntil: 0, ignoredVersion: null };
  const rowFor = name => state?.rows.find(row => row.name === name);
  const activeJob = () => ['verifying', 'installing', 'cancelling'].includes(state?.job?.state);
  function notify() { shared.hold = manualOperation || activeJob(); for (const listener of listeners) listener(); for (const listener of pool.viewListeners) listener(); }
  async function api(body = { action: 'state' }) {
    const controller = new AbortController(); requests.add(controller);
    const timeout = setTimeout(() => controller.abort(), ['check', 'check-when-due'].includes(body.action) ? 95000 : 45000);
    try {
      const response = await fetch(route, { method: 'POST', credentials: 'same-origin', cache: 'no-store', signal: controller.signal, headers: { 'content-type': 'application/json', 'x-stardustlc-updates': '1' }, body: JSON.stringify(body) });
      let data; try { data = await response.json(); } catch { throw new Error('service-unavailable'); }
      if (!response.ok || !data.ok) throw new Error(response.status === 403 ? 'owner-required' : data.code || 'service-unavailable');
      return data.value;
    } catch (error) { if (error?.name === 'AbortError') throw new Error('service-unavailable'); throw error; }
    finally { clearTimeout(timeout); requests.delete(controller); }
  }
  function pageState(manual = manualOperation) {
    const values = [...pool.values.values()], nativeForm = __stardustUpdatesNativeFormState(document);
    const dialog = [...document.querySelectorAll('[role="dialog"],dialog[open]')].some(node => node.getClientRects().length && !(manual && (node.closest('.plugin-updates-footer') || node.querySelector('.plugin-updates-footer'))));
    return { action: 'heartbeat', id, dirty: nativeForm.dirty || values.some(value => value.dirty), busy: nativeForm.busy || values.some(value => value.busy) || dialog, idleForMs: Math.min(86400000, Math.max(0, Date.now() - lastInteraction)) };
  }
  const heartbeat = () => api(pageState());
  function interaction() { lastInteraction = Date.now(); if (registered && alive) void heartbeat().catch(() => {}); }
  const guardChanged = () => { if (registered && alive) void heartbeat().catch(() => {}); };
  for (const event of ['pointerdown', 'keydown', 'input']) document.addEventListener(event, interaction, { capture: true, passive: true });
  pool.listeners.add(guardChanged);
  const close = () => { void fetch(route, { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'content-type': 'application/json', 'x-stardustlc-updates': '1' }, body: JSON.stringify({ action: 'client-close', id }) }).catch(() => {}); };
  window.addEventListener('pagehide', close);
  async function refresh() { const next = await api(); if (alive) { state = __stardustUpdatesDisplayRows(__stardustUpdatesSuiteRows(next, shared.refs.values()), knownRows); notify(); } return next; }
  function useSnapshot() {
    const [, render] = useState(0);
    useEffect(() => { const fn = () => render(value => value + 1); listeners.add(fn); const stop = ctx.locale?.subscribe?.(fn); return () => { listeners.delete(fn); stop?.(); }; }, []);
    return state;
  }
  function message(code) {
    return ({
      'page-dirty': t('有未保存的修改。请先保存或放弃修改，再更新。', 'Save or discard unsaved changes before updating.'),
      'page-busy': t('有页面操作或对话框尚未结束，请完成后再试。', 'Finish the active page operation or close its dialog, then retry.'),
      'page-not-ready': t('还有窗口状态未确认，或旧版插件尚未提供状态保护。请刷新相关窗口，必要时先手动更新旧版插件。', 'A window state is unknown or an older plugin lacks state protection. Refresh the affected windows and manually update legacy plugins if needed.'),
      busy: t('DSH 正在执行任务或安装，请等操作结束。', 'DSH is running a task or installation. Wait for it to finish.'),
      'activity-unknown': t('无法确认任务是否空闲，已暂停安装。', 'Installation paused because task activity is unknown.'),
      'restart-required': t('更新服务需要重启后继续。请在方便时手动重启 DSH。', 'The updater needs a restart. Restart DSH manually when convenient.'),
      'operation-unconfirmed': t('上次安装未确认或恢复失败。请在官方插件管理中检查并修复，之后手动重启 DSH。', 'The last installation is unconfirmed or recovery failed. Check and repair it in native plugin management, then restart DSH manually.'),
      'check-first': t('检查结果已过期，请重新检查。', 'This check expired. Check again.'),
      'release-changed': t('发布信息已变化，本次未安装。请重新检查。', 'Release metadata changed. Nothing was installed; check again.'),
      'preferences-conflict': t('另一个窗口修改了偏好，已刷新，请重试。', 'Preferences changed in another window. They have been refreshed; retry.'),
      'preferences-unreadable': t('更新偏好文件无法读取，自动安装已关闭。请检查当前 profile 的 stardustlc-plugin-updates.json。', 'Preferences could not be read. Automatic installation is off. Check stardustlc-plugin-updates.json in this profile.'),
      'no-update': t('版本已变化或暂不兼容，请重新检查。', 'The version changed or is incompatible. Check again.'),
      'source-not-registry': t('本地源码、Git 等安装，请通过原安装方式更新。', 'Update local, Git and other external sources through their original installation method.'),
      'managed-by-suite': t('先将 Suite 组件迁移为独立安装。', 'Convert Suite components to independent installations first.'),
      'suite-hmr-required': t('切换安装方式需要宿主启用热重载。', 'Converting Suite requires Host hot reload.'),
      'suite-inventory-changed': t('套件与独立插件的安装状态或 Loader 条目不一致，请在原生插件详情检查。', 'Suite and standalone bundle inventory or Loader entries differ. Review native plugin details.'),
      'suite-stage-failed': t('切换安装方式时宿主报告失败，请在插件管理中查看详情。', 'The Host reported a conversion failure. See native plugin management for details.'),
      'suite-recovery-required': t('Suite 的上次切换等待恢复。', 'The previous Suite conversion needs recovery.'),
      'suite-recovery-unreadable': t('Suite 恢复记录无法读取，请在原生插件管理中检查已安装组件。', 'The Suite recovery record is unreadable. Check the installed bundles in native plugin management.'),
      'owner-required': t('只有 profile 拥有者能管理更新。', 'Only the profile owner can manage updates.'),
      'version-mismatch': t('宿主装入的版本与目标不同。请重新检查版本和软件源策略。', 'The installed version differs from the target. Check the release and registry policy.'),
      'unexpected-package': t('宿主装入的包或版本与目标不同。请检查版本和软件源策略。', 'The installed package or version differed from the target. Check the release and registry policy.'),
      'version-unconfirmed': t('尚未确认新版已加载，请在插件详情中检查当前版本。', 'The new version could not be confirmed. Check the installed version in plugin details.'),
      'build-blocked': t('构建脚本等待批准。请查看原生插件管理中的安装提示。', 'Build scripts await approval. Review the install details in native plugin management.'),
    })[code] || t('操作未完成，请刷新后重试。DSH 不会因此自动重启。', 'The operation could not be completed. Refresh and retry. DSH will not restart automatically.');
  }
  // releaseOf() keeps the failing engine/peer range check as a stable code; say which
  // environment has to change instead of only reporting that the release is incompatible.
  function requirement(release) {
    return ({
      'dsh-version': t('需要换成与该版本匹配的 DSH 本体', 'it needs a different DSH version'),
      'node-version': t('需要换成与该版本匹配的 Node.js', 'it needs a different Node.js version'),
      deprecated: t('作者已把这个版本标记为弃用', 'the author marked this release as deprecated'),
      'not-bundle': t('这个版本不是可加载的 DSH 插件包', 'this release is not a loadable DSH plugin bundle'),
    })[release?.reason] || t('发布元数据的兼容范围与当前环境不符', 'its published compatibility range does not match this environment');
  }
  function jobLabel(job) {
    if (job.mode === 'migration') {
      return ({
        complete: t('Suite 已切换为独立安装', 'Suite components are now installed independently'),
        'restart-required': t('切换配置已保存，等待重启', 'Conversion saved. Restart Harness to finish'),
        restored: t('切换失败，已恢复 Suite', 'Conversion failed; Suite restored'),
        'restore-failed': t('恢复 Suite 失败', 'Suite recovery failed'),
        cancelled: t('已取消切换', 'Conversion cancelled'),
        failed: t('切换失败', 'Conversion failed'),
      })[job.state] || ({
        checking: t('正在核对 Suite 组件', 'Checking Suite components'),
        installing: t('正在准备独立插件', 'Preparing independent bundles'),
        applying: t('正在切换加载方式', 'Switching bundle activation'),
        restoring: t('正在恢复 Suite', 'Restoring Suite'),
      })[job.phase];
    }
    if (job.state === 'installing') {
      const phase = ({
        checking: t('宿主正在检查版本', 'Host checking release'),
        removing: t('正在卸载旧版', 'Unloading the previous version'),
        applying: t('正在加载新版', 'Loading the new version'),
        restoring: t('正在恢复旧版', 'Restoring the previous version'),
      })[job.phase];
      if (phase) return phase;
    }
    return ({ verifying: t('正在核对版本', 'Verifying release'), installing: t('正在安装', 'Installing'), cancelling: t('正在请求取消', 'Requesting cancellation'), complete: t('已更新', 'Updated'), 'restart-required': t('已安装，等待你手动重启', 'Installed; manual restart needed'), restored: t('更新未成功，已恢复原版本', 'Update failed; previous version restored'), 'restore-failed': t('恢复未成功，请检查官方插件管理', 'Recovery failed; check native plugin management'), unknown: t('结果未确认，请检查官方插件管理', 'Result unconfirmed; check native plugin management'), cancelled: t('已取消', 'Cancelled'), failed: t('更新未成功', 'Update failed') })[job.state] || job.state;
  }
  function FooterFrame({ name, label, subtitle, actions, children }) {
    return h('section', { className: 'dshw plugin-updates-footer', 'data-plugin-update-footer': name, 'aria-label': label + t(' · 版本与更新', ' · Version and updates') },
      h('style', null, W.styles),
      h('style', null, '.plugin-updates-footer{box-sizing:border-box;flex-shrink:0;margin-top:28px;padding-top:18px;border-top:1px solid var(--dsw-alias-border-l3,#e5e7eb);min-width:0;max-width:100%;color:var(--dsw-alias-label-primary,#202124)}.plugin-updates-footer .updates-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px}.plugin-updates-footer h2{font-size:14px;line-height:22px;margin:0;font-weight:600}.plugin-updates-footer .updates-subtitle,.plugin-updates-footer .updates-version{font:12px/1.6 ui-monospace,monospace;overflow-wrap:anywhere;margin:4px 0}.plugin-updates-footer .updates-options{margin-top:12px}.plugin-updates-footer .updates-options>summary{cursor:pointer;font-size:12px;line-height:22px;color:var(--dsw-alias-label-secondary,#657080)}.plugin-updates-footer .updates-options>summary:focus-visible{outline:2px solid var(--dsw-focus-ring-color,#6b79df);outline-offset:4px}.plugin-updates-footer .updates-settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;padding:14px 0 0}.plugin-updates-footer .updates-note{margin:5px 0 0;font-size:12px;line-height:1.6}.plugin-updates-footer>.w-section{margin:10px 0 0;padding:0;border:0}.plugin-updates-footer .w-toolbar{margin-top:10px!important}.plugin-updates-footer .w-switch-label{max-width:100%;gap:12px;align-items:flex-start}.plugin-updates-footer .w-switch-track{flex-shrink:0}.plugin-updates-footer .updates-notes{margin-top:12px;padding:12px;border:1px solid var(--dsw-alias-border-l3,#e5e7eb);border-radius:10px}.plugin-updates-footer .updates-notes pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:240px;overflow:auto;font:12px/1.7 ui-monospace,monospace}.plugin-updates-footer .w-overlay{z-index:1002}@media(max-width:600px){.plugin-updates-footer .updates-head{gap:8px}.plugin-updates-footer .w-toolbar{gap:6px;flex-wrap:wrap}.plugin-updates-footer .w-button{max-width:100%}}'),
      h('div', { className: 'updates-head' }, h('div', null, h('h2', null, t('版本与更新', 'Version and updates')), h('p', { className: 'updates-subtitle w-muted' }, subtitle)), actions), children);
  }
  function Panel({ name }) {
    const snapshot = useSnapshot(), [error, setError] = useState(''), [working, setWorking] = useState(false), [checking, setChecking] = useState(false), [dialog, setDialog] = useState(null), [selectedVersion, setSelectedVersion] = useState(null), [notes, setNotes] = useState(null), [notesOpen, setNotesOpen] = useState(false), [loadingNotes, setLoadingNotes] = useState(false);
    const row = rowFor(name), target = name, prefs = preferences(name);
    const suiteEntry = !!row?.bundledBy || (name === '@stardustlc/dsh-suite' && row?.enabled);
    const managed = row?.sourceKind === 'registry' && !suiteEntry;
    const latestJob = snapshot?.job;
    const job = latestJob?.name === name || latestJob?.mode === 'migration' && (latestJob.requestedName === name || suiteEntry && activeJob()) ? latestJob : null;
    useEffect(() => {
      if (managed && prefs.checkEnabled) void api({ action: 'check-when-due', name }).then(refresh).catch(() => {});
    }, [name, managed, prefs.checkEnabled]);
    async function perform(callback) { setError(''); setWorking(true); try { await callback(); await refresh(); } catch (error) { setError(error.message); await refresh().catch(() => {}); } finally { setWorking(false); } }
    async function save(changes, consent) { await api({ action: 'preferences', name: target, revision: state.preferences.revision, changes, consent }); }
    async function check() { setError(''); setChecking(true); try { await api({ action: 'check', name: target }); await refresh(); } catch (error) { setError(error.message); } finally { setChecking(false); } }
    async function runOperation(request) {
      setDialog(null); manualOperation = true; notify();
      await perform(async () => {
        try {
          await heartbeat();
          const started = await api(request);
          while (alive) {
            await new Promise(resolve => setTimeout(resolve, 800)); await heartbeat(); await refresh();
            if (state.job?.id !== started.id) throw new Error('operation-unconfirmed');
            if (!activeJob()) break;
          }
        } finally { manualOperation = false; notify(); }
      });
    }
    async function showNotes() {
      if (notesOpen) { setNotesOpen(false); return; }
      setNotesOpen(true); setNotes(null); setLoadingNotes(true); setError('');
      try { setNotes(await api({ action: 'notes', name: target, version: row.release.version })); } catch (error) { setError(error.message); } finally { setLoadingNotes(false); }
    }
    if (!snapshot) return h(W.Status, null, t('正在读取更新状态…', 'Loading update status…'));
    const ownPage = pageState(true), unconfirmed = ['unknown', 'restore-failed'].includes(snapshot.job?.state);
    const pageBusy = ownPage.busy || (snapshot.pages.clients || []).some(client => client.id !== id && client.busy);
    const busy = working || activeJob() || snapshot.updaterRestart || snapshot.preferenceError || !snapshot.activity.known
      || snapshot.activity.busy || snapshot.pages.dirty || ownPage.dirty || pageBusy || !snapshot.pages.known;
    const installLocked = busy || unconfirmed || !!snapshot.suiteRecovery;
    const checkingThis = checking || snapshot.checkingNames?.includes(target);
    const canMigrate = snapshot.suiteMigration && !installLocked && !snapshot.pendingRestart;
    const canRecover = snapshot.suiteRecovery?.version && snapshot.suiteMigration && !busy && !snapshot.pendingRestart;
    const showUpdate = managed && row.available;
    const canConfirm = showUpdate && row.release.version === selectedVersion && !installLocked && !row.loadError;
    function progress() {
      if (!job) return null;
      const result = job.outcome?.result;
      const reason = job.reason || (result?.pendingBuilds || result?.failureKind === 'build-blocked' ? 'build-blocked' : result?.error?.code);
      const canCancel = activeJob() && !['applying', 'restoring'].includes(job.phase);
      return h('section', { className: 'w-section', role: 'status', 'aria-label': t('更新进度', 'Update progress') },
        h('h3', null, jobLabel(job)),
        job.to && h('p', { className: 'w-muted' }, job.from + ' → ' + job.to + (job.mode === 'automatic' ? t(' · 自动补丁', ' · Automatic patch') : '')),
        job.total && activeJob() && h('p', { className: 'w-muted' }, job.completed + ' / ' + job.total),
        reason && h(W.Status, { tone: 'error' }, message(reason)),
        canCancel && h(W.Button, { disabled: job.state === 'cancelling', onClick: () => perform(() => api({ action: 'cancel', id: job.id })) }, t('取消', 'Cancel')));
    }
    function windowControls() {
      if (!(snapshot.pages.clients || []).some(client => !client.fresh)) return null;
      return h('div', null,
        h(W.Status, null, h('p', null, t('有窗口已断开，无法确认是否还有未保存修改。仍在使用的窗口请先保存并刷新；已关闭的窗口可以手动重新确认。', 'A disconnected window may contain unsaved changes. Save and refresh windows still in use. If they are closed, you can confirm that manually.')), h(W.Button, { onClick: () => setDialog('windows') }, t('重新确认已关闭的窗口', 'Confirm closed windows'))),
        dialog === 'windows' && h(W.Dialog, { title: t('断开的窗口都已关闭？', 'Are the disconnected windows closed?'), closeLabel: t('关闭', 'Close'), onClose: () => setDialog(null) },
          h('div', { className: 'w-stack' }, h('p', null, t('只清除超过 45 秒未回应的其他窗口记录。请先确认它们已经关闭；仍在使用的窗口请保存修改并刷新。当前或仍在回应的窗口保护会保留。', 'Only other windows silent for over 45 seconds are cleared. Confirm that they are closed; save and refresh windows still in use. Current and responsive windows remain protected.')), h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('取消', 'Cancel')), h(W.Button, { onClick: () => { setDialog(null); void perform(() => api({ ...pageState(true), action: 'reconfirm-windows', confirmation: 'other-stale-windows-are-closed' })); } }, t('已关闭，重新确认状态', 'They are closed; reconfirm'))))));
    }
    function recoveryControls() {
      if (!snapshot.suiteRecovery) return null;
      if (snapshot.suiteRecovery.restartRequired) return h(W.Status, null, t('请重启 Harness。下次启动时会核对独立插件是否已加载。', 'Restart Harness. It will verify that the individual plugins loaded at startup.'));
      return h('div', null,
        h(W.Status, null, snapshot.suiteRecovery.awaitingVerification
          ? t('正在核对独立插件的加载状态。若仍有插件无法加载，可以恢复 Suite。', 'Checking the individual plugins. Recover Suite if any still fail to load.')
          : message(snapshot.suiteRecovery.error || 'suite-recovery-required')),
        snapshot.suiteRecovery.version && h(W.Button, { disabled: !canRecover, onClick: () => setDialog('recovery') }, t('恢复 Suite', 'Recover Suite')),
        dialog === 'recovery' && h(W.Dialog, { title: t('恢复上次 Suite 切换？', 'Recover the previous Suite conversion?'), closeLabel: t('关闭', 'Close'), onClose: () => setDialog(null) },
          h('div', { className: 'w-stack' },
            h('p', null, t('Harness 会核对当前组件状态，并按需恢复切换前的安装方式。', 'Harness checks the current component state and recovers the previous installation if needed.')),
            h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('取消', 'Cancel')),
              h(W.Button, { variant: 'primary', disabled: !canRecover, onClick: () => runOperation({ action: 'recover-suite', name, confirmation: 'restore-previous-suite' }) }, t('确认恢复', 'Recover'))))));
    }
    if (!row) return recoveryControls() || progress() || h(W.Status, null, t('此插件尚未安装或已从当前 profile 移除。', 'This plugin is not installed in the current profile.'));
    const title = language() === 'en' ? row.labelEn : row.label;
    if (suiteEntry) return h(FooterFrame, { name, label: title, subtitle: name + ' · ' + row.version, actions: h(W.Button, { variant: 'primary', disabled: !canMigrate, onClick: () => setDialog('migration') }, t('切换为独立安装', 'Use independent installations')) },
      h(W.Status, null, snapshot.suiteMigration ? t('组件随 Suite 安装。切换后即可单独更新。', 'These components are installed by Suite. Convert them for per-plugin updates.') : message('suite-hmr-required')),
      (snapshot.pages.dirty || ownPage.dirty) && h(W.Status, null, message('page-dirty')),
      (snapshot.activity.busy || pageBusy) && h(W.Status, null, message(snapshot.activity.busy ? 'busy' : 'page-busy')),
      snapshot.pendingRestart && h(W.Status, null, message('restart-required')),
      error && h(W.Status, { tone: 'error' }, message(error)),
      unconfirmed && h(W.Status, { tone: 'error' }, message('operation-unconfirmed')),
      windowControls(),
      recoveryControls(),
      progress(),
      dialog === 'migration' && h(W.Dialog, { title: t('将 Suite 组件切换为独立安装？', 'Convert Suite components to independent installations?'), closeLabel: t('关闭', 'Close'), onClose: () => setDialog(null) },
        h('div', { className: 'w-stack' }, h('p', null, t('Harness 会卸载旧 Suite 包，以当前版本登记各组件并恢复配置。切换期间组件会暂时卸载。', 'Harness removes the old Suite bundle and registers the components independently at the same versions with their existing settings. The components unload during the conversion.')),
          h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('取消', 'Cancel')), h(W.Button, { variant: 'primary', disabled: !canMigrate, onClick: () => runOperation({ action: 'migrate-suite', name, confirmation: 'convert-suite-to-independent-bundles' }) }, t('确认切换', 'Convert installations'))))));
    const status = row.sourceKind !== 'registry' ? t('请通过原安装方式更新', 'Update through the original installation method') : row.loadError ? t('加载异常，请先检查原生插件管理', 'Loading error. Check native plugin management') : row.error ? t('检查失败，可以重试', 'Check failed. Try again') : row.release && !row.release.compatible ? 'v' + row.release.version + ' · ' + requirement(row.release) + (row.release.required ? ' (' + row.release.required + ')' : '') : row.available ? (prefs.ignoredVersion === row.release.version ? t('已忽略提醒，仍可手动更新', 'Reminder ignored. Manual update available') : t('有兼容的新版本', 'Compatible update available')) : row.checkedAt ? t('当前已是最新稳定版', 'Latest stable version') : t('尚未检查', 'Not checked yet');
    const checkButton = variant => h(W.Button, { variant, icon: 'refresh', disabled: checkingThis || !managed, onClick: check }, checkingThis ? t('正在检查…', 'Checking…') : t('检查更新', 'Check for updates'));
    const primary = showUpdate
      ? h(W.Button, { variant: 'primary', icon: 'download', disabled: installLocked || row.loadError, onClick: () => { setSelectedVersion(row.release.version); setDialog('install'); } }, t('更新至 v', 'Update to v') + row.release.version)
      : managed ? checkButton() : null;
    return h(FooterFrame, { name, label: title, subtitle: name + ' · ' + row.version, actions: primary },
      h('section', { className: 'w-section' },
        h('p', { className: 'w-muted updates-note' }, status),
        showUpdate && row.blockedRelease && h('p', { className: 'w-muted updates-note' }, 'v' + row.blockedRelease.version + ' · ' + requirement(row.blockedRelease) + (row.blockedRelease.required ? ' (' + row.blockedRelease.required + ')' : '')),
        !row.enabled && h('p', { className: 'w-muted' }, t('当前已停用。', 'Currently disabled.')),
        row.checkedAt && h('p', { className: 'w-muted updates-note' }, t('上次检查 ', 'Last checked ') + new Date(row.checkedAt).toLocaleString(language() === 'en' ? 'en-US' : 'zh-CN')),
        h('div', { className: 'w-toolbar' },
          showUpdate && checkButton('ghost'),
          row.release && h(W.Button, { variant: 'ghost', onClick: showNotes, 'aria-expanded': notesOpen }, t('更新记录', 'Release notes')),
          showUpdate && h(W.Button, { variant: 'ghost', disabled: working, onClick: () => perform(() => api({ action: 'later', name: target, revision: state.preferences.revision })) }, t('明天再提醒', 'Remind me tomorrow')),
          showUpdate && prefs.ignoredVersion !== row.release.version && h(W.Button, { variant: 'ghost', disabled: working, onClick: () => perform(() => api({ action: 'ignore', name: target, revision: state.preferences.revision, version: row.release.version })) }, t('忽略此版本提醒', 'Ignore this reminder')))),
      notesOpen && h('section', { className: 'updates-notes', 'aria-label': t('更新记录', 'Release notes') }, h('strong', null, target + ' · ' + (notes?.version || row.release?.version || '')), loadingNotes ? h('p', null, t('正在读取…', 'Loading…')) : notes?.text ? h('pre', null, notes.text) : h('p', null, t('未找到此版本的独立更新记录。', 'No separate notes were found for this version.')), notes?.url && h('a', { href: notes.url, target: '_blank', rel: 'noreferrer noopener' }, t('查看仓库更新记录', 'View repository changelog'))),
      h('details', { className: 'updates-options' }, h('summary', null, t('更新选项', 'Update options'), ' · ', prefs.checkEnabled ? t('自动检查：开', 'Checks: on') : t('自动检查：关', 'Checks: off'), ' · ', prefs.autoInstall ? t('自动安装：开', 'Install: on') : t('自动安装：关', 'Install: off')), h('section', { className: 'updates-settings', 'aria-label': t('这个插件的更新偏好', 'Update preferences for this plugin') },
        h('div', null, h(W.Switch, { label: t('自动检查这个插件的更新', 'Automatically check this plugin'), checked: prefs.checkEnabled, disabled: working || !!snapshot.preferenceError || row.sourceKind !== 'registry', onChange: event => perform(() => save({ checkEnabled: event.target.checked })) }), h('p', { className: 'w-muted updates-note' }, t('默认开启，后台每 15 分钟检查。', 'On by default. Checks run every 15 minutes.'))),
        h('div', null, h(W.Switch, { label: t('空闲时自动安装这个插件的补丁', 'Install patches for this plugin while idle'), checked: prefs.autoInstall, disabled: working || !!snapshot.preferenceError || row.sourceKind !== 'registry', onChange: event => event.target.checked ? setDialog('automatic') : perform(() => save({ autoInstall: false })) }), h('p', { className: 'w-muted updates-note' }, t('默认关闭。明确开启后，仅空闲且没有未保存修改时安装兼容补丁。其他插件的开关不变。', 'Off by default. Explicitly enable compatible patches while idle with no unsaved changes. Other plugins’ settings stay unchanged.'))))),
      error && h(W.Status, { tone: 'error' }, message(error)), snapshot.preferenceError && h(W.Status, { tone: 'error' }, message('preferences-unreadable')),
      snapshot.pendingRestart && h(W.Status, null, snapshot.updaterRestart ? message('restart-required') : t('已有更新等待手动重启后生效。你可以继续工作，自动安装已暂停。', 'Some updates need a manual restart. Continue your work; automatic installation is paused.')),
      prefs.autoInstall && snapshot.autoReady === false && h(W.Status, null, message('page-not-ready')),
      windowControls(),
      (snapshot.pages.dirty || ownPage.dirty) && h(W.Status, null, message('page-dirty')), (snapshot.activity.busy || pageBusy) && h(W.Status, null, message(snapshot.activity.busy ? 'busy' : 'page-busy')),
      prefs.deferredUntil > Date.now() && h(W.Status, null, t('此插件已推迟提醒和自动安装 24 小时，仍可手动更新。', 'Reminders and automatic installation for this plugin are deferred for 24 hours. Manual updates remain available.')),
      unconfirmed && h(W.Status, { tone: 'error' }, message('operation-unconfirmed')),
      recoveryControls(),
      progress(),
      ['automatic', 'install'].includes(dialog) && h(W.Dialog, { title: dialog === 'automatic' ? t('允许这个插件自动安装补丁？', 'Allow automatic patches for this plugin?') : t('确认更新此插件', 'Confirm this plugin update'), closeLabel: t('关闭', 'Close'), onClose: () => setDialog(null) },
        dialog === 'automatic' ? h('div', { className: 'w-stack' }, h('p', null, (language() === 'en' ? row.labelEn : row.label) + ' · ' + target), h('p', null, t('你正在主动启用这个插件的自动安装。只处理兼容的稳定补丁；有任务、未保存修改、未知窗口或等待重启时暂停。', 'You are explicitly enabling automatic installation for this plugin. Only compatible stable patches qualify; running tasks, unsaved changes, unknown windows or a pending restart pause it.')), h('p', null, t('不会自动重启 DSH，其他插件不会跟着开启。可随时关闭。', 'DSH will not restart automatically, and other plugins will not be enabled for automatic updates. Turn it off anytime.')), h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('保持关闭', 'Keep off')), h(W.Button, { variant: 'primary', onClick: () => { setDialog(null); void perform(() => save({ checkEnabled: true, autoInstall: true }, 'enable-idle-patch-updates')); } }, t('允许此插件自动安装补丁', 'Allow patches for this plugin')))) :
        h('div', { className: 'w-stack' }, h('p', { className: 'updates-version' }, target + ' · ' + row.version + ' → ' + selectedVersion),
          h('p', null, selectedVersion === row.release?.version ? t('Harness 会重新加载此插件。需要重启时，更新区会显示宿主结果。', 'Harness reloads this plugin. If a restart is needed, it appears in the update result.') : message('check-first')),
          h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('取消', 'Cancel')),
            h(W.Button, { variant: 'primary', disabled: !canConfirm, onClick: () => runOperation({ action: 'install', name, version: selectedVersion, confirmation: 'update-installed-plugin' }) }, t('安装此版本', 'Install this version')))))
    );
  }
  function NativeFooter({ subject }) {
    const snapshot = useSnapshot(), name = __stardustUpdatesDetailName(subject, snapshot?.rows || []);
    return name ? h(Panel, { name }) : null;
  }
  function Reminder() {
    useSnapshot();
    const row = state?.rows.find(row => { const prefs = preferences(row.name); return row.available && !row.updating && !row.bundledBy && prefs.checkEnabled && prefs.deferredUntil <= Date.now() && prefs.ignoredVersion !== row.release.version && !notified.has(row.name + '@' + row.release.version); });
    if (!row && !legacyHint) return null;
    let Toast; try { Toast = require('@deepseek-ai/dsh-client-ui-primitives').Toast; } catch { return null; }
    if (!Toast) return null;
    const hint = legacyHint, key = hint ? 'legacy-' + hint : row.name + '@' + row.release.version;
    return h(Toast, { key, text: hint ? hint + t('：请打开「插件」中的此插件详情页，在底部管理更新。', ': open its details in Plugins to manage updates at the bottom.') : (language() === 'en' ? row.labelEn : row.label) + t('有新版本，可在页面底部查看。', ' has an update. Review it at the bottom of its page.'), icon: h(W.Icon, { name: 'refresh', size: 18 }), holdMs: 7000, onDone: () => { if (hint) legacyHint = null; else notified.add(key); notify(); } });
  }
  function register() {
    if (!alive) return;
    if (!registered) {
      registered = true; pool.clients.add(client);
      ctx.slots.inject('plugins.detail.section', () => ctx.slots.register({ name: 'plugins.detail.section', id: 'stardustlc.plugin-update-footer', order: 1000 }, NativeFooter));
      ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'stardustlc.plugin-update-reminder' }, Reminder));
      notify();
    }
  }
  async function poll() {
    if (inPoll || !alive || !shared.refs.size) return;
    inPoll = true;
    try { await refresh(); register(); await heartbeat(); }
    catch { /* Owner-only controls stay absent for guests and unsupported hosts. */ }
    finally { inPoll = false; }
  }
  const timer = setInterval(() => { void poll(); }, 15000), first = setTimeout(() => { void poll(); }, 100);
  const client = { t, Footer: Panel, Button: W.Button, open(name) { const footer = [...document.querySelectorAll('[data-plugin-update-footer]')].find(node => node.getAttribute('data-plugin-update-footer') === name); if (footer) footer.scrollIntoView({ block: 'end', behavior: 'smooth' }); else { legacyHint = name; notify(); } }, has: name => registered && !!rowFor(name), row: rowFor, dispose() {
    close(); alive = false; clearTimeout(first); clearInterval(timer); pool.clients.delete(client);
    pool.listeners.delete(guardChanged); listeners.clear();
    for (const event of ['pointerdown', 'keydown', 'input']) document.removeEventListener(event, interaction, true);
    window.removeEventListener('pagehide', close);
    for (const controller of requests) controller.abort();
    for (const listener of pool.viewListeners) listener();
  } };
  return client;
}

/* STARDUSTLC_UPDATE_CLIENT_BODY_START */
// Generated from templates/ by scripts/build-client.mjs. Edit the sources.
(function () {
/* clsx
MIT License

Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const clsx = (() => {
  const module = { exports: {} };
  function r(e){var o,t,f="";if("string"==typeof e||"number"==typeof e)f+=e;else if("object"==typeof e)if(Array.isArray(e)){var n=e.length;for(o=0;o<n;o++)e[o]&&(t=r(e[o]))&&(f&&(f+=" "),f+=t)}else for(t in e)e[t]&&(f&&(f+=" "),f+=t);return f}function e(){for(var e,o,t=0,f="",n=arguments.length;t<n;t++)(e=arguments[t])&&(o=r(e))&&(f&&(f+=" "),f+=o);return f}module.exports=e,module.exports.clsx=e;
  return module.exports.clsx;
})();
const styles = Object.freeze({"dshc-root":"dshc-root","dialog":"dsh-calendar_dialog","dshc-float":"dshc-float","dshc-fab":"dshc-fab","dshc-shell":"dshc-shell","topbar":"dsh-calendar_topbar","dshc-toolbar":"dshc-toolbar","calendarToolbar":"dsh-calendar_calendarToolbar","brand":"dsh-calendar_brand","topActions":"dsh-calendar_topActions","period":"dsh-calendar_period","emptyActions":"dsh-calendar_emptyActions","dshc-btn":"dshc-btn","commandTrigger":"dsh-calendar_commandTrigger","dshc-title":"dshc-title","brandMark":"dsh-calendar_brandMark","emptyIcon":"dsh-calendar_emptyIcon","zone":"dsh-calendar_zone","layoutChoices":"dsh-calendar_layoutChoices","paletteChoices":"dsh-calendar_paletteChoices","paletteSwatch":"dsh-calendar_paletteSwatch","triggerKey":"dsh-calendar_triggerKey","layoutDropdown":"dsh-calendar_layoutDropdown","segments":"dsh-calendar_segments","segment":"dsh-calendar_segment","outline":"dsh-calendar_outline","ghost":"dsh-calendar_ghost","primary":"dsh-calendar_primary","danger":"dsh-calendar_danger","iconButton":"dsh-calendar_iconButton","fallbackIcon":"dsh-calendar_fallbackIcon","dshc-spacer":"dshc-spacer","dshc-monthhead":"dshc-monthhead","dshc-sub":"dshc-sub","dshc-mono":"dshc-mono","dshc-time":"dshc-time","dshc-hour":"dshc-hour","miniDay":"dsh-calendar_miniDay","slotRange":"dsh-calendar_slotRange","schedule":"dsh-calendar_schedule","railHandle":"dsh-calendar_railHandle","rail":"dsh-calendar_rail","railScroll":"dsh-calendar_railScroll","railSection":"dsh-calendar_railSection","miniHeading":"dsh-calendar_miniHeading","miniCalendar":"dsh-calendar_miniCalendar","miniGrid":"dsh-calendar_miniGrid","miniWeekday":"dsh-calendar_miniWeekday","out":"dsh-calendar_out","calendarSource":"dsh-calendar_calendarSource","dshc-check":"dshc-check","conflictCard":"dsh-calendar_conflictCard","warn":"dsh-calendar_warn","conflictRange":"dsh-calendar_conflictRange","conflictLink":"dsh-calendar_conflictLink","railUpdates":"dsh-calendar_railUpdates","workspacePanel":"dsh-calendar_workspacePanel","scheduleMain":"dsh-calendar_scheduleMain","calendarSurface":"dsh-calendar_calendarSurface","weekView":"dsh-calendar_weekView","dshc-grid":"dshc-grid","dshc-cell":"dshc-cell","dshc-dow":"dshc-dow","dshc-dayhead":"dshc-dayhead","dshc-daynum":"dshc-daynum","dshc-chip":"dshc-chip","dshc-slot":"dshc-slot","allday":"dsh-calendar_allday","recurring":"dsh-calendar_recurring","dshc-slot-time":"dshc-slot-time","dshc-more":"dshc-more","conflicted":"dsh-calendar_conflicted","dshc-week":"dshc-week","dshc-daycol":"dshc-daycol","hourSlot":"dsh-calendar_hourSlot","movable":"dsh-calendar_movable","dragging":"dsh-calendar_dragging","dshc-slot-title":"dshc-slot-title","dshc-resize":"dshc-resize","dshc-ghost":"dshc-ghost","allDayList":"dsh-calendar_allDayList","dshc-draghint":"dshc-draghint","dshc-footer":"dshc-footer","dshc-emptyhint":"dshc-emptyhint","shortcutHints":"dsh-calendar_shortcutHints","dshc-agenda":"dshc-agenda","dshc-daygroup":"dshc-daygroup","dshc-daylabel":"dshc-daylabel","dshc-row":"dshc-row","dshc-main":"dshc-main","dshc-name":"dshc-name","dshc-meta":"dshc-meta","dshc-tag":"dshc-tag","success":"dsh-calendar_success","error":"dsh-calendar_error","w-empty":"w-empty","dshc-skel":"dshc-skel","dshc-alert":"dshc-alert","dshc-undo":"dshc-undo","demo":"dsh-calendar_demo","workspacePage":"dsh-calendar_workspacePage","pageInner":"dsh-calendar_pageInner","pageHeading":"dsh-calendar_pageHeading","pageIntro":"dsh-calendar_pageIntro","card":"dsh-calendar_card","pageHeader":"dsh-calendar_pageHeader","cardToolbar":"dsh-calendar_cardToolbar","dshc-field":"dshc-field","dshc-two":"dshc-two","formGrid":"dsh-calendar_formGrid","fullField":"dsh-calendar_fullField","dshc-input":"dshc-input","fieldControl":"dsh-calendar_fieldControl","pickerTrigger":"dsh-calendar_pickerTrigger","temporalField":"dsh-calendar_temporalField","temporalIcon":"dsh-calendar_temporalIcon","picker":"dsh-calendar_picker","toolbarPicker":"dsh-calendar_toolbarPicker","layoutTrigger":"dsh-calendar_layoutTrigger","menu":"dsh-calendar_menu","dshc-actions":"dshc-actions","dshc-steps":"dshc-steps","dshc-link":"dshc-link","helpLinks":"dsh-calendar_helpLinks","draftHint":"dsh-calendar_draftHint","reviewMeta":"dsh-calendar_reviewMeta","dshc-kv":"dshc-kv","dshc-overlay":"dshc-overlay","dshc-modalwrap":"dshc-modalwrap","dshc-drawer":"dshc-drawer","dshc-modal":"dshc-modal","dialogFrame":"dsh-calendar_dialogFrame","dialogHeader":"dsh-calendar_dialogHeader","dialogBody":"dsh-calendar_dialogBody","dialogFooter":"dsh-calendar_dialogFooter","commandBody":"dsh-calendar_commandBody","commandList":"dsh-calendar_commandList","conflictList":"dsh-calendar_conflictList","commandRow":"dsh-calendar_commandRow","commandKey":"dsh-calendar_commandKey","availabilityDays":"dsh-calendar_availabilityDays","availabilityFieldset":"dsh-calendar_availabilityFieldset","slotGrid":"dsh-calendar_slotGrid","slotCard":"dsh-calendar_slotCard","dshc-import-actions":"dshc-import-actions","dshc-import-rows":"dshc-import-rows","dshc-import-row":"dshc-import-row","dshc-import-pick":"dshc-import-pick","dshc-import-warning":"dshc-import-warning","importText":"dsh-calendar_importText","layoutFloating":"dsh-calendar_layoutFloating","layoutSpotlight":"dsh-calendar_layoutSpotlight","layoutCards":"dsh-calendar_layoutCards","calendarPageIn":"dsh-calendar_calendarPageIn","toolbarConflicts":"dsh-calendar_toolbarConflicts"});
const CSS = `.dshc-root{display:flex;flex-direction:column;min-width:0;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font:13px/1.5 var(--ds-font-family-text, system-ui, sans-serif)}
.dshc-root[data-main="true"]{height:100%;padding-block-start:var(--dsh-frame-top-clearance, 0px);padding-inline-start:var(--dsh-frame-leading-clearance, 0px)}
.dshc-root *, .dsh-calendar_dialog *, .dshc-float, .dshc-fab{box-sizing:border-box}
.dshc-root:focus-visible, .dshc-root :focus-visible, .dsh-calendar_dialog :focus-visible, .dshc-fab:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}
.dshc-shell{container-type:inline-size;display:flex;flex-direction:column;flex:1;min-width:0;min-height:0}
.dsh-calendar_topbar, .dshc-toolbar, .dsh-calendar_calendarToolbar{display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;min-width:0;padding:8px 14px;border-block-end:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base)}
.dsh-calendar_topbar{flex:none;min-height:48px}
.dsh-calendar_brand, .dsh-calendar_topActions, .dsh-calendar_period, .dsh-calendar_emptyActions{display:flex;align-items:center;flex-wrap:wrap;gap:6px}
.dsh-calendar_brand{flex:none;gap:8px}
.dsh-calendar_topActions{margin-inline-start:auto}
.dsh-calendar_topbar > [role="tablist"] > [role="tab"]{padding-inline:7px}
.dsh-calendar_topbar .dshc-btn.dsh-calendar_commandTrigger{padding-inline:7px}
.dsh-calendar_brand h1, .dshc-title{margin:0;font-size:14px;font-weight:600}
.dsh-calendar_brandMark, .dsh-calendar_emptyIcon{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base))}
.dsh-calendar_zone{padding:3px 7px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:11px/1.5 var(--ds-font-family-code, ui-monospace, monospace)}
.dsh-calendar_layoutChoices, .dsh-calendar_paletteChoices{align-items:center;padding:2px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1)}
.dsh-calendar_layoutChoices{display:none;gap:2px}
.dsh-calendar_layoutChoices .dshc-btn{min-height:24px;padding-inline:6px;white-space:nowrap}
.dsh-calendar_paletteChoices{display:flex}
.dsh-calendar_paletteChoices .dshc-btn.dsh-calendar_paletteSwatch{width:20px;min-height:24px;padding:0}
.dsh-calendar_paletteSwatch::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--dsw-alias-accent)}
.dsh-calendar_paletteSwatch[aria-pressed="true"]::before{outline:1px solid var(--dsw-alias-label-primary);outline-offset:2px}
.dsh-calendar_triggerKey{font:11px/1.4 var(--ds-font-family-code, ui-monospace, monospace);white-space:nowrap}
@container (min-width: 1100px){.dsh-calendar_layoutChoices{display:flex}.dsh-calendar_layoutDropdown{display:none}}
.dsh-calendar_segments{min-width:0;max-width:100%;display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-2)}
.dsh-calendar_segment{min-height:26px;padding:3px 10px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;white-space:nowrap}
.dsh-calendar_segment[aria-selected="true"]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}
.dshc-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:28px;padding:3px 10px;border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-primary);font:500 12px/1.4 var(--ds-font-family-text, system-ui, sans-serif);cursor:pointer}
.dshc-btn.dsh-calendar_outline{border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base)}
.dshc-btn.dsh-calendar_ghost{border:0;background:transparent}
.dshc-btn.dsh-calendar_primary{border:0;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base))}
.dshc-btn.dsh-calendar_danger{color:var(--dsw-alias-state-error-primary)}
.dshc-btn.dsh-calendar_outline:hover:not(:disabled), .dshc-btn.dsh-calendar_ghost:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dshc-btn.dsh-calendar_primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}
.dshc-btn:disabled, .dsh-calendar_segment:disabled{opacity:0.5;cursor:not-allowed}
.dshc-btn.dsh-calendar_iconButton{width:28px;flex:none;padding-inline:0}
.dsh-calendar_fallbackIcon::before{content:attr(data-glyph)}
.dshc-spacer{flex:1}
.dshc-monthhead{font-size:14px;font-weight:600}
.dshc-sub{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}
.dshc-mono, .dshc-time, .dshc-hour, .dsh-calendar_miniDay, .dsh-calendar_slotRange{font-family:var(--ds-font-family-code, ui-monospace, monospace);font-variant-numeric:tabular-nums}
.dsh-calendar_schedule{display:grid;grid-template-columns:236px minmax(0, 1fr);flex:1;min-height:0}
.dsh-calendar_schedule[data-resizable]{grid-template-columns:clamp(180px, var(--calendar-rail-width), min(360px, calc(100% - 330px))) var(--calendar-rail-gap, 8px) minmax(0, 1fr)}
.dsh-calendar_railHandle{position:relative;min-width:0;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);cursor:col-resize;touch-action:none;user-select:none}
.dsh-calendar_railHandle::before{content:"";position:absolute;width:2px;height:20px;inset:calc(50% - 10px) auto auto calc(50% - 1px);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-border-l3)}
.dsh-calendar_railHandle:is(:hover, :focus-visible, :active){background:var(--dsw-alias-interactive-bg-hover)}
.dsh-calendar_rail{display:flex;flex-direction:column;min-width:0;min-height:0;border-inline-end:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dsh-calendar_railScroll{flex:1;min-width:0;overflow:auto;padding:13px 12px}
.dsh-calendar_railSection{min-width:0;margin-block-start:16px}
.dsh-calendar_railSection h2, .dsh-calendar_miniHeading h2{margin:0;font:600 12px/1.5 var(--ds-font-family-text, system-ui, sans-serif)}
.dsh-calendar_railSection h2{margin-block-end:4px;color:var(--dsw-alias-label-secondary)}
.dsh-calendar_miniCalendar{padding:7px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-base)}
.dsh-calendar_miniHeading{display:flex;align-items:center;justify-content:space-between;margin-block-end:4px}
.dsh-calendar_miniHeading .dshc-btn.dsh-calendar_iconButton{width:22px}
.dsh-calendar_miniHeading .dsh-calendar_period{flex:none;gap:1px}
.dsh-calendar_miniGrid{display:grid;grid-template-columns:repeat(7, minmax(0, 1fr));gap:1px;text-align:center}
.dsh-calendar_miniWeekday{padding:3px 0;color:var(--dsw-alias-label-secondary);font-size:10px}
.dsh-calendar_miniDay{min-width:0;height:26px;padding:0;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-primary);font-size:11px;cursor:pointer}
.dsh-calendar_miniDay[aria-current="date"]{color:var(--dsw-alias-state-business-primary);font-weight:600}
.dsh-calendar_miniDay:hover:not([aria-pressed="true"]){background:var(--dsw-alias-interactive-bg-hover)}
.dsh-calendar_miniDay[aria-pressed="true"]{background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base))}
.dsh-calendar_out, .dsh-calendar_miniDay.dsh-calendar_out{color:var(--dsw-alias-label-tertiary)}
.dsh-calendar_calendarSource{margin-block:6px}
.dsh-calendar_calendarSource .dshc-check{padding:5px 3px}
.dsh-calendar_calendarSource .dshc-check > span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-calendar_conflictCard{display:flex;align-items:flex-start;gap:6px;padding:8px 9px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-calendar_conflictCard > :first-child{flex:none}
.dsh-calendar_conflictCard.dsh-calendar_warn{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-label)}
.dsh-calendar_conflictRange{margin-block-start:2px;color:var(--dsw-alias-label-secondary)}
.dsh-calendar_conflictCard .dshc-btn.dsh-calendar_conflictLink{display:none;min-height:22px;padding:0;color:var(--dsw-alias-link);text-align:start}
.dsh-calendar_railUpdates{flex:none;max-height:45%;overflow:auto}
.dsh-calendar_railUpdates:empty{display:none}
.dsh-calendar_railUpdates .plugin-updates-footer{--w-bg:var(--dsw-alias-bg-layer-1);--w-soft:var(--dsw-alias-bg-layer-2);--w-text:var(--dsw-alias-label-primary);--w-muted:var(--dsw-alias-label-secondary);--w-border:var(--dsw-alias-border-l2);--w-accent:var(--dsw-alias-state-business-primary);--w-primary:var(--dsw-alias-button-primary-fill);--w-on-primary:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base));margin:0;padding:9px 12px;border-block-start:0.5px solid var(--dsw-alias-border-l2);font-size:11px}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-head{align-items:center;gap:4px 8px}
.dsh-calendar_railUpdates .plugin-updates-footer h2{font-size:11px;line-height:1.4}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-subtitle{margin:0;font-size:10px}
.dsh-calendar_railUpdates .plugin-updates-footer .w-button{padding:3px 7px;min-height:24px;border:0;font-size:11px}
.dsh-calendar_railUpdates .plugin-updates-footer .w-button.w-primary{color:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base))}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-head .w-button{padding-inline:0;background:transparent;color:var(--dsw-alias-link)}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-settings{grid-template-columns:minmax(0, 1fr)}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-options{margin-top:4px}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-options > summary{font-size:11px}
.dsh-calendar_railUpdates .plugin-updates-footer .updates-notes{border:0.5px solid var(--dsw-alias-border-l2)}
.dsh-calendar_railUpdates .plugin-updates-footer .w-overlay{justify-content:center;align-items:center;background:var(--dsw-alias-bg-mask-1)}
.dsh-calendar_railUpdates .plugin-updates-footer .w-dialog{border:0;box-shadow:var(--dsw-elevation-prominent)}
.dsh-calendar_workspacePanel, .dsh-calendar_scheduleMain, .dsh-calendar_calendarSurface, .dsh-calendar_weekView{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0}
.dshc-root[data-compact="true"] .dsh-calendar_schedule{display:flex}
.dsh-calendar_calendarToolbar{justify-content:space-between;min-height:44px}
.dsh-calendar_calendarSurface{overflow:auto}
.dsh-calendar_calendarSurface > [role="tabpanel"]{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0}
.dshc-grid{display:grid;grid-template-columns:repeat(7, minmax(0, 1fr))}
.dshc-grid > :is(.dshc-cell, .dshc-dow):nth-child(7n){border-inline-end:0}
.dshc-dow, .dshc-dayhead{padding:7px 3px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-block-end:0.5px solid var(--dsw-alias-border-l2);text-align:center;font-size:11px;font-weight:500}
.dshc-dow, .dshc-cell{border-inline-end:0.5px solid var(--dsw-alias-border-l2)}
.dshc-cell{min-height:94px;padding:5px 6px;overflow:hidden;border-block-end:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);cursor:pointer}
.dshc-cell:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 4%, var(--dsw-alias-bg-base))}
.dshc-cell.dsh-calendar_out{background:var(--dsw-alias-bg-layer-1)}
.dshc-daynum{margin-bottom:4px;font-size:12px}
.dshc-daynum b{display:inline-grid;min-width:22px;height:22px;place-items:center;font-weight:500}
.dshc-cell.today .dshc-daynum b{border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base))}
.dshc-chip, .dshc-slot{--event-color:var(--dsw-alias-state-business-primary);display:block;overflow:hidden;text-align:start;border:0;border-inline-start:2.5px solid var(--event-color);border-radius:var(--dsw-radius-sm);background:color-mix(in srgb, var(--event-color) 13%, var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font:inherit;font-size:11px}
.dshc-chip{width:100%;margin:0 0 3px;padding:2px 4px;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}
.dshc-chip:hover, .dshc-slot:hover{background:color-mix(in srgb, var(--event-color) 22%, var(--dsw-alias-bg-base))}
.dsh-calendar_allday{--event-color:var(--dsw-alias-state-success-primary)}
.dsh-calendar_recurring{--event-color:var(--dsw-alias-state-warn-primary)}
.dshc-chip .t, .dshc-slot-time, .dshc-more{font-size:10px;color:var(--dsw-alias-label-secondary)}
.dshc-chip .t{margin-inline-end:4px}
.dsh-calendar_conflicted{outline:1px dashed var(--dsw-alias-state-error-primary);outline-offset:-1px}
.dsh-calendar_weekView{min-height:300px}
.dshc-week{display:grid;grid-template-columns:52px repeat(7, minmax(76px, 1fr));flex:1;min-height:260px;max-height:560px;overflow:auto;overscroll-behavior:contain}
.dshc-root[data-main="true"] .dshc-week{max-height:none}
.dshc-dayhead{position:sticky;top:0;z-index:4;min-height:36px;border-inline-start:0.5px solid var(--dsw-alias-border-l2)}
.dshc-dayhead.today{color:var(--dsw-alias-state-business-primary)}
.dshc-dayhead b{font-size:13px;margin-inline-start:3px}
.dshc-hour{height:44px;padding:3px 6px 0 0;border-block-end:0.5px solid var(--dsw-alias-border-l2);text-align:end;color:var(--dsw-alias-label-secondary);font-size:10px}
.dshc-daycol{position:relative;border-inline-start:0.5px solid var(--dsw-alias-border-l2);min-width:0}
.dshc-daycol.today{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 5%, var(--dsw-alias-bg-base))}
.dsh-calendar_hourSlot{display:block;width:100%;height:44px;padding:0;border:0;border-block-end:0.5px solid var(--dsw-alias-border-l2);background:transparent;cursor:pointer}
.dsh-calendar_hourSlot:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshc-slot{position:absolute;padding:3px 5px;line-height:1.3;cursor:pointer}
.dsh-calendar_movable{cursor:grab;touch-action:none;user-select:none}
.dsh-calendar_movable:active{cursor:grabbing}
.dsh-calendar_dragging{opacity:0.4}
.dshc-slot-title, .dshc-slot-time{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshc-slot-title{font-weight:600}
.dshc-resize{position:absolute;inset-inline:0;bottom:0;height:6px;cursor:ns-resize}
.dshc-resize:hover{background:var(--dsw-alias-interactive-bg-active)}
.dshc-slot.dshc-ghost{z-index:3;pointer-events:none;border:0.5px dashed var(--event-color)}
.dshc-ghost.dsh-calendar_warn{--event-color:var(--dsw-alias-state-warn-primary)}
.dsh-calendar_allDayList{display:grid;gap:4px;padding:6px 12px;max-height:120px;overflow:auto}
.dshc-draghint, .dshc-footer, .dshc-emptyhint{padding:6px 12px;margin:0;border-block-start:0.5px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:11px}
.dshc-emptyhint{border-block-start:0;border-block-end:0.5px solid var(--dsw-alias-border-l2)}
.dshc-footer{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px 10px}
.dsh-calendar_shortcutHints, .dsh-calendar_shortcutHints > span{display:flex;align-items:center;gap:4px}
.dsh-calendar_shortcutHints{flex-wrap:wrap;gap:4px 10px;margin-inline-start:auto}
.dshc-agenda{display:grid;gap:16px;padding:10px 14px 20px}
.dshc-daygroup{display:grid;gap:4px}
.dshc-daylabel{display:flex;align-items:center;gap:7px}
.dshc-row{display:flex;align-items:flex-start;gap:10px;padding:6px 9px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;text-align:start;cursor:pointer}
.dshc-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshc-time{min-width:84px;color:var(--dsw-alias-label-secondary);font-size:11px}
.dshc-main{flex:1;min-width:0}
.dshc-name, .dshc-meta{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshc-name{font-weight:600}
.dshc-meta{color:var(--dsw-alias-label-secondary);font-size:11px}
.dshc-tag{display:inline-block;padding:1px 6px;border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:500}
.dshc-tag.dsh-calendar_success{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}
.dshc-tag.dsh-calendar_warn{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-label)}
.dshc-tag.dsh-calendar_error{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, var(--dsw-alias-bg-base));color:var(--dsw-alias-state-error-primary)}
.w-empty{display:grid;align-content:center;justify-items:start;gap:8px;min-height:215px;max-width:425px;margin:auto;padding:20px}
.w-empty h2{margin:0;font-size:16px}
.w-empty p{margin:0;color:var(--dsw-alias-label-secondary)}
.dsh-calendar_emptyIcon{width:36px;height:36px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dshc-skel{height:94px;border:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dshc-alert, .dshc-undo{display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;margin:8px 12px;padding:7px 9px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1);font-size:12px;overflow-wrap:anywhere}
.dshc-alert.dsh-calendar_error{color:var(--dsw-alias-state-error-primary)}
.dshc-alert.dsh-calendar_warn{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-label)}
.dshc-alert.dsh-calendar_success{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}
.dshc-alert.dsh-calendar_demo{color:var(--dsw-alias-state-business-primary)}
.dsh-calendar_workspacePage{flex:1;min-width:0;min-height:0;overflow:auto;padding:20px 18px 32px}
.dsh-calendar_pageInner{max-width:820px;margin-inline:auto;min-width:0}
.dsh-calendar_pageHeading{margin:0 0 4px;font-size:17px;font-weight:600}
.dsh-calendar_pageIntro{margin:0 0 14px;color:var(--dsw-alias-label-secondary)}
.dsh-calendar_card{margin-block:12px;padding:14px 16px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1);min-width:0}
.dsh-calendar_pageHeader, .dsh-calendar_cardToolbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px 10px}
.dsh-calendar_cardToolbar{padding-block-end:10px}
.dsh-calendar_cardToolbar h3{margin:0;font-size:14px}
.dshc-field{display:grid;align-content:start;gap:4px;min-width:0;margin:0 0 10px}
.dshc-field > label, .dshc-field > span:first-child{color:var(--dsw-alias-label-secondary);font-weight:500;font-size:12px}
.dshc-two, .dsh-calendar_formGrid{display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:0 12px}
.dsh-calendar_fullField{grid-column:1 / -1}
.dshc-input, .dsh-calendar_fieldControl, .dshc-btn.dsh-calendar_pickerTrigger{box-sizing:border-box;width:100%;min-width:0;min-height:32px;padding:5px 8px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-calendar_fieldControl:focus-within{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}
.dsh-calendar_fieldControl > input{width:100%;min-width:0;font:inherit}
.dsh-calendar_fieldControl > input:focus-visible{outline:none}
.dsh-calendar_temporalField{position:relative;display:block;min-width:0}
.dsh-calendar_temporalIcon{display:none}
@supports selector(::-webkit-calendar-picker-indicator){.dsh-calendar_temporalField input::-webkit-calendar-picker-indicator{width:14px;height:14px;padding:0;margin-inline:0;opacity:0;cursor:pointer}.dsh-calendar_temporalIcon{position:absolute;inset-inline-end:9px;top:50%;display:flex;transform:translateY(-50%);pointer-events:none;color:var(--dsw-alias-label-secondary)}}
textarea.dshc-input{min-height:64px;resize:vertical}
.dsh-calendar_picker{width:100%;min-width:0}
.dsh-calendar_toolbarPicker{width:auto;min-width:0}
.dsh-calendar_layoutTrigger{white-space:nowrap}
.dshc-btn.dsh-calendar_pickerTrigger{justify-content:space-between;text-align:start}
.dsh-calendar_pickerTrigger > span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-calendar_pickerTrigger > :last-child{flex:none}
.dsh-calendar_menu.dsh-calendar_menu{border:0;box-shadow:var(--dsw-elevation-prominent)}
.dshc-check{display:inline-flex;align-items:center;gap:6px;font-size:12px;min-width:0}
.dshc-check input{flex:none;accent-color:var(--dsw-alias-state-business-primary)}
.dshc-actions{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:7px}
.dshc-steps{margin:0 0 12px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dshc-steps summary{cursor:pointer;color:var(--dsw-alias-link)}
.dshc-steps ol{margin:6px 0;padding-inline-start:20px}
.dshc-link{color:var(--dsw-alias-link)}
.dsh-calendar_helpLinks{display:flex;flex-wrap:wrap;gap:6px 10px}
.dshc-mono{color:var(--dsw-alias-label-secondary);font-size:11px;overflow-wrap:anywhere}
.dsh-calendar_draftHint{margin:0 0 10px;color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-calendar_dialog .dshc-alert{margin-inline:0}
.dsh-calendar_dialog .dshc-alert:first-child{margin-block-start:0}
.dsh-calendar_reviewMeta{display:flex;align-items:center;flex-wrap:wrap;gap:6px}
.dshc-kv{display:grid;grid-template-columns:max-content minmax(0, 1fr);gap:6px 10px;margin:12px 0 0}
.dshc-kv dt{color:var(--dsw-alias-label-secondary)}
.dshc-kv dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.dshc-overlay, .dshc-modalwrap{display:flex;align-items:center;justify-content:center;position:fixed;inset:0;z-index:1000;padding:16px}
.dshc-overlay{background:var(--dsw-alias-bg-mask-3, var(--dsw-alias-bg-mask-1))}
.dshc-modalwrap{background:var(--dsw-alias-bg-mask-3, var(--dsw-alias-bg-mask-1))}
.dshc-drawer{--calendar-dialog-width:460px}
.dshc-modal{--calendar-dialog-width:520px}
.dsh-calendar_dialog[role="dialog"]{display:flex;flex-direction:column;width:min(var(--calendar-dialog-width, 520px), 100%);max-height:100%;gap:0;padding:0;overflow:hidden;border:0;border-radius:var(--dsw-radius-panel);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-elevation-prominent);font:13px/1.5 var(--ds-font-family-text, system-ui, sans-serif)}
.dsh-calendar_dialogFrame{display:flex;flex:1;flex-direction:column;min-width:0;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}
.dsh-calendar_dialogHeader{display:flex;flex:none;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-block-end:0.5px solid var(--dsw-alias-border-l2)}
.dsh-calendar_dialogHeader h2{margin:0;font-size:15px}
.dsh-calendar_dialogBody{min-height:0;min-width:0;overflow:auto;padding:12px 14px;overscroll-behavior:contain}
.dsh-calendar_dialogFooter{flex:none;padding:8px 14px;border-block-start:0.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}
.dsh-calendar_commandBody, .dsh-calendar_commandList, .dsh-calendar_conflictList{display:grid;gap:4px}
.dsh-calendar_commandBody{gap:8px}
.dsh-calendar_commandList{max-height:300px;overflow:auto}
.dshc-btn.dsh-calendar_commandRow{justify-content:space-between;min-height:32px;text-align:start}
.dsh-calendar_commandKey{min-width:19px;padding:1px 4px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:11px/1.4 var(--ds-font-family-code, ui-monospace, monospace);text-align:center}
.dsh-calendar_availabilityDays{display:flex;flex-wrap:wrap;align-items:center;gap:5px 12px}
.dsh-calendar_availabilityFieldset{border:0;margin:0 0 12px;padding:0;min-width:0}
.dsh-calendar_availabilityFieldset legend{padding:0 0 5px;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-calendar_slotGrid{display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 218px), 1fr));gap:8px;margin:10px 0;padding:0;list-style:none}
.dsh-calendar_slotCard{display:grid;gap:8px;padding:10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-base)}
.dsh-calendar_slotRange{color:var(--dsw-alias-label-secondary);font-size:11px}
.dshc-import-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-block-start:10px}
.dshc-import-rows{display:grid;min-width:0;margin-block:10px;border-block-start:0.5px solid var(--dsw-alias-border-l2)}
.dshc-import-row{padding:9px 0;border-block-end:0.5px solid var(--dsw-alias-border-l2);overflow-wrap:anywhere}
.dshc-import-row p{margin:2px 0 0;font-size:12px}
.dshc-import-pick{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:5px 10px}
.dshc-import-warning{color:var(--dsw-alias-state-warn-label)}
.dsh-calendar_importText{font-family:var(--ds-font-family-code, ui-monospace, monospace)}
.dshc-fab{position:fixed;inset-inline-end:18px;bottom:88px;z-index:55;display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:50%;box-shadow:var(--dsw-elevation-prominent);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);cursor:pointer}
.dshc-fab[aria-expanded="true"]{background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-button-primary-ink, var(--dsw-alias-bg-base))}
.dshc-float{position:fixed;inset-inline-end:18px;bottom:136px;z-index:56;width:min(760px, calc(100vw - 36px));max-height:min(calc(100dvh - 155px), 720px);overflow:auto;border:0;border-radius:var(--dsw-radius-panel);box-shadow:var(--dsw-elevation-prominent);background:var(--dsw-alias-bg-base)}
.dsh-calendar_layoutFloating{--calendar-rail-gap:10px;background:var(--dsw-alias-bg-base);background-image:radial-gradient(at 8% 12%, color-mix(in srgb, var(--dsw-alias-accent) 22%, transparent) 0, transparent 48%),
    radial-gradient(at 92% 88%, var(--dsw-alias-calendar-island-tint) 0, transparent 50%)}
.dsh-calendar_layoutFloating .dsh-calendar_topbar,
.dsh-calendar_layoutFloating .dsh-calendar_rail,
.dsh-calendar_layoutFloating .dsh-calendar_scheduleMain{border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-panel);background:var(--dsw-alias-calendar-island-surface);backdrop-filter:blur(24px) saturate(1.6)}
.dsh-calendar_layoutFloating .dsh-calendar_topbar{margin:10px 10px 0;background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 82%, transparent)}
.dsh-calendar_layoutFloating .dsh-calendar_workspacePanel{padding:10px}
.dsh-calendar_layoutFloating .dsh-calendar_railHandle{background:transparent}
.dsh-calendar_layoutFloating .dsh-calendar_scheduleMain{overflow:hidden}
.dsh-calendar_layoutSpotlight .dsh-calendar_topbar{background:linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-accent) 14%, var(--dsw-alias-bg-base)), var(--dsw-alias-bg-base) 45%)}
.dsh-calendar_layoutSpotlight .dsh-calendar_calendarToolbar{background:var(--dsw-alias-bg-layer-1)}
.dsh-calendar_layoutSpotlight :is(.dsh-calendar_card, .dsh-calendar_slotCard, .dsh-calendar_miniCalendar){background:linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-layer-2) 65%, var(--dsw-alias-bg-base)), var(--dsw-alias-bg-layer-1))}
@media (hover: hover){.dsh-calendar_layoutSpotlight :is(.dshc-chip, .dsh-calendar_card, .dsh-calendar_slotCard, .dsh-calendar_miniCalendar){position:relative}.dsh-calendar_layoutSpotlight :is(.dshc-slot, .dshc-chip, .dsh-calendar_card, .dsh-calendar_slotCard, .dsh-calendar_miniCalendar)::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(
      260px circle at var(--calendar-spotlight-x, -999px) var(--calendar-spotlight-y, -999px),
      color-mix(in srgb, var(--dsw-alias-accent) 12%, transparent),
      transparent 70%
    );opacity:0}.dsh-calendar_layoutSpotlight :is(.dshc-slot, .dshc-chip, .dsh-calendar_card, .dsh-calendar_slotCard, .dsh-calendar_miniCalendar):hover::after{opacity:1}}
@media (hover: hover) and (prefers-reduced-motion: no-preference){.dsh-calendar_layoutSpotlight :is(.dshc-slot, .dshc-chip, .dsh-calendar_card, .dsh-calendar_slotCard, .dsh-calendar_miniCalendar)::after{transition:opacity 0.25s ease}}
.dsh-calendar_layoutCards :is(.dsh-calendar_calendarSurface, .dsh-calendar_workspacePage){background:var(--dsw-alias-bg-layer-2)}
.dsh-calendar_layoutCards .dsh-calendar_calendarSurface{padding:8px}
.dsh-calendar_layoutCards .dshc-grid{gap:4px}
.dsh-calendar_layoutCards .dshc-grid > .dshc-cell{border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md)}
.dsh-calendar_layoutCards :is(.dshc-slot, .dsh-calendar_card, .dsh-calendar_slotCard){border-radius:var(--dsw-radius-lg)}
@media (prefers-reduced-motion: no-preference){.dshc-root[data-main="true"] .dsh-calendar_workspacePage{animation:dsh-calendar_calendarPageIn 150ms ease-out both}@keyframes dsh-calendar_calendarPageIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}}
@container (max-width: 830px){.dsh-calendar_schedule:not([data-resizable]){grid-template-columns:194px minmax(0, 1fr)}.dsh-calendar_zone{display:none}}
@container (max-width: 620px){.dshc-title{display:none}.dshc-chip .t{display:none}.dshc-toolbar{gap:6px}.dsh-calendar_schedule{display:flex;flex-direction:column;overflow:auto}.dsh-calendar_rail{flex:none;border-inline-end:0;border-block-end:0.5px solid var(--dsw-alias-border-l2)}.dsh-calendar_railHandle{display:none}.dsh-calendar_railScroll{display:grid;grid-template-columns:minmax(168px, 220px) minmax(0, 1fr);overflow:visible;gap:12px}.dsh-calendar_railSection{margin-block-start:0}.dsh-calendar_railUpdates{max-height:195px}.dsh-calendar_scheduleMain, .dsh-calendar_calendarSurface, .dsh-calendar_calendarSurface > [role="tabpanel"], .dsh-calendar_weekView{flex:none}.dsh-calendar_calendarSurface{overflow:visible}.dshc-root[data-main="true"] .dshc-week{flex:none;max-height:440px}.dshc-cell{min-height:82px;padding-inline:3px}.dshc-chip{padding-inline:2px}.dsh-calendar_topbar{padding-inline:8px;gap:6px}.dsh-calendar_topbar > [role="tablist"]{order:3;width:100%;overflow-x:auto}.dsh-calendar_topbar > [role="tablist"] > [role="tab"]{flex:none;padding-inline:6px;font-size:12px;white-space:nowrap}.dsh-calendar_topActions{gap:4px}.dsh-calendar_topbar .dshc-btn.dsh-calendar_commandTrigger{width:28px;padding-inline:0}.dsh-calendar_triggerKey, .dsh-calendar_shortcutHints, .dshc-btn.dsh-calendar_toolbarConflicts{display:none}.dsh-calendar_conflictCard .dshc-btn.dsh-calendar_conflictLink{display:flex}.dsh-calendar_paletteChoices .dshc-btn.dsh-calendar_paletteSwatch{width:17px}.dsh-calendar_layoutFloating .dsh-calendar_workspacePanel{padding:6px}.dsh-calendar_layoutFloating .dsh-calendar_schedule{gap:6px}}
@container (max-width: 420px){.dsh-calendar_workspacePage{padding-inline:10px}.dsh-calendar_card{padding-inline:10px}.dsh-calendar_formGrid{grid-template-columns:minmax(0, 1fr)}.dsh-calendar_railScroll{grid-template-columns:minmax(150px, 1.1fr) minmax(0, 1fr);gap:8px;padding-inline:8px}}`;
// Editable browser entry. Build with node scripts/build-client.mjs.
window.__ModuleLoader__.load(__stardustUpdatesWrap({ id: "dsh-calendar", factory: (require) => {
        var module = { exports: {} };
        var exports = module.exports;
        "use strict";
        const React = require("react");
        let calendarHostContext;
        const { useState, useEffect, useMemo, useRef, useId } = React;
        const h = React.createElement;
        let PRIM;
try {
    PRIM = require("@deepseek-ai/dsh-client-ui-primitives");
} catch {
    // Compatibility path for partial hosts that don't seed the browser module.
    PRIM = {};
}

const hostIcons = {
    left: "IconChevronLeftOutlineMedium",
    right: "IconChevronRightOutlineMedium",
    down: "IconChevronDownOutlineMedium",
    close: "IconCloseOutlineMedium",
    refresh: "IconRefreshOutlineMedium",
    plus: "IconPlusOutlineMedium",
    search: "IconSearchOutlineMedium",
    clock: "IconClockOutlineMedium",
    check: "IconCheckOutlineMedium",
    warning: "IconWarningTriangleOutlineMedium"
};
const fallbackIcons = { left: "‹", right: "›", down: "⌄", close: "×", refresh: "↻", plus: "+", search: "⌕", clock: "◷", check: "✓", warning: "!" };

function CalendarIcon({ size = 16 }) {
    return h("svg", {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", "aria-hidden": true, focusable: false
    },
        h("rect", { x: 3, y: 5, width: 18, height: 16, rx: 3 }),
        h("path", { d: "M3 10h18M8 3v4M16 3v4" })
    );
}

function Icon({ name, size = 16 }) {
    const NativeIcon = PRIM?.[hostIcons[name]];
    return NativeIcon
        ? h(NativeIcon, { size, "aria-hidden": true })
        : h("span", { className: styles.fallbackIcon, "data-glyph": fallbackIcons[name], "aria-hidden": true });
}

function Btn({ variant = "outline", size = "sm", icon, className, children, ...props }) {
    const nativeVariant = variant === "danger" ? "ghost" : variant;
    const button = {
        type: "button",
        ...props,
        className: clsx(styles["dshc-btn"], styles[nativeVariant], variant === "danger" && styles.danger, className)
    };
    const glyph = icon ? h(Icon, { name: icon }) : null;
    return PRIM?.Button
        ? h(PRIM.Button, { ...button, variant: nativeVariant, size, icon: glyph }, children)
        : h("button", button, glyph, children);
}

function IconButton({ label, icon, className, ...props }) {
    return h(Btn, { ...props, className: clsx(styles.iconButton, className), icon, variant: "ghost", "aria-label": label, title: label });
}

function Txt({ className, icon, ...props }) {
    const input = PRIM?.Input
        ? h(PRIM.Input, { ...props, icon, className: clsx(styles.fieldControl, className) })
        : h("input", { type: "text", ...props, className: clsx(styles["dshc-input"], className) });
    if (props.type !== "date" && props.type !== "time") return input;
    return h("span", { className: styles.temporalField }, input,
        h("span", { className: styles.temporalIcon, "aria-hidden": true },
            props.type === "date" ? h(CalendarIcon, { size: 14 }) : h(Icon, { name: "clock", size: 14 })
        )
    );
}

function Chk({ checked, disabled, label, onChange, className, title }) {
    const classes = clsx(styles["dshc-check"], className);
    if (PRIM?.Checkbox) return h(PRIM.Checkbox, { checked, disabled, label, onChange, className: classes, title });
    return h("label", { className: classes, title },
        h("input", { type: "checkbox", checked, disabled, onChange: event => onChange(event.target.checked) }),
        h("span", null, label)
    );
}

function Picker({ id, label, value, options, onChange, disabled, compact = false }) {
    const [open, setOpen] = useState(false);
    if (!PRIM?.Menu) {
        return h("select", {
            id, "aria-label": label, className: clsx(styles["dshc-input"], compact && styles.toolbarPicker),
            value, disabled, onChange: event => onChange(event.target.value)
        },
            options.map(option => h("option", { key: option.id, value: option.id }, option.label)));
    }
    const selected = options.find(option => option.id === value);
    const expanded = open && !disabled;
    // Menu composes the host's MenuSurface and owns positioning/keyboard focus.
    return h(PRIM.Menu, {
        open: expanded, portal: true, compact: true, autoFocus: true, minWidthFromAnchor: true,
        className: compact ? styles.toolbarPicker : styles.picker, listClassName: styles.menu,
        anchor: h(Btn, {
            id, disabled, className: compact ? styles.layoutTrigger : styles.pickerTrigger,
            "aria-label": label + " · " + (selected?.label ?? ""), "aria-haspopup": "menu", "aria-expanded": expanded,
            onClick: () => setOpen(value => !value)
        }, h("span", null, selected?.label), h(Icon, { name: "down" })),
        items: options,
        selectedId: value,
        onClose: () => setOpen(false),
        onSelect: id => { setOpen(false); onChange(id); }
    });
}

function Segments({ id, label, items, value, onChange, disabled }) {
    if (PRIM?.SegmentedControl) {
        return h(PRIM.SegmentedControl, { id, label, value, options: items, onChange, disabled, className: styles.segments });
    }
    return h("div", { className: styles.segments, role: "tablist", "aria-label": label },
        items.map(item => h("button", {
            key: item.value, type: "button", role: "tab", id: id + "-" + item.value,
            className: styles.segment, "aria-selected": value === item.value,
            "aria-controls": id + "-" + item.value + "-panel",
            tabIndex: value === item.value ? 0 : -1, disabled: disabled || item.disabled,
            onClick: () => onChange(item.value),
            onKeyDown: event => {
                const enabled = items.filter(item => !item.disabled);
                const index = enabled.findIndex(option => option.value === item.value);
                const length = enabled.length;
                const offsets = { ArrowLeft: -1, ArrowRight: 1, Home: -index, End: length - index - 1 };
                if (!Object.hasOwn(offsets, event.key)) return;
                event.preventDefault();
                const next = enabled[(index + offsets[event.key] + length) % length].value;
                onChange(next);
                document.getElementById(id + "-" + next)?.focus();
            }
        }, item.label))
    );
}

function EmptyState({ title, children, action }) {
    return h("div", { className: styles["w-empty"] },
        h("span", { className: styles.emptyIcon }, h(CalendarIcon, { size: 22 })),
        h("h2", null, title), children,
        h("div", { className: styles.emptyActions }, action)
    );
}

function FallbackDialog({ title, onClose, children, review }) {
    const panel = useRef(null);
    useEffect(() => {
        const previous = document.activeElement;
        (panel.current?.querySelector("[data-modal-autofocus]") ?? panel.current)?.focus();
        return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
    }, []);
    function trapTab(event) {
        if (event.key !== "Tab") return;
        const controls = [...panel.current.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]")];
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    }
    return h("div", {
        className: review ? styles["dshc-overlay"] : styles["dshc-modalwrap"],
        onMouseDown: event => { if (event.target === event.currentTarget) onClose(); }
    }, h("section", {
        className: clsx(styles.dialog, review ? styles["dshc-drawer"] : styles["dshc-modal"]),
        ref: panel, role: "dialog", "aria-modal": true, "aria-label": title, tabIndex: -1, onKeyDown: trapTab
    }, children));
}

function Dlg({ open, onClose, title, closeLabel = title, children, footer, review = false }) {
    const appearance = React.useContext(getCalendarAppearanceContext());
    if (!open) return null;
    const frame = h("div", { key: "frame", className: styles.dialogFrame, style: appearance, "data-dshc-scope": "1" },
        h("header", { className: styles.dialogHeader },
            h("h2", null, title), h(IconButton, { icon: "close", label: closeLabel, onClick: onClose })
        ),
        h("div", { className: styles.dialogBody }, children),
        footer ? h("footer", { className: styles.dialogFooter }, footer) : null
    );
    return PRIM?.Modal
        ? h(PRIM.Modal, { open, onClose, title, headless: true, className: styles.dialog }, frame)
        : h(FallbackDialog, { title, onClose, review }, frame);
}

// Color values from dsh_calendar_deepseek_harness_native_ui_design.html.
// The calendar scopes these values to its own semantic tokens.
const CALENDAR_PALETTE_KEY = "dsh-calendar:palette";
const CALENDAR_PALETTES = [
    { id: "default", zh: "默认蓝", en: "Default blue", light: "#2563eb", dark: "#60a5fa" },
    { id: "aurora", zh: "极光紫", en: "Aurora", light: "#7c3aed", dark: "#a78bfa" },
    { id: "ember", zh: "余烬橙", en: "Ember", light: "#d97706", dark: "#fbbf24" },
    { id: "mint", zh: "薄荷绿", en: "Mint", light: "#059669", dark: "#34d399" }
];

const CALENDAR_APPEARANCE = {
    light: {
        "bg-base": "#ffffff", "bg-layer-1": "#fafbfc", "bg-layer-2": "#f4f5f7",
        "bg-layer-3": "#eceef2", "bg-layer-4": "#f1f3f5",
        "label-primary": "#0f1115", "label-secondary": "#4b5563", "label-tertiary": "#848c99",
        "border-l1": "rgba(15, 17, 21, 0.06)", "border-l2": "rgba(15, 17, 21, 0.11)", "border-l3": "rgba(15, 17, 21, 0.18)",
        "button-primary-fill": "#0f1115", "button-primary-hover": "#43454a", "button-primary-ink": "#ffffff",
        "interactive-bg-hover": "rgba(15, 17, 21, 0.045)", "interactive-bg-active": "rgba(15, 17, 21, 0.08)",
        "state-success-primary": "#0f766e", "state-success-tertiary": "rgba(15, 118, 110, 0.10)",
        "state-warn-primary": "#b45309", "state-warn-label": "#b45309", "state-warn-tertiary": "rgba(180, 83, 9, 0.10)",
        "state-error-primary": "#dc2626"
    },
    dark: {
        "bg-base": "#151517", "bg-layer-1": "#232324", "bg-layer-2": "#2c2c2e",
        "bg-layer-3": "#353638", "bg-layer-4": "#43454a",
        "label-primary": "#f9fafb", "label-secondary": "#a1a8b3", "label-tertiary": "#6e7684",
        "border-l1": "rgba(255, 255, 255, 0.06)", "border-l2": "rgba(255, 255, 255, 0.11)", "border-l3": "rgba(255, 255, 255, 0.18)",
        "button-primary-fill": "#f9fafb", "button-primary-hover": "#ebeef2", "button-primary-ink": "#0f1115",
        "interactive-bg-hover": "rgba(255, 255, 255, 0.055)", "interactive-bg-active": "rgba(255, 255, 255, 0.10)",
        "state-success-primary": "#2dd4bf", "state-success-tertiary": "rgba(45, 212, 191, 0.12)",
        "state-warn-primary": "#fbbf24", "state-warn-label": "#fbbf24", "state-warn-tertiary": "rgba(251, 191, 36, 0.12)",
        "state-error-primary": "#f87171"
    }
};

const CALENDAR_SURFACES = {
    floating: {
        light: {
            "bg-base": "#e8ecf4",
            "calendar-island-tint": "rgba(139, 92, 246, 0.18)",
            "calendar-island-surface": "color-mix(in srgb, var(--dsw-alias-bg-layer-1) 80%, transparent)"
        },
        dark: {
            "bg-base": "#0b0d13",
            "calendar-island-tint": "rgba(124, 58, 237, 0.22)",
            "calendar-island-surface": "rgba(24, 26, 34, 0.76)"
        }
    },
    spotlight: { dark: { "bg-base": "#090a0f", "bg-layer-1": "#10121a", "bg-layer-2": "#171a24", "bg-layer-4": "#1f2330" } },
    cards: {
        light: { "bg-base": "#f3f2ee", "bg-layer-1": "#fbfaf7", "bg-layer-2": "#eae7e0", "bg-layer-4": "#e2ded5" },
        dark: { "bg-base": "#121211", "bg-layer-1": "#1c1b19", "bg-layer-2": "#262522", "bg-layer-4": "#302e2a" }
    }
};

let calendarAppearanceContext;
function getCalendarAppearanceContext() {
    return calendarAppearanceContext ||= React.createContext(undefined);
}

function loadCalendarPalette() {
    const preset = readCalendarPreference(CALENDAR_PALETTE_KEY);
    return CALENDAR_PALETTES.some(option => option.id === preset) ? preset : "default";
}

const CALENDAR_SPOTLIGHT_CARDS = ["dshc-slot", "dshc-chip", "card", "slotCard", "miniCalendar"]
    .map(name => "." + styles[name]).join(", ");

function moveCalendarSpotlight(event) {
    if (event.pointerType === "touch") return;
    const card = event.target.closest?.(CALENDAR_SPOTLIGHT_CARDS);
    if (!card || !event.currentTarget.contains(card)) return;
    const { left, top } = card.getBoundingClientRect();
    card.style.setProperty("--calendar-spotlight-x", (event.clientX - left) + "px");
    card.style.setProperty("--calendar-spotlight-y", (event.clientY - top) + "px");
}

function useCalendarDarkMode(enabled) {
    const read = () => enabled && document.body.hasAttribute("data-ds-dark-theme");
    const [dark, setDark] = useState(read);
    useEffect(() => {
        if (!enabled) return;
        const observer = new window.MutationObserver(() => setDark(read()));
        observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
        setDark(read());
        return () => observer.disconnect();
    }, [enabled]);
    return dark;
}

function calendarAppearance(layout, palette, scheme) {
    const accent = CALENDAR_PALETTES.find(option => option.id === palette)[scheme];
    return Object.fromEntries(Object.entries({
        ...CALENDAR_APPEARANCE[scheme], ...CALENDAR_SURFACES[layout]?.[scheme],
        accent, link: accent, "state-business-primary": accent
    }).map(([name, value]) => ["--dsw-alias-" + name, value]));
}

function CalendarPalettePicker({ palette, dark, onChange }) {
    return h("div", { className: styles.paletteChoices, role: "group", "aria-label": calendarText("日历配色", "Calendar palette") },
        CALENDAR_PALETTES.map(option => {
            const label = calendarText(option.zh, option.en);
            return h(Btn, {
                key: option.id, variant: "ghost", className: styles.paletteSwatch, title: label,
                "aria-label": label, "aria-pressed": option.id === palette,
                style: { "--dsw-alias-accent": option[dark ? "dark" : "light"] },
                onClick: () => onChange(option.id)
            });
        })
    );
}

function AvailabilityPanel({ anchor, onChoose, onClose, onBusy }) {
    const text = calendarText;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const [form, setForm] = useState(() => {
        const now = new Date();
        const start = anchor > now ? anchor : now;
        return {
            from: dayKey(start), to: dayKey(addDays(start, 6)),
            durationMinutes: "60", workStart: "09:00", workEnd: "18:00",
            bufferMinutes: "0", weekdays: [1, 2, 3, 4, 5]
        };
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const active = useRef({ id: 0, controller: null });

    useEffect(() => {
        onBusy(busy);
        return () => onBusy(false);
    }, [busy, onBusy]);
    useEffect(() => () => {
        active.current.id++;
        active.current.controller?.abort();
    }, []);

    function cancel() {
        active.current.id++;
        active.current.controller?.abort();
        active.current.controller = null;
        setBusy(false);
    }
    function close() {
        cancel();
        onClose();
    }
    function update(fields) {
        cancel();
        setForm(value => ({ ...value, ...fields }));
        setResult(null);
        setError("");
    }
    async function search(event) {
        event.preventDefault();
        cancel();
        const controller = new AbortController();
        const id = ++active.current.id;
        active.current.controller = controller;
        setBusy(true);
        setError("");
        setResult(null);
        try {
            const start = new Date(form.from + "T00:00:00");
            const end = new Date(form.to + "T00:00:00");
            end.setDate(end.getDate() + 1);
            if (dayKey(new Date()) === form.from) start.setTime(Math.max(start.getTime(), Date.now()));
            const value = await api("availability", {
                start: start.toISOString(), end: end.toISOString(), timeZone: zone,
                durationMinutes: Number(form.durationMinutes), workStart: form.workStart,
                workEnd: form.workEnd, weekdays: form.weekdays, bufferMinutes: Number(form.bufferMinutes), limit: 20
            }, controller.signal);
            if (active.current.id === id) setResult(value);
        } catch (e) {
            if (active.current.id === id && !controller.signal.aborted) {
                const message = e?.message || String(e);
                setError(UI_LANG === "en" && /范围|31 天/.test(message) ? "Choose an increasing date range of up to 31 days." : backendMessage(e));
            }
        } finally {
            if (active.current.id === id) {
                active.current.controller = null;
                setBusy(false);
            }
        }
    }

    const title = text("找空闲时段", "Find available time");
    const field = (name, label, type, limits) => h("label", { key: name, className: styles["dshc-field"] },
        h("span", null, label),
        h(Txt, { type, value: form[name], disabled: busy, required: true, ...limits, onChange: event => update({ [name]: event.target.value }) })
    );
    const formatter = useMemo(() => new Intl.DateTimeFormat(UI_LANG === "en" ? "en-US" : "zh-CN", {
        timeZone: zone, year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "shortOffset"
    }), [UI_LANG, zone]);
    const format = iso => formatter.format(new Date(iso));

    return h("section", {
        className: styles.workspacePage, "aria-label": title, "aria-busy": busy,
        onKeyDown: event => {
            if (event.key !== "Escape" || event.isComposing) return;
            event.preventDefault();
            event.stopPropagation();
            close();
        }
    }, h("div", { className: styles.pageInner },
        h("div", { className: styles.pageHeader },
            h("h2", { className: styles.pageHeading }, title),
            h(IconButton, { icon: "close", label: text("关闭", "Close"), onClick: close })
        ),
        h("p", { className: styles.pageIntro }, text(
            "按当前连接的日历查找，不代表其他日历或参会者空闲。选择候选只填写新建草稿。",
            "Checks the connected calendar, not other calendars or attendees. Choosing a time only fills a new-event draft."
        )),
        h("form", { className: styles.card, onSubmit: search },
            h("div", { className: styles.formGrid },
                field("from", text("开始日期", "Start date"), "date"),
                field("to", text("结束日期（包含当天）", "End date (inclusive)"), "date"),
                field("durationMinutes", text("日程时长（分钟）", "Duration (minutes)"), "number", { min: 5, max: 480, step: 1 }),
                field("bufferMinutes", text("定时日程前后缓冲（分钟）", "Buffer around timed events (minutes)"), "number", { min: 0, max: 120, step: 1 }),
                field("workStart", text("工作开始", "Work starts"), "time"),
                field("workEnd", text("工作结束", "Work ends"), "time")
            ),
            h("fieldset", { className: styles.availabilityFieldset, disabled: busy },
                h("legend", null, text("工作日", "Working days")),
                h("div", { className: styles.availabilityDays }, WEEKDAYS_ZH.map((_, index) => {
                    const day = index + 1;
                    return h(Chk, {
                        key: day, label: weekDayLabel(index), disabled: busy, checked: form.weekdays.includes(day),
                        onChange: checked => update({ weekdays: checked ? [...form.weekdays, day] : form.weekdays.filter(value => value !== day) })
                    });
                }))
            ),
            h("div", { className: styles.cardToolbar },
                h("p", { className: styles["dshc-sub"] }, text("查询与显示时区：", "Search and display time zone: ") + zone),
                h("div", { className: styles["dshc-actions"] },
                    busy ? h(Btn, { onClick: cancel }, text("取消查询", "Cancel search")) : null,
                    h(Btn, { type: "submit", variant: "primary", disabled: busy }, busy ? text("正在查询…", "Searching…") : text("查找空闲", "Find times"))
                )
            )
        ),
        error ? h("p", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" }, error) : null,
        result ? h("div", { className: styles.card, "aria-live": "polite" },
            h("p", { className: styles["dshc-sub"] }, text("读取于 ", "Checked at ") + format(result.checkedAt) +
                text("，已核对 ", " · Checked ") + result.busyEventCount +
                text(" 个占用日程。候选尚未预约，可相互重叠。", " busy events. Candidates are not reserved and may overlap.")),
            result.count ? h("ol", { className: styles.slotGrid }, result.slots.map(slot => h("li", { className: styles.slotCard, key: slot.start },
                h("span", { className: styles.slotRange }, format(slot.start) + " — " + format(slot.end)),
                h(Btn, { variant: "primary", onClick: () => onChoose(slot) }, text("用此时段新建", "Create with this time"))
            ))) : h("p", { role: "status" }, text(
                "查询范围内没有符合条件的空闲时段。可缩短时长、减少缓冲或调整工作时间后重试。",
                "No available times match. Try a shorter duration, less buffer or different working hours."
            )),
            result.hasMore ? h("p", { className: styles["dshc-sub"] }, text("仅显示最早 20 个候选，可缩小日期范围后再查。", "Showing the earliest 20 candidates. Narrow the date range to refine the results.")) : null
        ) : null
    ));
}

function EventForm({ draft, events, onCancel, onSubmit, busy, error, source, original, onDelete, confirmDelete, setConfirmDelete }) {
    const formId = useId();
    const [form, setForm] = useState(draft);
    // Update protection: dsh-calendar.event
    __stardustUpdatesGuard(React, "dsh-calendar.event", { dirty: JSON.stringify(form) !== JSON.stringify(draft), busy: !!busy });

    useEffect(() => { setForm(draft); }, [draft]);
    const patch = fields => setForm(previous => ({ ...previous, ...fields }));
    const isEdit = draft.uid !== undefined;
    const pseudo = asPseudoEvent(form);
    const conflicts = !pseudo ? [] : events.filter(event => event.uid !== form.uid && overlaps(event, pseudo));
    const canSave = form.summary.trim() !== "" && !!pseudo && Date.parse(pseudo.end) >= Date.parse(pseudo.start);
    const field = (key, label, control) => h("div", { className: styles["dshc-field"] },
        h("label", { htmlFor: formId + "-" + key }, label), control
    );
    const input = (key, label, props) => field(key, label, h(Txt, {
        id: formId + "-" + key, value: form[key], onChange: event => patch({ [key]: event.target.value }), ...props
    }));
    const formatter = useMemo(() => new Intl.DateTimeFormat(UI_LANG === "en" ? "en-US" : "zh-CN", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "shortOffset"
    }), [UI_LANG]);
    const resolvedTime = form.sourceRange && !form.allDay && pseudo ? h("p", { className: styles.draftHint, role: "note" },
        calendarText("实际时段：", "Resolved time: ") +
        [pseudo.start, pseudo.end].map(iso => formatter.format(new Date(iso))).join(" — ") +
        calendarText("。未修改的钟点保留原 UTC 偏移。", " · Unchanged times preserve their original UTC offsets.")
    ) : null;

    const body = h(React.Fragment, null,
        source ? h("p", { className: styles.draftHint }, calendarText("目标日历：", "Target calendar: ") + source) : null,
        draft.isSeries ? h("p", { className: styles["dshc-alert"] }, t("form.series")) : null,
        error ? h("div", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" }, error) : null,
        conflicts.length ? h("div", { className: clsx(styles["dshc-alert"], styles.warn), role: "status" },
            h("div", null,
                h("strong", null, t("conflict.title", { n: conflicts.length })),
                conflicts.slice(0, 3).map(event => h("div", { key: eventKey(event) }, "• " + formatWhen(event) + " " + event.summary)),
                h("div", null, t("conflict.hint"))
            )
        ) : null,
        input("summary", t("field.summary"), { "data-modal-autofocus": true, placeholder: t("form.newTitle") }),
        input("date", t("field.date"), { type: "date" }),
        !form.allDay ? h("div", { className: styles["dshc-two"] },
            input("startTime", t("field.start"), { type: "time" }),
            input("endTime", t("field.end"), { type: "time" })
        ) : null,
        resolvedTime,
        h("div", { className: styles["dshc-field"] }, h(Chk, {
            checked: form.allDay === true, label: t("field.allDay"), onChange: next => patch({ allDay: next })
        })),
        field("repeat", t("field.repeat"), h(Picker, {
            id: formId + "-repeat", label: t("field.repeat"), value: form.repeat,
            options: ["", "daily", "weekly", "monthly", "yearly", "custom"].map(id => ({ id, label: t("repeat." + (id || "none")) })),
            onChange: repeat => patch({ repeat })
        })),
        form.repeat === "custom" ? input("rrule", "RRULE", { placeholder: "FREQ=WEEKLY;COUNT=10" }) : null,
        input("location", t("field.location")),
        field("description", t("field.description"), h("textarea", {
            id: formId + "-description", className: styles["dshc-input"], value: form.description,
            onChange: event => patch({ description: event.target.value })
        })),
        confirmDelete && original ? h("p", { className: clsx(styles["dshc-alert"], styles.warn) },
            t("confirm.delete", { name: original.summary }),
            h(Btn, { variant: "ghost", disabled: busy, onClick: () => setConfirmDelete(false) },
                calendarText("取消删除", "Cancel deletion"))) : null
    );
    const footer = h("div", { className: styles["dshc-actions"] },
        original ? h(CopyEventId, { uid: original.uid }) : null,
        original ? h(DeleteEventButton, { event: original, busy, confirmDelete, setConfirmDelete, onDelete }) : null,
        original ? h("span", { className: styles["dshc-spacer"] }) : null,
        h(Btn, { variant: "ghost", onClick: onCancel, disabled: busy }, t("action.cancel")),
        h(Btn, { variant: "primary", onClick: () => onSubmit(form), disabled: busy || !canSave || confirmDelete, "aria-busy": busy }, busy ? "…" : t("action.save"))
    );
    return h(Dlg, {
        open: true, onClose: onCancel, closeLabel: calendarText("关闭", "Close"),
        title: isEdit ? t("form.editTitle") : t("form.newTitle"), children: body, footer
    });
}

function CopyEventId({ uid }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    return h(Btn, { onClick: async () => {
        if (!await copyText(uid)) return;
        clearTimeout(timer.current);
        setCopied(true);
        timer.current = setTimeout(() => setCopied(false), 1600);
    } }, copied ? t("action.copied") : t("action.copy"));
}

function DeleteEventButton({ event, busy, readOnly, confirmDelete, setConfirmDelete, onDelete }) {
    return confirmDelete
        ? h(Btn, { variant: "danger", disabled: busy || readOnly, onClick: () => onDelete(event) }, t("action.confirmDelete"))
        : h(Btn, { variant: "danger", disabled: busy || readOnly, onClick: () => setConfirmDelete(true) }, t("action.delete"));
}

function EventReview({ event, onClose, onEdit, onDelete, busy, confirmDelete, setConfirmDelete, events, readOnly }) {
    const seriesCount = event.isOccurrence ? events.filter(e => e.uid === event.uid && e.seriesStart === event.seriesStart).length : 0;
    const details = [
        event.rrule && [t("repeat.recurring"), humanRepeat(event.rrule) + " · " + event.rrule],
        event.isOccurrence && !event.rrule && [t("repeat.occurrence"), (seriesCount > 0 ? seriesCount + " / " : "") + t("repeat.occurrence")],
        event.location && [t("field.location"), event.location],
        event.description && [t("field.description"), event.description],
        [t("field.uid"), h("span", { className: styles["dshc-mono"] }, event.uid)]
    ].filter(Boolean);
    const body = h(React.Fragment, null,
        h("div", { className: styles.reviewMeta },
            formatWhen(event), h("span", { className: styles["dshc-tag"] }, formatDuration(event))
        ),
        h("dl", { className: styles["dshc-kv"] }, details.map(([label, value]) => h(React.Fragment, { key: label },
            h("dt", null, label), h("dd", null, value)
        ))),
        confirmDelete ? h("p", { className: clsx(styles["dshc-alert"], styles.warn) },
            t(isRecurring(event) ? "confirm.deleteSeries" : "confirm.delete", { name: event.summary })) : null
    );
    const footer = h("div", { className: styles["dshc-actions"] },
        h(CopyEventId, { uid: event.uid }),
        h("span", { className: styles["dshc-spacer"] }),
        h(DeleteEventButton, { event, busy, readOnly, confirmDelete, setConfirmDelete, onDelete }),
        h(Btn, { variant: "primary", onClick: () => onEdit(event), disabled: busy || readOnly }, t("action.edit"))
    );
    return h(Dlg, {
        open: true, review: true, title: event.summary,
        closeLabel: PRIM?.Modal ? calendarText("关闭", "Close") : "close", onClose, children: body, footer
    });
}

function calendarText(zh, en) {
    return UI_LANG === "en" ? en : zh;
}

const WEEKDAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekDayLabel(index) {
    return UI_LANG === "en" ? WEEKDAYS_EN[index] : "周" + WEEKDAYS_ZH[index];
}

function conflictSummary(events) {
    const sorted = events.map(event => ({ event, start: +startDate(event), end: +endDate(event) }))
        .sort((a, b) => a.start - b.start);
    const conflicted = new Set();
    let count = 0;
    let overlap;
    for (const [index, current] of sorted.entries()) {
        for (let i = index + 1; i < sorted.length && sorted[i].start < current.end; i++) {
            const next = sorted[i];
            if (!overlaps(current.event, next.event)) continue;
            count++;
            conflicted.add(current.event);
            conflicted.add(next.event);
            const end = Math.min(current.end, next.end);
            if (!overlap && next.start < end) overlap = {
                start: new Date(next.start), end: new Date(end),
                allDay: current.event.allDay && next.event.allDay
            };
        }
    }
    return { count, conflicted, overlap };
}

function MiniCalendar({ anchor, onPick }) {
    const [browsed, setBrowsed] = useState(null);
    const grid = useRef(null);
    const month = browsed?.anchor === anchor ? browsed.month : anchor;
    const days = monthGridDays(month);
    const today = dayKey(new Date());
    const selected = dayKey(anchor);
    const monthFocus = days.findIndex(day => dayKey(day) === selected);
    const [focused, setFocused] = useState("");
    const focusIndex = days.findIndex(day => dayKey(day) === focused);
    const tabStop = focusIndex >= 0 ? focusIndex : monthFocus >= 0 ? monthFocus : days.findIndex(day => day.getMonth() === month.getMonth());
    const browse = delta => setBrowsed({ anchor, month: addMonths(month, delta) });

    function moveFocus(event, index) {
        const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
        if (!Object.hasOwn(offsets, event.key)) return;
        event.preventDefault();
        const next = index + offsets[event.key];
        grid.current?.querySelectorAll("button")[next]?.focus();
    }

    return h("div", { className: styles.miniCalendar },
        h("div", { className: styles.miniHeading },
            h("h2", null, formatMonthTitle(month)),
            h("div", { className: styles.period },
                h(IconButton, { icon: "left", label: calendarText("上个月", "Previous month"), onClick: () => browse(-1) }),
                h(IconButton, { icon: "right", label: calendarText("下个月", "Next month"), onClick: () => browse(1) })
            )
        ),
        h("div", { className: styles.miniGrid, ref: grid },
            WEEKDAYS_ZH.map((day, index) => h("span", { className: styles.miniWeekday, key: day, title: weekDayLabel(index) }, UI_LANG === "en" ? WEEKDAYS_EN[index].slice(0, 2) : day)),
            days.map((day, index) => {
                const key = dayKey(day);
                return h("button", {
                    key, type: "button", onClick: () => onPick(day), onFocus: () => setFocused(key),
                    className: clsx(styles.miniDay, day.getMonth() !== month.getMonth() && styles.out),
                    "aria-pressed": selected === key, "aria-current": today === key ? "date" : undefined,
                    "aria-label": formatDay(day, { withYear: true }),
                    tabIndex: index === tabStop ? 0 : -1,
                    onKeyDown: event => moveFocus(event, index)
                }, day.getDate());
            })
        )
    );
}

function ScheduleRail({ id, anchor, onPick, source, showing, onVisibilityChange, conflicts, overlap, workbench, loading, onReviewConflicts }) {
    const hasConflicts = conflicts > 0;
    const conflictText = hasConflicts
        ? calendarText(conflicts + " 处时间重叠", conflicts === 1 ? "1 scheduling overlap" : conflicts + " scheduling overlaps")
        : calendarText("当前范围无冲突", "No conflicts in this range");
    return h("aside", { id, className: styles.rail, "aria-label": calendarText("日历侧栏", "Calendar sidebar") },
        h("div", { className: styles.railScroll },
            h(MiniCalendar, { anchor, onPick }),
            h("section", { className: styles.railSection },
                h("h2", null, calendarText("已连接日历", "Connected calendar")),
                h("div", { className: styles.calendarSource }, source
                    ? h(Chk, { checked: showing, label: source, title: source, onChange: onVisibilityChange })
                    : h("p", { className: styles["dshc-sub"] }, loading ? t("state.loading") : calendarText("尚未连接日历", "No calendar connected"))),
                source && showing ? h("div", { className: clsx(styles.conflictCard, hasConflicts && styles.warn) },
                    h(Icon, { name: hasConflicts ? "warning" : "check", size: 14 }),
                    h("div", null,
                        h("span", { role: "status" }, conflictText),
                        workbench && overlap ? h("div", { className: styles.conflictRange }, formatWhen(overlap)) : null,
                        hasConflicts && onReviewConflicts ? h(Btn, {
                            variant: "ghost", className: styles.conflictLink, onClick: onReviewConflicts
                        }, calendarText("查看冲突", "Review conflicts")) : null
                    )
                ) : null
            )
        ),
        workbench ? h("div", { className: styles.railUpdates },
            h(__StardustPluginUpdatesFooter, { React, name: "dsh-calendar" })) : null
    );
}

const CALENDAR_LAYOUT_KEY = "dsh-calendar:layout";
const CALENDAR_RAIL_KEY = "dsh-calendar:rail-width";
const RAIL_MIN_WIDTH = 180;
const RAIL_MAX_WIDTH = 360;
const RAIL_DEFAULT_WIDTH = 236;
const LAYOUT_CLASSES = {
    native: undefined,
    floating: styles.layoutFloating,
    spotlight: styles.layoutSpotlight,
    cards: styles.layoutCards
};

function readCalendarPreference(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
}

function storeCalendarPreference(key, value) {
    try { window.localStorage.setItem(key, String(value)); } catch { /* Private storage is optional. */ }
}

function loadCalendarLayout() {
    const layout = readCalendarPreference(CALENDAR_LAYOUT_KEY);
    return Object.hasOwn(LAYOUT_CLASSES, layout) ? layout : "native";
}

function calendarLayoutOptions() {
    return [
        { id: "native", label: calendarText("DSH 原生", "DSH native") },
        { id: "floating", label: calendarText("Arc 浮岛", "Arc Floating") },
        { id: "spotlight", label: calendarText("Raycast 聚光", "Raycast Spotlight") },
        { id: "cards", label: calendarText("Bento 卡片", "Bento Cards") }
    ];
}

function CalendarLayoutPicker({ layout, options, onChange }) {
    const label = calendarText("布局", "Layout");
    return h(React.Fragment, null,
        h("div", { className: styles.layoutChoices, role: "group", "aria-label": label },
            options.map(option => h(Btn, {
                key: option.id, variant: option.id === layout ? "primary" : "ghost",
                "aria-pressed": option.id === layout, onClick: () => onChange(option.id)
            }, option.label))
        ),
        h("div", { className: styles.layoutDropdown },
            h(Picker, { label, value: layout, compact: true, options, onChange })
        )
    );
}

function CalendarShortcutHints({ quickKey }) {
    const hints = [
        ["W / M / A", calendarText("周 / 月 / 议程", "Week / Month / Agenda")],
        ["N", t("action.new")],
        ["F", calendarText("找空闲时段", "Find available time")],
        [quickKey, calendarText("快捷操作", "Quick actions")]
    ];
    return h("div", { className: styles.shortcutHints },
        hints.map(([keys, label]) => h("span", { key: keys },
            h("kbd", { className: styles.commandKey }, keys), label
        ))
    );
}

function ScheduleLayout({ resizable, rail, children }) {
    const [width, setWidth] = useState(() => {
        const saved = Number(readCalendarPreference(CALENDAR_RAIL_KEY));
        return saved >= RAIL_MIN_WIDTH && saved <= RAIL_MAX_WIDTH ? saved : RAIL_DEFAULT_WIDTH;
    });
    const drag = useRef(null);
    const clampWidth = (value) => Math.min(RAIL_MAX_WIDTH, Math.max(RAIL_MIN_WIDTH, Math.round(value)));
    const commit = (value) => {
        const next = clampWidth(value);
        setWidth(next);
        storeCalendarPreference(CALENDAR_RAIL_KEY, next);
    };
    const pointerWidth = (event, origin) => origin.width + (event.clientX - origin.x) * origin.direction;
    function begin(event) {
        if (event.button !== 0 || drag.current) return;
        const handle = event.currentTarget;
        drag.current = {
            id: event.pointerId, x: event.clientX, savedWidth: width,
            width: handle.previousElementSibling.getBoundingClientRect().width,
            direction: getComputedStyle(handle).direction === "rtl" ? -1 : 1
        };
        handle.setPointerCapture(event.pointerId);
        handle.focus({ preventScroll: true });
    }
    function move(event) {
        const origin = drag.current;
        if (origin?.id === event.pointerId) setWidth(clampWidth(pointerWidth(event, origin)));
    }
    function end(event) {
        const origin = drag.current;
        if (!origin || origin.id !== event.pointerId) return;
        drag.current = null;
        if (event.type === "pointerup") commit(pointerWidth(event, origin));
        else setWidth(origin.savedWidth);
    }
    function resizeWithKey(event) {
        const handle = event.currentTarget;
        const rtl = getComputedStyle(handle).direction === "rtl";
        const current = handle.previousElementSibling.getBoundingClientRect().width;
        const deltas = { ArrowRight: rtl ? -16 : 16, ArrowLeft: rtl ? 16 : -16 };
        if (!Object.hasOwn(deltas, event.key) && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        if (event.key === "Home") commit(RAIL_MIN_WIDTH);
        else if (event.key === "End") commit(RAIL_MAX_WIDTH);
        else commit(current + deltas[event.key]);
    }
    return h("div", {
        className: styles.schedule,
        "data-resizable": resizable ? "" : undefined,
        style: resizable ? { "--calendar-rail-width": width + "px" } : undefined
    },
        rail,
        resizable ? h("div", {
            className: styles.railHandle, role: "separator", tabIndex: 0,
            "aria-label": calendarText("调整日历侧栏宽度", "Resize calendar sidebar"),
            "aria-controls": rail.props.id,
            "aria-orientation": "vertical", "aria-valuemin": RAIL_MIN_WIDTH,
            "aria-valuemax": RAIL_MAX_WIDTH, "aria-valuenow": width,
            onPointerDown: begin, onPointerMove: move, onPointerUp: end, onPointerCancel: end, onLostPointerCapture: end,
            onKeyDown: resizeWithKey
        }) : null,
        children
    );
}

function CalendarCommands({ actions, onClose }) {
    const title = calendarText("日历快捷操作", "Calendar quick actions");
    const searchLabel = calendarText("搜索日历操作", "Search calendar actions");
    const [query, setQuery] = useState("");
    const bodyRef = useRef(null);
    const keyword = query.trim().toLocaleLowerCase();
    const matches = actions.filter(action => action.label.toLocaleLowerCase().includes(keyword));
    const run = (action) => {
        if (!action || action.disabled) return;
        onClose();
        action.run();
    };
    function navigate(event) {
        if (event.isComposing) return;
        const input = bodyRef.current.querySelector("input");
        if (event.target === input && event.key === "Enter") {
            event.preventDefault();
            run(matches.find(action => !action.disabled));
            return;
        }
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const controls = [input, ...bodyRef.current.querySelectorAll("button:not(:disabled)")];
        const index = controls.indexOf(event.target);
        if (index < 0) return;
        event.preventDefault();
        const next = index + (event.key === "ArrowDown" ? 1 : -1);
        controls[Math.max(0, Math.min(controls.length - 1, next))]?.focus();
    }
    return h(Dlg, {
        open: true, title, onClose, closeLabel: calendarText("关闭", "Close"),
        children: h("div", { className: styles.commandBody, ref: bodyRef, onKeyDown: navigate },
            h(Txt, {
                type: "search", icon: h(Icon, { name: "search" }), value: query,
                "data-modal-autofocus": true, "aria-label": searchLabel, placeholder: searchLabel,
                onChange: event => setQuery(event.target.value)
            }),
            matches.length ? h("div", { className: styles.commandList }, matches.map(action => h(Btn, {
                key: action.id, variant: "ghost", className: styles.commandRow,
                onClick: () => run(action), disabled: action.disabled
            },
                h("span", null, action.label),
                action.key ? h("kbd", { className: styles.commandKey }, action.key.toUpperCase()) : null
            ))) : h("p", { className: styles["dshc-sub"], role: "status" }, calendarText("没有匹配的操作", "No matching actions"))
        )
    });
}

function CalendarConflicts({ events, onPick, onClose }) {
    return h(Dlg, {
        open: true, title: calendarText("日程冲突", "Scheduling conflicts"), onClose, closeLabel: calendarText("关闭", "Close"),
        children: events.size
            ? h("div", { className: styles.conflictList }, sortForDisplay([...events]).map(event => h(Row, {
                key: eventKey(event), event, onClick: () => { onClose(); onPick(event); }
            })))
            : h("p", { className: styles["dshc-sub"], role: "status" }, calendarText("当前范围无冲突", "No conflicts in this range"))
    });
}

        // Resolve against the Harness document base, including any reverse-proxy prefix.
        const ROUTE = "_dsh/dsh-calendar/settings";
        const IMPORT_ROUTE = "api/dsh-calendar/import";
        /** 三视图；order 决定 tab 顺序。 */
        const VIEWS = ["month", "week", "agenda"];
        const WEEKDAYS_ZH = ["一", "二", "三", "四", "五", "六", "日"];
        /** 上次用的视图：用户下次打开面板不该又跳回「月」。localStorage 不可用（隐私模式）就退回 default。 */
        const VIEW_STORAGE_KEY = "dsh-calendar:view";
        function loadStoredView() {
            try {
                const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
                return VIEWS.indexOf(stored) === -1 ? "month" : stored;
            }
            catch (error) {
                return "month";
            }
        }
        function storeView(view) {
            try {
                window.localStorage.setItem(VIEW_STORAGE_KEY, view);
            }
            catch (error) { /* 写不进去就算了 */ }
        }
        const UI = {
            zh: {
                "nav.title": "日历",
                "section.title": "日历",
                "section.intro": "在设置页直接查看和编辑 CalDAV 上的日程：月/周/议程三种视图，点一下就能改时间、换标题、加重复规则。",
                "view.month": "月", "view.week": "周", "view.agenda": "议程",
                "action.today": "今天", "action.prev": "上", "action.next": "下", "action.new": "新建日程",
                "action.refresh": "刷新", "action.retry": "重试", "action.edit": "编辑", "action.delete": "删除",
                "action.save": "保存", "action.cancel": "取消", "action.confirmDelete": "确认删除",
                "action.open": "打开", "action.copy": "复制 uid", "action.copied": "已复制",
                "action.demo": "查看示例", "action.exitDemo": "退出示例",
                "state.loading": "正在读取日历…", "state.empty": "这段时间没有日程。",
                "state.notConfigured": "还没配置 CalDAV 账号",
                "state.notConfiguredHint": "点击“连接设置”，选择日历服务并填写账号信息，测试连接后保存即可。也可以先查看示例，了解日历的用法。",
                "state.readonly": "只读",
                "demo.banner": "示例日历为只读，可以切换视图和查看详情。点击「退出示例」后连接自己的日历，即可创建和修改日程。",
                "field.summary": "标题", "field.date": "日期", "field.start": "开始", "field.end": "结束",
                "field.allDay": "全天", "field.location": "地点", "field.description": "备注",
                "field.repeat": "重复", "field.uid": "事件 uid", "field.when": "时间", "field.duration": "时长",
                "repeat.none": "不重复", "repeat.daily": "每天", "repeat.weekly": "每周", "repeat.monthly": "每月", "repeat.yearly": "每年", "repeat.custom": "自定义 RRULE",
                "repeat.weeklyEvery": "每周（{n} 次）", "repeat.recurring": "重复", "repeat.occurrence": "系列中的一次",
                "conflict.title": "这个时段已有 {n} 个日程，会重叠：", "conflict.hint": "仍然保存？",
                "error.title": "操作失败", "error.load": "读取日历失败",
                "confirm.delete": "删除「{name}」？这个操作会同步到你的日历服务器。",
                "confirm.deleteSeries": "将删除「{name}」整个重复系列的所有场次，包含当前视图外的场次。无法撤销。",
                "form.series": "正在编辑整个重复系列，所有场次都会受影响。含取消或单独改期场次时，请到原日历客户端调整时间和规则。",
                "form.newTitle": "新建日程", "form.editTitle": "编辑日程",
                "form.required": "标题和时间都要填。",
                "day.today": "今天", "day.tomorrow": "明天", "day.yesterday": "昨天",
                "count.events": "{n} 个日程", "count.occurrences": "含 {n} 次重复展开",
                "format.duration.hm": "{h} 小时 {m} 分", "format.duration.h": "{h} 小时", "format.duration.m": "{m} 分钟", "format.duration.zero": "0 分钟",
                "format.allday": "全天",
                "drag.hint": "提示：周视图里可以直接拖动日程改期 —— 上下拖改时间、左右拖换天，拖块底部改时长；键盘 ↑/↓ 挪 15 分钟、Shift+↑/↓ 挪 1 小时、←/→ 挪一天。",
                "drag.drop": "松手即改到这里",
                "drag.conflict": "与 {n} 个日程重叠",
                "drag.keep": "仍可松手",
                "drag.moveTitle": "可拖动改期",
                "drag.resizeTitle": "拖动改时长",
                "move.recurringUnsupported": "重复日程暂不支持拖动改期：请在详情里用「编辑」（拖动会重锚系列起点，早于该次的实例会消失）。",
                "move.tooLong": "超过 24 小时的日程暂不支持拖动改期。",
                "move.saved": "已改期",
                "move.undo": "撤销",
                "move.failed": "改期失败：{message}",
                "conn.button": "连接设置",
                "conn.title": "CalDAV 连接设置",
                "conn.intro": "测试连接不会修改日历。连接成功后，点击“保存并启用”。",
                "conn.provider": "服务商",
                "provider.custom": "自建 CalDAV",
                "conn.caldavUrl": "日历集合 URL",
                "conn.username": "账号",
                "conn.password": "密码 / 应用专用密码",
                "conn.host": "服务器地址",
                "conn.user": "用户名",
                "conn.calendar": "日历名（如 personal）",
                "conn.calendarId": "日历 ID（通常是你的邮箱）",
                "conn.clientId": "clientId",
                "conn.clientSecret": "clientSecret",
                "conn.refreshToken": "refreshToken",
                "conn.tokenUrl": "令牌地址（可留空）",
                "conn.proxyUrl": "代理地址（可留空）",
                "conn.keep": "已配置，留空不改",
                "conn.test": "测试连接",
                "conn.testing": "正在连接…",
                "conn.save": "保存并启用",
                "conn.saving": "保存中…",
                "conn.ok": "连接成功：未来 30 天读到 {n} 个日程",
                "conn.okSample": "（例如：{sample}）",
                "conn.fail": "连接失败",
                "conn.savedToast": "连接已保存，工具下一次调用就用它",
                "conn.noSettings": "当前无法保存连接设置。请检查 DSH 与日历插件是否已更新，再重新打开此页面。",
                "conn.storageFallback": "连接信息保存在运行 DSH 的设备上，保存后立即生效。",
                "conn.needProvider": "先选一个服务商",
                "conn.current": "当前：{summary}",
                "conn.steps": "怎么拿到这些值？（点开看步骤）",
                "link.googleConsole": "打开 Google Cloud 凭据页 ↗",
                "link.googlePlayground": "打开 OAuth Playground ↗",
                "link.appleId": "打开 Apple ID 设置 ↗",
                "hint.calendarId.google": "通常就是你的 Gmail 地址",
                "hint.clientId.google": "OAuth 客户端 ID，类型选「桌面应用」即可",
                "hint.refreshToken.google": "用下面步骤里的 OAuth Playground 换一次，长期有效",
                "hint.tokenUrl": "留空即用 Google 默认地址",
                "hint.caldavUrl.icloud": "形如 https://caldav.icloud.com/<数字ID>/calendars/<日历ID>/ —— 数字 ID 在与日历同级的设置里能看到",
                "hint.username.icloud": "你的 Apple ID 邮箱",
                "hint.password.icloud": "必须用 App 专用密码，不是 Apple ID 登录密码",
                "hint.host.nextcloud": "含 https://，结尾不要带 /",
                "hint.user.nextcloud": "拼 CalDAV 地址用的用户名（通常与登录名相同）",
                "hint.username.nextcloud": "用于认证的账号名；与上一栏不同时才需要分别填",
                "hint.calendar.nextcloud": "日历名，个人日历默认是 personal",
                "hint.caldavUrl.custom": "完整日历集合 URL，结尾的 / 别丢",
                "hint.username.custom": "登录账号 / 邮箱",
                "steps.google": ["在 Google Cloud 控制台新建项目，并启用「Google Calendar API」", "「凭据」→ 创建凭据 → OAuth 客户端 ID，类型选「桌面应用」，拿到 clientId 与 clientSecret", "打开 OAuth Playground（齿轮里勾 Use your own OAuth credentials，填上面的 clientId / clientSecret），授权 scope https://www.googleapis.com/auth/calendar，换取 refreshToken", "日历 ID 一般就是你的 Gmail 地址；四格填完点「测试连接」"],
                "steps.icloud": ["到 appleid.apple.com → 登录与安全 → App 专用密码，生成一个（形如 xxxx-xxxx-xxxx-xxxx）", "iCloud 网页版日历 → 左下角齿轮 → 日历设置，找到你要连的那本日历的 CalDAV 地址", "账号填 Apple ID 邮箱，密码填上一步的 App 专用密码"],
                "steps.nextcloud": ["服务器地址填 https://cloud.example.com（结尾不带 /）", "用户名 = 登录名；日历名在「日历」应用左侧能看到，个人日历默认叫 personal", "密码用 App 密码或登录密码，填完点「测试连接」"],
                "steps.custom": ["在服务商后台找到你日历的集合 URL（以 / 结尾），例如 https://cloud.example.com/remote.php/dav/calendars/用户名/日历名/", "账号填登录名，密码填授权码 / App 密码，填完点「测试连接」"],
                "conn.googleHint": "Google 必须用 OAuth：clientSecret 与 refreshToken 由一次授权换成，README 里有换取步骤；Google 不接受应用专用密码。",
                "conn.icloudHint": "iCloud 用 App 专用密码（appleid.apple.com → 登录与安全）；日历集合 URL 形如 https://caldav.icloud.com/<数字ID>/calendars/<日历ID>/，可在 iCloud 网页版日历设置里找到。",
                "conn.nextcloudHint": "Nextcloud 填服务器地址 + 用户名 + 日历名即可，密码用 App 密码或登录密码。",
                "conn.customHint": "自建 CalDAV 直接给完整日历集合 URL（结尾的 / 别丢），形如 https://cloud.example.com/remote.php/dav/calendars/用户名/日历名/。"
            },
            en: {
                "nav.title": "Calendar",
                "section.title": "Calendar",
                "section.intro": "View and edit your CalDAV calendar right here: month, week and agenda views; click any event to retitle it, move it, or add a recurrence rule.",
                "view.month": "Month", "view.week": "Week", "view.agenda": "Agenda",
                "action.today": "Today", "action.prev": "Prev", "action.next": "Next", "action.new": "New event",
                "action.refresh": "Refresh", "action.retry": "Retry", "action.edit": "Edit", "action.delete": "Delete",
                "action.save": "Save", "action.cancel": "Cancel", "action.confirmDelete": "Delete anyway",
                "action.open": "Open", "action.copy": "Copy uid", "action.copied": "Copied",
                "action.demo": "See a sample", "action.exitDemo": "Exit sample",
                "state.loading": "Loading your calendar…", "state.empty": "Nothing scheduled in this range.",
                "state.notConfigured": "No CalDAV account configured yet",
                "state.notConfiguredHint": "Open Connection settings, choose your calendar service and enter your account details, then test and save the connection. You can also explore the sample calendar first.",
                "state.readonly": "read-only",
                "demo.banner": "This sample calendar is read-only. Switch views and open event details. Exit the sample and connect your calendar to create or edit events.",
                "field.summary": "Title", "field.date": "Date", "field.start": "Start", "field.end": "End",
                "field.allDay": "All day", "field.location": "Location", "field.description": "Notes",
                "field.repeat": "Repeats", "field.uid": "Event uid", "field.when": "When", "field.duration": "Duration",
                "repeat.none": "Does not repeat", "repeat.daily": "Daily", "repeat.weekly": "Weekly", "repeat.monthly": "Monthly", "repeat.yearly": "Yearly", "repeat.custom": "Custom RRULE",
                "repeat.weeklyEvery": "Weekly ({n} times)", "repeat.recurring": "Recurring", "repeat.occurrence": "One occurrence of a series",
                "conflict.title": "This slot already has {n} event(s); they overlap:", "conflict.hint": "Save anyway?",
                "error.title": "Something failed", "error.load": "Could not load the calendar",
                "confirm.delete": "Delete「{name}」? This is pushed to your calendar server.",
                "confirm.deleteSeries": "Delete every occurrence of {name}, including dates outside this view? This cannot be undone.",
                "form.series": "Editing the entire recurring series. All occurrences are affected. If it has cancelled or rescheduled occurrences, change times and rules in your original calendar app.",
                "form.newTitle": "New event", "form.editTitle": "Edit event",
                "form.required": "A title and a time range are required.",
                "day.today": "Today", "day.tomorrow": "Tomorrow", "day.yesterday": "Yesterday",
                "count.events": "{n} events", "count.occurrences": "{n} expanded occurrences",
                "format.duration.hm": "{h}h {m}m", "format.duration.h": "{h}h", "format.duration.m": "{m}m", "format.duration.zero": "0m",
                "format.allday": "All day",
                "drag.hint": "Tip: drag events in the week view to reschedule — up/down changes the time, left/right changes the day, the bottom edge changes the duration. Keyboard: ↑/↓ moves 15 min, Shift+↑/↓ an hour, ←/→ a day.",
                "drag.drop": "release to drop here",
                "drag.conflict": "overlaps {n} event(s)",
                "drag.keep": "you can still drop it",
                "drag.moveTitle": "drag to reschedule",
                "drag.resizeTitle": "drag to resize",
                "move.recurringUnsupported": "Recurring events cannot be dragged yet — use Edit in the details drawer (dragging would re-anchor the series and drop earlier occurrences).",
                "move.tooLong": "Events longer than 24 hours cannot be dragged yet.",
                "move.saved": "Rescheduled",
                "move.undo": "Undo",
                "move.failed": "Could not reschedule: {message}",
                "conn.button": "Connection",
                "conn.title": "CalDAV connection",
                "conn.intro": "Testing the connection does not change your calendar. Once it succeeds, click Save and enable.",
                "conn.provider": "Provider",
                "provider.custom": "Custom CalDAV",
                "conn.caldavUrl": "Calendar collection URL",
                "conn.username": "Account",
                "conn.password": "Password / app-specific password",
                "conn.host": "Server",
                "conn.user": "Username",
                "conn.calendar": "Calendar name (e.g. personal)",
                "conn.calendarId": "Calendar ID (usually your email)",
                "conn.clientId": "clientId",
                "conn.clientSecret": "clientSecret",
                "conn.refreshToken": "refreshToken",
                "conn.tokenUrl": "Token URL (optional)",
                "conn.proxyUrl": "Proxy URL (optional)",
                "conn.keep": "configured — leave blank to keep",
                "conn.test": "Test connection",
                "conn.testing": "Connecting…",
                "conn.save": "Save and enable",
                "conn.saving": "Saving…",
                "conn.ok": "Connected: {n} events in the next 30 days",
                "conn.okSample": " (e.g. {sample})",
                "conn.fail": "Connection failed",
                "conn.savedToast": "Saved — the tools pick it up on their next call",
                "conn.noSettings": "Connection settings cannot be saved right now. Check that DSH and the calendar plugin are up to date, then reopen this page.",
                "conn.storageFallback": "Connection details are stored on the device running DSH. Saved changes take effect immediately.",
                "conn.needProvider": "Pick a provider first",
                "conn.current": "Now: {summary}",
                "conn.steps": "Where do these values come from?",
                "link.googleConsole": "Open Google Cloud credentials ↗",
                "link.googlePlayground": "Open OAuth Playground ↗",
                "link.appleId": "Open Apple ID settings ↗",
                "hint.calendarId.google": "usually your Gmail address",
                "hint.clientId.google": "an OAuth client ID; the desktop-app type works",
                "hint.refreshToken.google": "exchange it once in the OAuth Playground step below; it lasts",
                "hint.tokenUrl": "leave empty to use Google's default",
                "hint.caldavUrl.icloud": "looks like https://caldav.icloud.com/<numeric id>/calendars/<calendar id>/",
                "hint.username.icloud": "your Apple ID email",
                "hint.password.icloud": "an app-specific password, not your Apple ID password",
                "hint.host.nextcloud": "include https:// and drop any trailing /",
                "hint.user.nextcloud": "the username used to build the CalDAV URL",
                "hint.username.nextcloud": "the account used to authenticate; fill it separately only when it differs",
                "hint.calendar.nextcloud": "calendar name; the personal one is usually called personal",
                "hint.caldavUrl.custom": "the full collection URL — keep the trailing slash",
                "hint.username.custom": "login account / email",
                "steps.google": ["Create a project in the Google Cloud console and enable the Google Calendar API", "Credentials → Create credentials → OAuth client ID, type Desktop app; copy clientId and clientSecret", "Open the OAuth Playground (gear icon: Use your own OAuth credentials, paste clientId/clientSecret), authorize scope https://www.googleapis.com/auth/calendar and exchange a refreshToken", "The calendar ID is usually your Gmail address; then hit Test connection"],
                "steps.icloud": ["Go to appleid.apple.com → Sign-In and Security → App-Specific Passwords and create one (xxxx-xxxx-xxxx-xxxx)", "In iCloud web Calendar → gear → Calendar settings, find the CalDAV URL of the calendar you want", "Fill your Apple ID email and that app-specific password"],
                "steps.nextcloud": ["Server: https://cloud.example.com (no trailing slash)", "Username = your login; the calendar name is shown in the Calendar app (personal by default)", "Use an app password or your login password, then hit Test connection"],
                "steps.custom": ["Find your calendar collection URL in the provider's settings (it ends with /), e.g. https://cloud.example.com/remote.php/dav/calendars/user/calendar/", "Fill the login account and an app password / token, then Test connection"],
                "conn.googleHint": "Google requires OAuth: exchange clientSecret and refreshToken once (see the README); Google does not accept app passwords.",
                "conn.icloudHint": "iCloud uses an app-specific password (appleid.apple.com → Sign-In and Security); the collection URL looks like https://caldav.icloud.com/<numeric id>/calendars/<calendar id>/.",
                "conn.nextcloudHint": "Nextcloud needs the server URL, username and calendar name; any app password works.",
                "conn.customHint": "For a self-hosted CalDAV give the full collection URL (keep the trailing slash), e.g. https://cloud.example.com/remote.php/dav/calendars/user/calendar/."
            }
        };
        var UI_LANG = "zh";
        var relocalize = null;
        var activeLocaleService = null;
        // Backend guidance is localized separately from event titles and source content.
        const BACKEND_EN = {
            '系列含已取消、额外或单独改期的场次，不能整体改开始时间、全天类型或重复规则；请在原日历客户端编辑，现有日程未改动。': 'This series has cancelled, extra or rescheduled occurrences. Change its start time, all-day type or recurrence rule in the original calendar app. No event was changed.',
            '这是整个重复系列。请先向用户说明影响，确认后显式传 scope="series"；当前不支持只改某一次。': 'This action changes the entire recurring series. Explain its impact, then use scope="series" after confirmation. Editing just one occurrence is unsupported.',
            '这是整个重复系列。请先向用户说明影响，确认后显式传 scope="series"；当前不支持只删某一次。': 'This action deletes the entire recurring series. Explain its impact, then use scope="series" after confirmation. Deleting just one occurrence is unsupported.',
            '找不到或无法解析日程，请刷新日历后重试。': 'The event is missing or could not be parsed. Refresh the calendar and try again.',
            '无法解析原日程，更新已取消；请在原日历客户端检查。': 'The original event could not be parsed. No update was made. Check it in the original calendar app.',
            "日期格式不合法": "Invalid date format.",
            "日程包含不存在的日期或时间": "This event contains an invalid date or time.",
            "请先选择或粘贴 ICS 文件内容": "Choose an ICS file or paste its content first.",
            "ICS 文件超过 256 KiB，请分批导出": "The ICS file exceeds 256 KiB. Export smaller batches.",
            "ICS 结构不合法或嵌套过深": "The ICS structure is invalid or nested too deeply.",
            "ICS 文件不完整": "The ICS file is incomplete.",
            "无法读取 ICS，请从日历应用重新导出": "Could not read the ICS file. Export it again from your calendar app.",
            "暂不支持 PERIOD 类型的 RDATE，请改用日期列表后导入": "PERIOD RDATE values are unsupported. Export a list of dates instead.",
            "全天日期不能含 TZID": "All-day dates must not contain TZID.",
            "文件含未标注时区的时间，请选择解释时区后重新预览": "This file contains times without a timezone. Choose an interpretation timezone and preview again.",
            "UTC 时间不能同时标注 TZID": "UTC timestamps must not also contain TZID.",
            "原文件缺少 DTSTAMP，导入时补齐": "DTSTAMP is missing and will be added during import.",
            "作为私人日程复制，不导入参与者或发送邀请": "Imported as a private copy. Attendees are omitted and no invitations are sent.",
            "仅保留屏幕提醒，已移除其他提醒动作": "Only display reminders are retained; other alarm actions were removed.",
            "开始与结束必须同时为全天日期或具体时间": "Start and end must both be all-day dates or both be timestamps.",
            "日程或重复例外的结束时间早于开始时间": "The event or recurring exception ends before it starts.",
            "日程无法解析": "Could not parse this event.",
            "结束时间早于开始时间": "End time precedes start time.",
            "重复规则 UNTIL 需要 UTC 时间，请重新导出": "The recurrence UNTIL must use UTC. Export the event again.",
            "日程格式不合法": "Invalid event format.",
            "日历连接已改变，请重新预览": "The calendar connection changed. Preview again.",
            "请先核对预览，再确认导入": "Review the preview before confirming import.",
            "预览已过期或插件已重启，请重新预览": "The preview expired or the plugin restarted. Preview again.",
            "每次请选择 1–20 个日程系列，其余可分批导入": "Select 1–20 event series per batch.",
            "选择包含不可导入的日程，请重新预览": "Some selected events cannot be imported. Preview again.",
            "另一批日程正在导入，请稍后重试": "Another batch is importing. Try again after it finishes.",
            "不支持此导入操作": "Unsupported import operation.",
            "请求必须是对象": "The request must be an object."
        };
        function backendMessage(error) {
            const message = typeof error === 'string' ? error : error?.message || String(error || '');
            if (UI_LANG !== 'en')
                return message;
            if (error?.status === 401)
                return 'Your DSH session expired. Reopen DSH and try again.';
            if (BACKEND_EN[message])
                return BACKEND_EN[message];
            if (!/[\u3400-\u9fff]/.test(message))
                return message;
            const timezone = message.match(/^(文件重复定义时区|时区定义不完整|时区规则的 DTSTART 必须是本地时间|时区偏移不合法|缺少时区定义)：(.+)$/);
            if (timezone)
                return ({ '文件重复定义时区': 'Duplicate timezone definition', '时区定义不完整': 'Incomplete timezone definition', '时区规则的 DTSTART 必须是本地时间': 'Timezone DTSTART must use local time', '时区偏移不合法': 'Invalid timezone offset', '缺少时区定义': 'Missing timezone definition' })[timezone[1]] + ': ' + timezone[2];
            const floating = message.match(/^原文件未标注时区，按 (.+) 解释$/);
            if (floating)
                return 'No timezone in the source; interpreted as ' + floating[1] + '.';
            if (/OAuth|Google|凭据|未配置|尚未配置|没有配置|连接设置/.test(message))
                return 'Calendar credentials are incomplete. Open Connection settings and configure the calendar account; the DSH model API key cannot be used here.';
            if (/时区/.test(message))
                return 'Invalid or missing timezone. Choose an interpretation timezone or export a file with VTIMEZONE.';
            if (/VCALENDAR|VERSION|VEVENT/.test(message))
                return 'Use a valid iCalendar 2.0 file containing VEVENT entries.';
            if (/UID|重复/.test(message))
                return 'Check event UIDs and recurrence definitions, then export the file again.';
            if (/冲突|修改|改变/.test(message))
                return 'The calendar or event changed. Reload it and review your input before retrying.';
            return 'The calendar operation failed. Check the connection and source file, then try again.';
        }
        const languageListeners = new Set();
        function useUILanguage() {
            const [, render] = useState(UI_LANG);
            useEffect(() => { const update = () => render(UI_LANG); languageListeners.add(update); update(); return () => languageListeners.delete(update); }, []);
        }
        /** 宿主 locale 服务：get('locale') 是正规读法，ctx.locale 兜旧宿主，都没有就是没有。 */
        function localeServiceOf(ctx) {
            try {
                if (typeof ctx.get === "function") {
                    const viaGet = ctx.get("locale");
                    if (viaGet !== undefined && viaGet !== null)
                        return viaGet;
                }
            }
            catch (e) { /* 落到下面那条路 */ }
            const direct = ctx.locale;
            return direct === undefined || direct === null ? null : direct;
        }
        function localeToLang(active) {
            const text = typeof active === "string" ? active.toLowerCase() : "";
            return text.indexOf("en") === 0 ? "en" : "zh";
        }
        /** 订阅语言切换；服务缺失或形状不同都只是留在 zh，绝不把面板拖垮。 */
        function subscribeLocale(ctx) {
            const service = localeServiceOf(ctx);
            activeLocaleService = service;
            if (service === null)
                return () => { };
            const apply = () => {
                try {
                    if (typeof service.getSnapshot === "function") {
                        UI_LANG = localeToLang(service.getSnapshot().active);
                    }
                }
                catch (e) {
                    UI_LANG = "zh";
                }
                if (typeof relocalize === "function") {
                    try {
                        relocalize();
                    }
                    catch (e) { /* 重绘失败不该断订阅链 */ }
                }
            };
            apply();
            try {
                if (typeof service.subscribe !== "function")
                    return () => { };
                const off = service.subscribe(apply);
                return typeof off === "function" ? off : () => { };
            }
            catch (e) {
                return () => { };
            }
        }
        /** 文案：{name} 形式的占位符按 params 替换，缺参时保留原样（宁可露出花括号也不吞字）。 */
        function t(key, params) {
            const dict = UI[UI_LANG] || UI.zh;
            let text = dict[key];
            if (text === undefined)
                text = (UI.zh[key] !== undefined ? UI.zh[key] : key);
            if (params === undefined)
                return text;
            return text.replace(/\{(\w+)\}/g, (whole, name) => Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole);
        }
        /** 调插件自己的路由；错误码原样带出，方便上层区分「没配置」与「服务器拒绝」。 */
        const API_TIMEOUT_MS = 15000;
        async function api(action, payload, signal) {
            const init = { credentials: "same-origin", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ action }, payload)) };
            // 请求必须有上限：挂起的 Promise 会让乐观覆盖一直盖着、撤销条永不出现，
            // 表现就是「界面改了、服务器没改」而用户以为成功。超时按失败处理（调用方会回滚并对账）。
            if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
                if (action === 'availability') init.signal = AbortSignal.timeout(25000);
                else init.signal = AbortSignal.timeout(API_TIMEOUT_MS);
            }
            if (signal) init.signal = init.signal && typeof AbortSignal.any === 'function' ? AbortSignal.any([init.signal, signal]) : signal;
            const res = await fetch(ROUTE, init);
            let body = null;
            try {
                body = await res.json();
            }
            catch (e) {
                body = null;
            }
            if (!res.ok || !body || body.ok !== true) {
                const message = body && body.error && body.error.message ? body.error.message : ("HTTP " + res.status);
                const error = new Error(message);
                error.status = res.status;
                error.code = body && body.error ? body.error.code : undefined;
                error.message = backendMessage(error);
                throw error;
            }
            return body.value;
        }
        // ───────────────────────────── 时间与格式 ─────────────────────────────
        /** 事件时间是「全天 = YYYY-MM-DD」或「定时 = UTC ISO」，两种都要能解析。 */
        function isDateOnly(value) { return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")); }
        function startDate(event) { return isDateOnly(event.start) ? new Date(event.start + "T00:00:00") : new Date(event.start); }
        function endDate(event) { return isDateOnly(event.end) ? new Date(event.end + "T00:00:00") : new Date(event.end); }
        function dayKey(date) {
            return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
        }
        function pad2(n) { return n < 10 ? "0" + n : String(n); }
        function hhmm(date) { return pad2(date.getHours()) + ":" + pad2(date.getMinutes()); }
        function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
        function addDays(date, n) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n); }
        function addMonths(date, n) { return new Date(date.getFullYear(), date.getMonth() + n, 1); }
        /** 周一为一周之首：JS 的 getDay() 里周日是 0，先掰成 1..7。 */
        function isoWeekday(date) { const d = date.getDay(); return d === 0 ? 7 : d; }
        function startOfWeek(date) { return addDays(startOfDay(date), -(isoWeekday(date) - 1)); }
        function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
        function formatDay(date, opts) {
            const withYear = opts && opts.withYear;
            if (UI_LANG === "en")
                return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
            return date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 " + date.getDate() + " 日" + (withYear ? "" : "");
        }
        function formatMonthTitle(date) { return UI_LANG === "en" ? date.toLocaleDateString("en-GB", { year: "numeric", month: "long" }) : date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月"; }
        function formatWeekTitle(date) {
            const from = startOfWeek(date), to = addDays(from, 6);
            if (UI_LANG === "en")
                return formatDay(from) + " – " + formatDay(to);
            return formatMonthTitle(from) + " " + from.getDate() + "–" + (to.getMonth() === from.getMonth() ? "" : (to.getMonth() + 1) + " 月 ") + to.getDate() + " 日";
        }
        function relativeDay(date) {
            const diff = daysBetween(new Date(), date);
            if (diff === 0)
                return t("day.today");
            if (diff === 1)
                return t("day.tomorrow");
            if (diff === -1)
                return t("day.yesterday");
            return UI_LANG === "en" ? date.toLocaleDateString("en-GB", { weekday: "short" }) : "周" + WEEKDAYS_ZH[isoWeekday(date) - 1];
        }
        function formatWhen(event) {
            if (event.allDay)
                return t("format.allday") + " · " + formatDay(startDate(event));
            const s = startDate(event), e = endDate(event);
            const sameDay = dayKey(s) === dayKey(e);
            return formatDay(s) + " " + hhmm(s) + "–" + (sameDay ? "" : formatDay(e) + " ") + hhmm(e);
        }
        function formatDuration(event) {
            if (event.allDay) {
                const days = Math.max(1, daysBetween(startDate(event), endDate(event)));
                return days === 1 ? t("format.allday") : days + (UI_LANG === "en" ? " days" : " 天");
            }
            const minutes = Math.max(0, Math.round((endDate(event) - startDate(event)) / 60000));
            const hours = Math.floor(minutes / 60), rest = minutes % 60;
            if (hours > 0 && rest > 0)
                return t("format.duration.hm", { h: hours, m: rest });
            if (hours > 0)
                return t("format.duration.h", { h: hours });
            if (rest > 0)
                return t("format.duration.m", { m: rest });
            return t("format.duration.zero");
        }
        /** RRULE 说人话：只翻译常见的 FREQ/INTERVAL/COUNT/UNTIL，认不出就原样返回。 */
        function humanRepeat(rrule) {
            if (!rrule)
                return "";
            const parts = {};
            String(rrule).split(";").forEach((piece) => {
                const i = piece.indexOf("=");
                if (i > 0)
                    parts[piece.slice(0, i).toUpperCase()] = piece.slice(i + 1);
            });
            const freq = parts.FREQ;
            if (UI_LANG === "en") {
                const units = { DAILY: ["Daily", "days"], WEEKLY: ["Weekly", "weeks"], MONTHLY: ["Monthly", "months"], YEARLY: ["Yearly", "years"] };
                if (!units[freq])
                    return rrule;
                const interval = Number(parts.INTERVAL || "1");
                const every = interval > 1 ? "Every " + interval + " " + units[freq][1] : units[freq][0];
                if (parts.COUNT)
                    return every + " (" + parts.COUNT + " occurrences)";
                if (parts.UNTIL) {
                    const raw = String(parts.UNTIL), date = raw.length >= 8 ? raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6, 8) : raw;
                    return every + ", until " + date;
                }
                return every;
            }
            const base = freq === "DAILY" ? "每天" : freq === "WEEKLY" ? "每周" : freq === "MONTHLY" ? "每月" : freq === "YEARLY" ? "每年" : "";
            if (base === "")
                return rrule;
            const interval = Number(parts.INTERVAL || "1");
            const every = interval > 1 ? "每 " + interval + (freq === "DAILY" ? " 天" : freq === "WEEKLY" ? " 周" : freq === "MONTHLY" ? " 个月" : " 年") : base;
            if (parts.COUNT)
                return every + "（共 " + parts.COUNT + " 次）";
            if (parts.UNTIL) {
                const raw = String(parts.UNTIL);
                const iso = raw.length >= 8 ? raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6, 8) : raw;
                return every + "，到 " + iso + " 为止";
            }
            return every;
        }
        /** 两个事件是否真的重叠（全天事件按当天整天算）。 */
        function overlaps(a, b) {
            if ([a,b].some(event=>event.status?.toUpperCase()==='CANCELLED'||event.transparency?.toUpperCase()==='TRANSPARENT')) return false;
            const as = startDate(a).getTime(), ae = endDate(a).getTime() || as;
            const bs = startDate(b).getTime(), be = endDate(b).getTime() || bs;
            return as < be && bs < ae;
        }
        /** 月视图的 6×7 网格起点：所在周的周一，往前补到整周。 */
        function monthGridDays(anchor) {
            const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
            const start = startOfWeek(first);
            const days = [];
            for (let i = 0; i < 42; i++)
                days.push(addDays(start, i));
            return days;
        }
        /** 一个事件落在哪几天（跨天事件在月视图里逐天显示）。 */
        function daysOfEvent(event) {
            const days = [];
            if (event.allDay) {
                const from = startDate(event);
                // 全天事件的 DTEND 是「次日零点」（iCal 语义），显示上要退一天。
                const to = addDays(endDate(event), -1);
                for (let d = startOfDay(from); d <= to; d = addDays(d, 1))
                    days.push(d);
                return days.length > 0 ? days : [from];
            }
            const from = startOfDay(startDate(event)), to = startOfDay(endDate(event));
            for (let d = from; d <= to; d = addDays(d, 1))
                days.push(d);
            return days;
        }
        /** 事件排序：全天在前，然后按开始时间。 */
        function sortForDisplay(events) {
            return events.slice().sort((a, b) => {
                if (a.allDay !== b.allDay)
                    return a.allDay ? -1 : 1;
                return startDate(a) - startDate(b);
            });
        }
        // ───────────────────────────── 宿主 UI 组件（可选） ─────────────────────────────
        /** 复制 uid：优先官方 writeClipboard（它处理了非 https 的降级），否则走 navigator。 */
        async function copyText(text) {
            try {
                if (PRIM && typeof PRIM.writeClipboard === "function") {
                    await PRIM.writeClipboard(text);
                    return true;
                }
            }
            catch (e) { /* 落到下面 */ }
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    return true;
                }
            }
            catch (e) { /* 忽略 */ }
            return false;
        }
        // ───────────────────────────── 拖拽/键盘改期的几何 ─────────────────────────────
        // 这一组是本轮唯一的「算法」：拖动、缩放手柄、键盘微调都走它们。它们不碰 DOM、不认 React，
        // 所以跨天/跨月/DST/吸附边界这些真正容易错的地方能被单测直接盯住（见 test/schedule.test.mjs）。
        /** 全天事件与定时事件共用一个「槽位」概念：某天 + 当天第几分钟 + 时长。 */
        const SNAP_MINUTES = 15;
        const RESIZE_MIN_MINUTES = 15;
        function snapMinutes(value, step) {
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            return Math.round(value / unit) * unit;
        }
        /** 事件 → 槽位（按浏览器本地墙钟，显示与拖拽都以用户看到的为准）。 */
        function slotFromEvent(event) {
            const start = startDate(event);
            const end = endDate(event);
            const minutes = start.getHours() * 60 + start.getMinutes();
            const durationMinutes = Math.max(RESIZE_MIN_MINUTES, Math.round((end - start) / 60000));
            return { dayKey: dayKey(start), minutes, durationMinutes, allDay: event.allDay === true };
        }
        /**
         * 槽位 + 位移 → 新槽位。
         * 位移以「天 + 分钟」给（拖动时由像素换算），跨天/跨月/跨年都靠时间戳自然进位，
         * 最后把开始时间吸附到 15 分钟并钳在当天 00:00 与「当天结束前还放得下整个时长」之间。
         */
        function moveSlot(slot, deltaDays, deltaMinutes, step) {
            // 分钟先合成「当天内 + 跨几天」，再用日历日相加 —— 不能用「天 × 1440 毫秒」当瞬时位移：
            // DST 切换日一天是 23 或 25 小时，按毫秒加会整体偏一小时（评审查出来的，中国时区看不见）。
            const total = slot.minutes + (deltaMinutes || 0);
            const dayShift = Math.floor(total / 1440);
            const minutes = total - dayShift * 1440;
            const base = new Date(slot.dayKey + "T00:00:00");
            const target = addDays(base, (deltaDays || 0) + dayShift);
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            // 日末钳制也要落在网格上：1440 − 时长不保证是 15 的倍数（50 分钟 → 23:10 这种脏值）。
            const latestStart = Math.max(0, Math.floor((24 * 60 - slot.durationMinutes) / unit) * unit);
            const snapped = Math.max(0, Math.min(snapMinutes(minutes, unit), latestStart));
            return { dayKey: dayKey(target), minutes: snapped, durationMinutes: slot.durationMinutes, allDay: slot.allDay };
        }
        /** 拖拽像素位移 → 槽位位移（横向一格 = 一天，纵向按小时像素换算成分钟）。 */
        function slotFromDrag(slot, drag, step) {
            const hourPx = typeof drag.hourPx === "number" && drag.hourPx > 0 ? drag.hourPx : 44;
            const columns = Math.round(drag.columns || 0);
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            const rawMinutes = ((drag.pixelsY || 0) / hourPx) * 60;
            const deltaMinutes = Math.round(rawMinutes / unit) * unit;
            return moveSlot(slot, columns, deltaMinutes, unit);
        }
        /** 缩放手柄：只改时长，不改开始时间（最短 15 分钟，最长到当天结束）。 */
        function resizeSlot(slot, deltaMinutes, step) {
            const unit = typeof step === "number" && step > 0 ? step : SNAP_MINUTES;
            // 只吸附**位移量**：50 分钟的日程碰一下手柄（位移 0）不该被吸成 45。
            // 上限就是 24 小时 —— 允许拖过午夜（此前按「当天还剩多少」压缩，23:30–00:30 一碰就变 30 分钟）。
            const next = slot.durationMinutes + snapMinutes(deltaMinutes || 0, unit);
            return { dayKey: slot.dayKey, minutes: slot.minutes, durationMinutes: Math.max(RESIZE_MIN_MINUTES, Math.min(next, 24 * 60)), allDay: slot.allDay };
        }
        /** 槽位 → 提交给服务器的 start/end（本地墙钟换算成 UTC 秒级 ISO）。 */
        function rangeOfSlot(slot) {
            const start = new Date(slot.dayKey + "T00:00:00");
            start.setMinutes(slot.minutes);
            const end = new Date(start.getTime() + slot.durationMinutes * 60000);
            return { start: isoOf(start), end: isoOf(end) };
        }
        /** 落点与哪些已有日程重叠（拖动中用来把幽灵块描成黄色）。 */
        function conflictsForSlot(events, slot, uid) {
            const range = rangeOfSlot(slot);
            const pseudo = { uid: "__drag", summary: "", start: range.start, end: range.end, allDay: slot.allDay === true };
            return events.filter((event) => event.uid !== uid && overlaps(event, pseudo));
        }
        /**
         * 指针 x（视口坐标）→ 列号。坐标必须来自 getBoundingClientRect ——
         * offsetLeft 是相对 offsetParent 的，浮层面板里与 clientX 不是一个坐标系（评审抓到的坑）。
         * 找不到列就返回 undefined，调用方按「不换天」处理。
         */
        function columnIndexFromRects(clientX, rects) {
            for (const rect of rects) {
                if (clientX >= rect.left && clientX < rect.left + rect.width)
                    return rect.index;
            }
            return undefined;
        }
        /** 重复日程（系列本身 or 某次实例）：CalDAV 里整个系列是一个对象，拖动会改整条。 */
        function isRecurring(event) {
            return event.rrule !== undefined || event.isOccurrence === true || event.seriesStart !== undefined;
        }
        // ───────────────────────────── 小部件 ─────────────────────────────
        /** 事件属于哪一类：影响左侧色条（全天绿 / 重复黄 / 普通蓝）。 */
        function eventClass(event) {
            return event.allDay ? styles.allday : isRecurring(event) ? styles.recurring : undefined;
        }
        function eventKey(event) {
            return event.uid + "@" + event.start;
        }
        function Chip(props) {
            const { event, onClick, conflicted } = props;
            return h("button", {
                type: "button",
                className: clsx(styles["dshc-chip"], eventClass(event), conflicted && styles.conflicted),
                title: event.summary,
                onClick: (e) => { e.stopPropagation(); onClick(event); }
            },
                event.allDay ? null : h("span", { className: "t" }, hhmm(startDate(event))),
                h("span", null, event.summary)
            );
        }
        /** 议程里的一行：时间列 + 标题/地点 + 重复角标。 */
        function Row(props) {
            const { event, onClick, conflicted } = props;
            const meta = [];
            if (event.location)
                meta.push(event.location);
            if (event.rrule)
                meta.push(humanRepeat(event.rrule));
            else if (event.isOccurrence)
                meta.push(t("repeat.occurrence"));
            return h("button", {
                type: "button", className: clsx(styles["dshc-row"], conflicted && styles.conflicted), onClick: () => onClick(event)
            },
                h("span", { className: styles["dshc-time"] }, event.allDay ? t("format.allday") : (hhmm(startDate(event)) + "–" + hhmm(endDate(event)))),
                h("span", { className: styles["dshc-main"] },
                    h("span", { className: styles["dshc-name"] }, event.summary),
                    meta.length > 0 ? h("span", { className: styles["dshc-meta"] }, meta.join(" · ")) : null
                )
            );
        }
        /** 月视图：6×7 网格；每格最多 3 条，多的收成「+N」。 */
        function MonthView(props) {
            const { anchor, events, onPick, onCreateAt, conflicted } = props;
            const days = monthGridDays(anchor);
            const today = dayKey(new Date());
            const byDay = {};
            for (const event of events) {
                for (const day of daysOfEvent(event)) {
                    const key = dayKey(day);
                    if (!byDay[key])
                        byDay[key] = [];
                    byDay[key].push(event);
                }
            }
            const cells = [];
            for (const day of days) {
                const key = dayKey(day);
                const list = sortForDisplay(byDay[key] || []);
                const shown = list.slice(0, 3);
                const rest = list.length - shown.length;
                // 格子必须是 div 而不是 button：里面的日程芯片本身是按钮，而按钮不能嵌套按钮 ——
                // 嵌套时浏览器会把外层按钮提前闭合，芯片就被挤到网格外面去了（真被用户抓到过）。
                cells.push(h("div", {
                    key: key,
                    role: "button",
                    tabIndex: 0,
                    className: clsx(styles["dshc-cell"], day.getMonth() !== anchor.getMonth() && styles.out, key === today && "today"),
                    // 读屏只会念出格子里的日期数字，不说这一格是干什么的；补上「哪天 + 新建」的完整名字。
                    "aria-label": formatDay(day, { withYear: true }) + " · " + t("action.new"),
                    "aria-current": key === today ? "date" : undefined,
                    onClick: () => onCreateAt(day),
                    onKeyDown: (e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onCreateAt(day);
                    } },
                    title: t("action.new")
                },
                    h("div", { className: styles["dshc-daynum"] }, h("b", null, day.getDate())),
                    shown.map((event) => h(Chip, { key: eventKey(event), event, onClick: onPick, conflicted: conflicted?.has(event) })),
                    rest > 0 ? h("div", { className: styles["dshc-more"] }, "+" + rest) : null
                ));
            }
            return h("div", null,
                h("div", { className: styles["dshc-grid"] }, WEEKDAYS_ZH.map((d, i) => h("div", { className: styles["dshc-dow"], key: d }, weekDayLabel(i)))),
                h("div", { className: styles["dshc-grid"] }, cells)
            );
        }
        /**
         * 周视图：7 列 × 24 小时网格。除了画日程，它还负责改期：
         *   · 拖动事件块：上下改时间、左右换天（15 分钟吸附）；
         *   · 拖块底部 6px 的缩放手柄：只改时长；
         *   · 拖动中画幽灵落点，与已有日程重叠时描成黄色（允许重叠，只是提醒）；
         *   · 拖到容器上下边缘自动滚动，长会议不用先滚再拖；
         *   · 键盘：Tab 聚焦后 ↑/↓ 挪 15 分钟、Shift+↑/↓ 挪 1 小时、←/→ 挪一天、Enter 打开详情、拖动中 Esc 取消。
         * 几何计算全在纯函数里（slotFromDrag / resizeSlot / moveSlot / columnIndexFromRects），这里只做指针与 DOM 的事。
         *
         * 两个坑写在这里免得后人再踩：
         *   1. 列判定必须用 getBoundingClientRect：offsetLeft 是相对 offsetParent 的，浮层面板里与 clientX 不同坐标系；
         *   2. window 监听器只在挂载时注册一次，通过 impl ref 调用「最新实现」；
         *      按渲染闭包挂/摘会出现「摘不掉 → 卸载后 pointerup 替用户提交一次改期」。
         */
        function WeekView(props) {
            const { anchor, events, onPick, onCreateAt, onReschedule, conflicted } = props;
            /** 示例模式下没有 onReschedule：不做改期，也不显示拖拽提示。 */
            const canEdit = typeof onReschedule === "function";
            const HOUR_PX = 44;
            const start = startOfWeek(anchor);
            const days = [];
            for (let i = 0; i < 7; i++)
                days.push(addDays(start, i));
            const today = dayKey(new Date());
            const allDay = sortForDisplay(events.filter((e) => e.allDay));
            const timed = events.filter((e) => !e.allDay);
            // 默认落在 07:00：半夜那几格基本没人看，但需要时还能往上滚（不裁剪任何事件）。
            const scroller = useRef(null);
            useEffect(() => {
                const node = scroller.current;
                if (node === null || node === undefined)
                    return;
                node.scrollTop = 7 * HOUR_PX;
            }, [dayKey(anchor)]);
            /** 拖拽位置放 ref：每帧 setState 会让整棵树重渲染，拖动会顿。 */
            const dragRef = useRef(null);
            const suppressClick = useRef(false);
            const [ghost, setGhost] = useState(null);
            /** 每列的**视口**矩形（见文件头注释第 1 条）。 */
            const columnRects = () => {
                const node = scroller.current;
                if (node === null || node === undefined)
                    return [];
                return days.map((day, index) => {
                    const column = node.querySelector('[data-day="' + dayKey(day) + '"]');
                    if (column === null)
                        return { dayKey: dayKey(day), index, left: 0, width: 0 };
                    const rect = column.getBoundingClientRect();
                    return { dayKey: dayKey(day), index, left: rect.left, width: rect.width };
                });
            };
            const scrollTopNow = () => {
                const node = scroller.current;
                return node === null || node === undefined ? 0 : node.scrollTop;
            };
            const isOwnPointer = (pointerEvent) => {
                const drag = dragRef.current;
                if (drag === null)
                    return false;
                return pointerEvent.pointerId === undefined || drag.pointerId === undefined || pointerEvent.pointerId === drag.pointerId;
            };
            const stopDrag = (commit) => {
                stopAutoScroll();
                const drag = dragRef.current;
                dragRef.current = null;
                setGhost(null);
                if (drag === null)
                    return;
                const moved = drag.moved === true;
                if (moved === true) {
                    // 拖动之后浏览器通常会补一个 click，用它把「抑制」消费掉；
                    // 但如果松手在空白处（没有 click），下个事件循环必须清掉 —— 否则会吞掉将来某次正常点击。
                    suppressClick.current = true;
                    setTimeout(() => { suppressClick.current = false; }, 0);
                }
                if (commit !== false && moved === true && canEdit === true) {
                    const slot = drag.previewSlot === undefined ? drag.slot : drag.previewSlot;
                    // 没有落点就不提交：比如纵向拖出本周（跨到下周）时幽灵没地方画，这时盲提交会让事件从视图消失。
                    // 用 dragRef 上的同步标记，而不是 React state（见 applyPreviewAt 的注释）。
                    if (drag.previewVisible === true)
                        onReschedule(drag.event, rangeOfSlot(slot), drag.mode);
                }
            };
            /** 由指针位置算落点、画幽灵（只管几何，不碰边缘滚动的调度）。 */
            const applyPreviewAt = (clientX, clientY, drag) => {
                // 容器自己滚动过的话，指针下方的**内容**坐标变了：不补这一项，幽灵块会落后于指针，
                // 松手落点也跟着偏（误差 = 滚动量，可达数小时）。
                const scrolled = scrollTopNow() - drag.startScrollTop;
                const dx = clientX - drag.startX;
                const dy = clientY - drag.startY + scrolled;
                if (drag.moved !== true && Math.abs(dx) < 5 && Math.abs(dy) < 5)
                    return;
                drag.moved = true;
                const ownIndex = drag.columns.findIndex((column) => column.dayKey === drag.slot.dayKey);
                const targetIndex = columnIndexFromRects(clientX, drag.columns);
                // 横向只允许在本周 7 天内换天：跨到下周会让幽灵无处渲染、事件从当前视图消失。
                const rawColumns = targetIndex === undefined || ownIndex === -1 ? 0 : targetIndex - ownIndex;
                const columns = ownIndex === -1 ? 0 : Math.max(-ownIndex, Math.min(6 - ownIndex, rawColumns));
                const slot = drag.mode === "resize"
                    ? resizeSlot(drag.slot, (dy / HOUR_PX) * 60, SNAP_MINUTES)
                    : slotFromDrag(drag.slot, { columns, pixelsY: dy, hourPx: HOUR_PX }, SNAP_MINUTES);
                drag.previewSlot = slot;
                // 可见性判断必须同步落在 dragRef 上：pointermove 与 pointerup 可能在同一批次里，
                // 此时读 React state（ghost）拿到的是旧值，会导致「拖了却不提交」。
                drag.previewVisible = days.some((day) => dayKey(day) === slot.dayKey);
                setGhost({ uid: drag.uid, slot, conflicts: conflictsForSlot(events, slot, drag.uid).length });
            };
            /**
             * 边缘自动滚动：用 rAF 持续滚，而不是「每次 pointermove 滚一小步」。
             * 前者指针停在边缘不动也会继续滚（这才是「长会议不用先滚再拖」），
             * 后者只在指针移动时滚，用户会觉得网格在滚、事件却不跟手。
             */
            const autoScroll = useRef({ raf: 0, x: 0, y: 0 });
            const stopAutoScroll = () => {
                if (autoScroll.current.raf !== 0) {
                    window.cancelAnimationFrame(autoScroll.current.raf);
                    autoScroll.current.raf = 0;
                }
            };
            const stepAutoScroll = () => {
                autoScroll.current.raf = 0;
                const drag = dragRef.current;
                const node = scroller.current;
                if (drag === null || node === null || node === undefined)
                    return;
                const rect = node.getBoundingClientRect();
                const y = autoScroll.current.y;
                let delta = 0;
                if (y < rect.top + 40)
                    delta = -Math.min(24, (rect.top + 40 - y) / 3);
                else if (y > rect.bottom - 40)
                    delta = Math.min(24, (y - (rect.bottom - 40)) / 3);
                if (delta === 0)
                    return; // 指针离开边缘：循环自然停下，下次移动会再起
                node.scrollTop += delta;
                applyPreviewAt(autoScroll.current.x, y, drag); // 滚动后重算落点（含滚动补偿）
                autoScroll.current.raf = window.requestAnimationFrame(stepAutoScroll);
            };
            const ensureAutoScroll = (pointerEvent) => {
                autoScroll.current.x = pointerEvent.clientX;
                autoScroll.current.y = pointerEvent.clientY;
                const node = scroller.current;
                if (node === null || node === undefined)
                    return;
                const rect = node.getBoundingClientRect();
                const nearEdge = pointerEvent.clientY < rect.top + 40 || pointerEvent.clientY > rect.bottom - 40;
                if (nearEdge === true && autoScroll.current.raf === 0)
                    autoScroll.current.raf = window.requestAnimationFrame(stepAutoScroll);
            };
            const updatePreview = (pointerEvent) => {
                const drag = dragRef.current;
                if (drag === null)
                    return;
                // 鼠标在窗口外松开时浏览器可能不派发 pointerup：按键已经松了就当作取消，
                // 免得「卡住的拖拽」在回到窗口后被下一次移动继续更新、下一次松开就替用户提交。
                if (drag.moved === true && pointerEvent.buttons === 0) {
                    stopDrag(false);
                    return;
                }
                applyPreviewAt(pointerEvent.clientX, pointerEvent.clientY, drag);
                ensureAutoScroll(pointerEvent);
            };
            /**
             * window 监听器只在挂载时注册一次，通过 impl ref 调「最新实现」。
             * 这样既不会因为渲染闭包更换而摘不掉（那会导致卸载后 pointerup 真的发一次 update），
             * 也不会读到过期的 state。
             */
            const impl = useRef({});
            impl.current = { stopDrag, updatePreview, isOwnPointer };
            useEffect(() => {
                const onMove = (pointerEvent) => { if (dragRef.current !== null && impl.current.isOwnPointer(pointerEvent) === true)
                    impl.current.updatePreview(pointerEvent); };
                const onUp = (pointerEvent) => { if (dragRef.current !== null && impl.current.isOwnPointer(pointerEvent) === true)
                    impl.current.stopDrag(true); };
                const onCancel = () => { if (dragRef.current !== null)
                    impl.current.stopDrag(false); };
                const onKey = (keyEvent) => { if (keyEvent.key === "Escape" && dragRef.current !== null) {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    impl.current.stopDrag(false);
                } };
                const onBlur = () => { if (dragRef.current !== null)
                    impl.current.stopDrag(false); };
                window.addEventListener("pointermove", onMove);
                window.addEventListener("pointerup", onUp);
                window.addEventListener("pointercancel", onCancel);
                // 捕获阶段：保证「取消拖动」先于浮层面板的 document Esc（否则会顺手把面板也关了）。
                window.addEventListener("keydown", onKey, true);
                window.addEventListener("blur", onBlur);
                return () => {
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("pointerup", onUp);
                    window.removeEventListener("pointercancel", onCancel);
                    window.removeEventListener("keydown", onKey, true);
                    if (autoScroll.current.raf !== 0) {
                        window.cancelAnimationFrame(autoScroll.current.raf);
                        autoScroll.current.raf = 0;
                    }
                    window.removeEventListener("blur", onBlur);
                    dragRef.current = null; // 卸载时不能留着半截拖拽状态
                };
            }, []);
            const beginDrag = (event, pointerEvent, mode) => {
                if (canEdit !== true)
                    return; // 示例模式：不落盘就不给拖
                if (pointerEvent.button !== undefined && pointerEvent.button !== 0)
                    return;
                if (dragRef.current !== null)
                    return; // 已经有一根指针在拖，忽略第二根
                suppressClick.current = false;
                try {
                    if (typeof pointerEvent.currentTarget.setPointerCapture === "function")
                        pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
                }
                catch (error) { /* 不支持就算了，window 监听器兜底 */ }
                dragRef.current = {
                    uid: event.uid,
                    event,
                    pointerId: pointerEvent.pointerId,
                    mode: mode === "resize" ? "resize" : "move",
                    slot: slotFromEvent(event),
                    startX: pointerEvent.clientX,
                    startY: pointerEvent.clientY,
                    startScrollTop: scrollTopNow(),
                    moved: false,
                    columns: columnRects(),
                };
            };
            /** 键盘改期：与拖拽走同一套纯函数，所以行为一致（且不用鼠标也能用）。 */
            const onKeyDown = (event, keyEvent) => {
                if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                    keyEvent.preventDefault();
                    onPick(event);
                    return;
                }
                if (canEdit !== true)
                    return;
                const slot = slotFromEvent(event);
                let deltaDays = 0;
                let deltaMinutes = 0;
                if (keyEvent.key === "ArrowUp")
                    deltaMinutes = keyEvent.shiftKey ? -60 : -SNAP_MINUTES;
                else if (keyEvent.key === "ArrowDown")
                    deltaMinutes = keyEvent.shiftKey ? 60 : SNAP_MINUTES;
                else if (keyEvent.key === "ArrowLeft")
                    deltaDays = -1;
                else if (keyEvent.key === "ArrowRight")
                    deltaDays = 1;
                else
                    return;
                keyEvent.preventDefault();
                onReschedule(event, rangeOfSlot(moveSlot(slot, deltaDays, deltaMinutes, SNAP_MINUTES)), "move");
            };
            const hoursColumn = h("div", { key: "__hours" }, [h("div", { className: styles["dshc-dayhead"], key: "h" }, "\u00a0")].concat(Array.from({ length: 24 }, (_, hour) => h("div", { className: styles["dshc-hour"], key: "h" + hour }, hour === 0 ? "" : pad2(hour) + ":00"))));
            const dayColumns = days.map((day) => {
                const key = dayKey(day);
                const dayTimed = timed.filter((event) => daysOfEvent(event).some((d) => dayKey(d) === key));
                const laneEnds = [];
                const placed = dayTimed.slice().sort((a, b) => startDate(a) - startDate(b)).map((event) => {
                    const from = startDate(event), to = endDate(event);
                    let lane = laneEnds.findIndex((endMs) => endMs <= from.getTime());
                    if (lane === -1) {
                        lane = laneEnds.length;
                        laneEnds.push(0);
                    }
                    laneEnds[lane] = to.getTime();
                    return { event, lane };
                });
                const laneCount = Math.max(1, laneEnds.length);
                const laneStyle = (lane) => ({ left: "calc(" + (lane * (100 / laneCount)) + "% + 2px)", width: "calc(" + (100 / laneCount) + "% - 4px)" });
                const blocks = placed.map(({ event, lane }) => {
                    const from = startDate(event), to = endDate(event);
                    const top = (from.getHours() * 60 + from.getMinutes()) * (HOUR_PX / 60);
                    const height = Math.max(18, ((to - from) / 60000) * (HOUR_PX / 60));
                    const dragging = ghost !== null && ghost.uid === event.uid;
                    return h("div", {
                        key: eventKey(event),
                        role: "button",
                        tabIndex: 0,
                        "data-uid": event.uid,
                        className: clsx(styles["dshc-slot"], eventClass(event), canEdit && styles.movable, dragging && styles.dragging, conflicted?.has(event) && styles.conflicted),
                        style: Object.assign({ top: top + "px", height: height + "px" }, laneStyle(lane)),
                        title: event.summary + " " + hhmm(from) + "\u2013" + hhmm(to) + (canEdit === true ? " · " + t("drag.moveTitle") : ""),
                        onPointerDown: (e) => beginDrag(event, e, "move"),
                        onKeyDown: (e) => onKeyDown(event, e),
                        onClick: (clickEvent) => {
                            // slot 是 daycol 的子节点：不挡住冒泡的话，点事件会同时触发 daycol 的「新建」。
                            clickEvent.stopPropagation();
                            if (suppressClick.current === true) {
                                suppressClick.current = false;
                                return;
                            }
                            onPick(event);
                        }
                    }, h("div", { className: styles["dshc-slot-title"] }, event.summary), h("div", { className: styles["dshc-slot-time"] }, hhmm(from) + "\u2013" + hhmm(to)), canEdit === true ? h("div", { className: styles["dshc-resize"], title: t("drag.resizeTitle"), onPointerDown: (e) => { e.stopPropagation(); beginDrag(event, e, "resize"); } }) : null);
                });
                const ghostBlock = ghost !== null && ghost.slot.dayKey === key
                    ? h("div", {
                        className: clsx(styles["dshc-slot"], styles["dshc-ghost"], ghost.conflicts > 0 && styles.warn),
                        style: Object.assign({ top: (ghost.slot.minutes * (HOUR_PX / 60)) + "px", height: Math.max(18, ghost.slot.durationMinutes * (HOUR_PX / 60)) + "px" }, laneStyle(0)),
                        key: "__ghost"
                    }, h("div", { className: styles["dshc-slot-title"] }, ghost.conflicts > 0 ? t("drag.conflict", { n: ghost.conflicts }) + " · " + t("drag.keep") : t("drag.drop")), h("div", { className: styles["dshc-slot-time"] }, pad2(Math.floor(ghost.slot.minutes / 60)) + ":" + pad2(ghost.slot.minutes % 60) + " \u2192 " + pad2(Math.floor((ghost.slot.minutes + ghost.slot.durationMinutes) / 60)) + ":" + pad2((ghost.slot.minutes + ghost.slot.durationMinutes) % 60)))
                    : null;
                const hourSlots = Array.from({ length: 24 }, (_, hour) => h("button", {
                    key: hour, type: "button", className: styles.hourSlot, "data-hour": hour,
                    "aria-label": formatDay(day, { withYear: true }) + " " + pad2(hour) + ":00 · " + t("action.new"),
                    tabIndex: hour === 7 ? 0 : -1,
                    onClick: () => {
                        if (suppressClick.current) { suppressClick.current = false; return; }
                        onCreateAt(day, hour);
                    },
                    onKeyDown: event => {
                        const change = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
                        if (change === 0) return;
                        event.preventDefault();
                        event.currentTarget.parentElement.querySelector('[data-hour="' + (hour + change) + '"]')?.focus();
                    }
                }));
                return h("div", { key },
                    h("div", { className: clsx(styles["dshc-dayhead"], key === today && "today"), "aria-current": key === today ? "date" : undefined },
                        weekDayLabel(isoWeekday(day) - 1), h("b", null, day.getDate())
                    ),
                    h("div", {
                        className: clsx(styles["dshc-daycol"], key === today && "today"), "data-day": key,
                        onClick: clickEvent => {
                            if (clickEvent.target !== clickEvent.currentTarget)
                                return;
                            if (suppressClick.current) { suppressClick.current = false; return; }
                            onCreateAt(day);
                        }
                    }, hourSlots, blocks, ghostBlock)
                );
            });
            return h("div", { className: styles.weekView }, allDay.length > 0
                ? h("div", { className: styles.allDayList }, allDay.map((event) => h(Row, { key: eventKey(event), event, onClick: onPick, conflicted: conflicted?.has(event) })))
                : null, h("div", { className: "dshc-week", ref: scroller }, hoursColumn, dayColumns), canEdit === true ? h("div", { className: styles["dshc-draghint"] }, t("drag.hint")) : null);
        }
        /** 议程视图：从今天起按天分组，最像「接下来要干什么」。 */
        function AgendaView(props) {
            const { events, onPick, onCreateAt, conflicted } = props;
            const groups = [];
            const index = {};
            for (const event of sortForDisplay(events)) {
                const day = startOfDay(startDate(event));
                const key = dayKey(day);
                if (index[key] === undefined) {
                    index[key] = groups.length;
                    groups.push({ day, key, items: [] });
                }
                groups[index[key]].items.push(event);
            }
            if (groups.length === 0)
                return h(EmptyState, { title: t("state.empty"), action: h(Btn, { icon: "plus", variant: "primary", onClick: () => onCreateAt(new Date()) }, t("action.new")) });
            return h("div", { className: styles["dshc-agenda"] }, groups.map((group) => h("div", { className: styles["dshc-daygroup"], key: group.key },
                h("div", { className: styles["dshc-daylabel"] },
                    h("b", null, formatDay(group.day)),
                    h("span", { className: styles["dshc-sub"] }, relativeDay(group.day)),
                    h("span", { className: styles["dshc-spacer"] }),
                    h(Btn, { variant: "ghost", onClick: () => onCreateAt(group.day) }, t("action.new"))
                ),
                group.items.map((event) => h(Row, { key: eventKey(event), event, onClick: onPick, conflicted: conflicted?.has(event) }))
            )));
        }
        // ───────────────────────────── 数据 ─────────────────────────────
        /** 去掉毫秒：后端的 assertIsoTime 只认秒级 ISO，浏览器 toISOString 带 .000Z。 */
        function isoOf(date) { return date.toISOString().replace(/\.\d{3}Z$/, "Z"); }
        function rangeOf(view, anchor) {
            if (view === "week") {
                const from = startOfWeek(anchor);
                return { start: isoOf(from), end: isoOf(addDays(from, 7)) };
            }
            if (view === "agenda") {
                const from = startOfDay(new Date());
                return { start: isoOf(from), end: isoOf(addDays(from, 30)) };
            }
            const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
            const from = startOfWeek(first);
            return { start: isoOf(from), end: isoOf(addDays(from, 42)) };
        }
        /** 示例数据：只在「没配置」或用户主动点「查看示例」时用，不冒充真实日历。 */
        function demoEvents() {
            const base = startOfDay(new Date());
            const at = (offset, hour, minute) => { const d = addDays(base, offset); d.setHours(hour, minute || 0, 0, 0); return isoOf(d); };
            const dateOnly = (offset) => { const d = addDays(base, offset); return dayKey(d); };
            return [
                { uid: "demo://allday", summary: "📦 项目上线日", start: dateOnly(0), end: dateOnly(1), allDay: true, description: "确认发布说明并完成上线检查", location: "线上", isOccurrence: false },
                { uid: "demo://review", summary: "产品评审会", start: at(0, 10, 0), end: at(0, 11, 0), allDay: false, location: "会议室 A", description: "议程：体验反馈与本周计划", isOccurrence: false },
                { uid: "demo://one-on-one", summary: "1:1 同步", start: at(0, 15, 0), end: at(0, 15, 30), allDay: false, location: "线上", isOccurrence: false },
                { uid: "demo://standup", summary: "每周站会", start: at(1, 9, 30), end: at(1, 9, 50), allDay: false, rrule: "FREQ=WEEKLY;COUNT=6", location: "线上", isOccurrence: false },
                { uid: "demo://standup@2", summary: "每周站会", start: at(8, 9, 30), end: at(8, 9, 50), allDay: false, location: "线上", isOccurrence: true, seriesStart: at(1, 9, 30) },
                { uid: "demo://sync", summary: "与同事同步", start: at(2, 16, 0), end: at(2, 16, 30), allDay: false, location: "线上", description: "同步进度与下一步安排", isOccurrence: false }
            ];
        }
        /** 拉一个时间窗的事件；demo 为真时用示例数据，不打网络。 */
        function useCalendarData(range, reloadToken, demo) {
            const [state, setState] = useState({ loading: true, error: null, events: [], configured: true });
            useEffect(() => {
                if (demo === true) {
                    setState({ loading: false, error: null, events: demoEvents(), configured: true });
                    return () => { };
                }
                let alive = true;
                setState((prev) => ({ loading: true, error: null, events: prev.events, configured: prev.configured }));
                api("list", { start: range.start, end: range.end, expand: true, maxOccurrences: 300 })
                    .then((value) => { if (alive)
                    setState({ loading: false, error: null, events: (value && value.events) || [], configured: true }); })
                    .catch((error) => { if (alive)
                    setState({ loading: false, error, events: [], configured: error && error.code !== "not-configured" }); });
                return () => { alive = false; };
            }, [range.start, range.end, reloadToken, demo]);
            return state;
        }
        // ───────────────────────────── 表单 ─────────────────────────────
        /** 事件 → 表单草稿（日期与时间都按浏览器本地时区拆开给 datetime-local 用）。 */
        function draftOfEvent(event) {
            const allDay = event.allDay === true;
            const s = startDate(event);
            const rawEnd = endDate(event);
            // 全天事件的 DTEND 是「次日零点」：编辑时退一天，否则用户会看到莫名多一天。
            const e = allDay ? addDays(rawEnd, -1) : rawEnd;
            const draft = {
                uid: event.uid,
                isSeries: isRecurring(event),
                summary: event.summary || "",
                date: dayKey(s),
                startTime: pad2(s.getHours()) + ":" + pad2(s.getMinutes()),
                endTime: pad2(e.getHours()) + ":" + pad2(e.getMinutes()),
                allDay,
                location: event.location || "",
                description: event.description || "",
                repeat: repeatKeyOf(event.rrule),
                rrule: event.rrule || ""
            };
            if (!allDay) draft.sourceRange = { date: draft.date, startTime: draft.startTime, endTime: draft.endTime, start: isoOf(s), end: isoOf(rawEnd) };
            return draft;
        }
        /** 新建表单：默认落在被点的那一天，上午 10:00–11:00（日历产品的惯例）。 */
        function draftAt(date, hour) {
            const d = date || new Date();
            if (typeof hour === "number") {
                const start = startOfDay(d);
                start.setHours(hour);
                return draftOfEvent({ start: isoOf(start), end: isoOf(new Date(+start + 3600000)), allDay: false });
            }
            return {
                uid: undefined,
                summary: "",
                date: dayKey(d),
                startTime: "10:00",
                endTime: "11:00",
                allDay: false,
                location: "",
                description: "",
                repeat: "",
                rrule: ""
            };
        }
        function repeatKeyOf(rrule) {
            if (!rrule)
                return "";
            const freq = /FREQ=([A-Z]+)/i.exec(rrule);
            if (!freq)
                return "custom";
            const value = freq[1].toUpperCase();
            const simple = rrule.replace(/FREQ=[A-Z]+;?/i, "").replace(/^;|;$/g, "");
            if (simple !== "")
                return "custom";
            if (value === "DAILY")
                return "daily";
            if (value === "WEEKLY")
                return "weekly";
            if (value === "MONTHLY")
                return "monthly";
            if (value === "YEARLY")
                return "yearly";
            return "custom";
        }
        function rruleForRepeat(repeat) {
            if (repeat === "daily")
                return "FREQ=DAILY";
            if (repeat === "weekly")
                return "FREQ=WEEKLY";
            if (repeat === "monthly")
                return "FREQ=MONTHLY";
            if (repeat === "yearly")
                return "FREQ=YEARLY";
            return "";
        }
        /** 草稿 → 后端字段（全天走 DATE，定时走本地时间换算出的 UTC 秒级 ISO）。 */
        function fieldsOfDraft(draft) {
            const fields = { summary: draft.summary.trim(), location: draft.location.trim(), description: draft.description.trim(), ...(draft.isSeries ? { scope: "series" } : {}) };
            if (draft.allDay === true) {
                fields.start = draft.date;
                fields.end = dayKey(addDays(new Date(draft.date + "T00:00:00"), 1));
                fields.allDay = true;
            }
            else {
                if (!/^\d{2}:\d{2}$/.test(draft.startTime || '') || !/^\d{2}:\d{2}$/.test(draft.endTime || '')) throw new Error(calendarText('请补全起止时间','Complete the start and end times'));
                const start = new Date(draft.date + "T" + (draft.startTime || "00:00") + ":00");
                const end = new Date(draft.date + "T" + (draft.endTime || "00:00") + ":00");
                const source = draft.sourceRange, sameDate = source && source.date === draft.date;
                fields.start = sameDate && source.startTime === draft.startTime ? source.start : isoOf(start);
                fields.end = sameDate && source.endTime === draft.endTime ? source.end : isoOf(end);
                fields.allDay = false;
            }
            const rrule = draft.repeat === "custom" ? (draft.rrule || "").trim() : rruleForRepeat(draft.repeat);
            if (rrule !== "")
                fields.rrule = rrule;
            else if (draft.uid !== undefined)
                fields.rrule = "";
            return fields;
        }
        /** 草稿算出来的临时事件，用来做冲突检测（不落盘）。 */
        function asPseudoEvent(draft) {
            try {
                const fields = fieldsOfDraft(draft);
                return { uid: "__draft", summary: fields.summary || "(未命名)", start: fields.start, end: fields.end, allDay: draft.allDay === true };
            } catch { return null; }
        }
        // ───────────────────────────── 连接设置 ─────────────────────────────
        /** 每个服务商要填哪些格子。顺序就是表单里的顺序。 */
        const PROVIDER_FIELDS = {
            google: ["calendarId", "clientId", "clientSecret", "refreshToken", "tokenUrl", "proxyUrl"],
            icloud: ["caldavUrl", "username", "password", "proxyUrl"],
            nextcloud: ["host", "user", "username", "calendar", "password", "proxyUrl"],
            custom: ["caldavUrl", "username", "password", "proxyUrl"]
        };
        const FIELD_LABEL = {
            caldavUrl: "conn.caldavUrl", username: "conn.username", password: "conn.password",
            host: "conn.host", user: "conn.user", calendar: "conn.calendar", calendarId: "conn.calendarId",
            clientId: "conn.clientId", clientSecret: "conn.clientSecret", refreshToken: "conn.refreshToken",
            tokenUrl: "conn.tokenUrl", proxyUrl: "conn.proxyUrl"
        };
        const SECRET_FIELDS = ["password", "clientSecret", "refreshToken"];
        const PROVIDER_HINT = { google: "conn.googleHint", icloud: "conn.icloudHint", nextcloud: "conn.nextcloudHint", custom: "conn.customHint" };
        /** 字段级小字提示：provider -> 字段 -> 文案 key（没有就不显示）。 */
        const FIELD_HINT = {
            google: { calendarId: "hint.calendarId.google", refreshToken: "hint.refreshToken.google", clientId: "hint.clientId.google", tokenUrl: "hint.tokenUrl" },
            icloud: { caldavUrl: "hint.caldavUrl.icloud", username: "hint.username.icloud", password: "hint.password.icloud" },
            nextcloud: { host: "hint.host.nextcloud", user: "hint.user.nextcloud", username: "hint.username.nextcloud", calendar: "hint.calendar.nextcloud" },
            custom: { caldavUrl: "hint.caldavUrl.custom", username: "hint.username.custom" }
        };
        /** 「怎么拿到这些值」的步骤 + 外链（两边语言各一份文案，链接是共用的）。 */
        const PROVIDER_LINKS = {
            google: [
                { href: "https://console.cloud.google.com/apis/credentials", key: "link.googleConsole" },
                { href: "https://developers.google.com/oauthplayground", key: "link.googlePlayground" }
            ],
            icloud: [{ href: "https://appleid.apple.com/account/manage", key: "link.appleId" }],
            nextcloud: [],
            custom: []
        };
        const PROVIDER_NAMES = ["google", "icloud", "nextcloud", "custom"];
        /** 面板上的连接摘要 → 表单草稿。密钥一律留空，靠 placeholder 说明「已保存」。 */
        function connectionDraftOf(connection) {
            const out = { provider: "" };
            for (const key of Object.keys(FIELD_LABEL))
                out[key] = "";
            if (connection) {
                for (const key of Object.keys(out)) {
                    if (typeof connection[key] === "string")
                        out[key] = connection[key];
                }
            }
            return out;
        }
        /** 「当前：icloud · 你@icloud.com」里的那半句。 */
        function connectionSummary(connection) {
            if (connection === null || connection === undefined)
                return "";
            const provider = connection.provider || "custom";
            const account = connection.calendarId || connection.username || connection.user
                || (connection.host ? String(connection.host).replace(/^https?:\/\//, "") : "")
                || connection.caldavUrl || "";
            return account === "" ? provider : provider + " · " + account;
        }
        /**
         * 连接设置表单：填 → 测试 → 保存。保存前服务端还会再测一次（test:true），
         * 所以「保存成功」等价于「这套凭据刚才真的连上了」。
         */
        function ConnectionForm(props) {
            const { connection, onClose, onSaved, inline, onBusy } = props;
            const formId = useId();
            const [form, setForm] = useState(() => connectionDraftOf(connection));
            const [busy, setBusy] = useState("");
            const [result, setResult] = useState(null);
            const maySave = connection?.settingsAvailable !== false;
            useEffect(() => {
                onBusy?.(busy !== "");
                return () => onBusy?.(false);
            }, [busy, onBusy]);
// Update protection: dsh-calendar.connection
__stardustUpdatesGuard(React, "dsh-calendar.connection", { dirty: JSON.stringify(form) !== JSON.stringify(connectionDraftOf(connection)), busy: !!busy });

            const patch = (fields) => {
                setForm((prev) => Object.assign({}, prev, fields));
                setResult(null);
            };
            const visible = PROVIDER_FIELDS[form.provider] || [];
            const payload = () => {
                const out = {};
                for (const key of Object.keys(FIELD_LABEL)) {
                    const value = form[key];
                    if (typeof value !== "string")
                        continue;
                    // 密钥留空 = 保持已存的那一份；其余字段空串服务端也按「保持不变」处理。
                    if (SECRET_FIELDS.indexOf(key) !== -1 && value.trim() === "")
                        continue;
                    out[key] = value.trim();
                }
                if (form.provider !== "")
                    out.provider = form.provider;
                if (form.provider === "google")
                    out.authMethod = "oauth";
                else if (form.provider !== "" && connection && form.provider !== connection.provider)
                    out.authMethod = "basic";
                return out;
            };
            const test = async () => {
                setBusy("test");
                setResult(null);
                try {
                    const value = await api("testConnection", payload());
                    const sample = (value.sample || []).join("、");
                    setResult({ ok: true, text: t("conn.ok", { n: value.count }) + (sample === "" ? "" : t("conn.okSample", { sample })) });
                }
                catch (error) {
                    setResult({ ok: false, text: backendMessage(error) });
                }
                finally {
                    setBusy("");
                }
            };
            const save = async () => {
                setBusy("save");
                setResult(null);
                try {
                    onSaved(await api("saveConnection", Object.assign({}, payload(), { test: true })));
                }
                catch (error) {
                    setResult({ ok: false, text: backendMessage(error) });
                }
                finally {
                    setBusy("");
                }
            };
            const title = t("conn.title");
            const body = h(React.Fragment, null,
                h("p", { className: styles.pageIntro }, t("conn.intro")),
                h("p", { className: styles.pageIntro }, t("conn.credentials")),
                maySave ? null : h("div", { className: clsx(styles["dshc-alert"], styles.warn) }, t("conn.noSettings")),
                h("div", { className: styles["dshc-field"] },
                    h("label", { htmlFor: formId + "-provider" }, t("conn.provider")),
                    h(Picker, {
                        id: formId + "-provider", label: t("conn.provider"), value: form.provider, disabled: busy !== "",
                        options: [{ id: "", label: t("conn.needProvider") }].concat(PROVIDER_NAMES.map(id => ({
                            id, label: { google: "Google CalDAV OAuth", icloud: "iCloud", nextcloud: "Nextcloud", custom: t("provider.custom") }[id]
                        }))),
                        onChange: provider => patch({ provider })
                    })
                ),
                PROVIDER_HINT[form.provider] ? h("p", { className: styles.pageIntro }, t(PROVIDER_HINT[form.provider])) : null,
                form.provider ? h("details", { className: styles["dshc-steps"] },
                    h("summary", null, t("conn.steps")),
                    h("ol", null, (UI[UI_LANG]["steps." + form.provider] || []).map((line, index) => h("li", { key: index }, line))),
                    h("div", { className: styles.helpLinks }, (PROVIDER_LINKS[form.provider] || []).map(link => h("a", {
                        key: link.href, href: link.href, target: "_blank", rel: "noreferrer", className: styles["dshc-link"]
                    }, t(link.key))))
                ) : null,
                h("div", { className: styles.formGrid }, visible.map(key => {
                    const secret = SECRET_FIELDS.includes(key);
                    const saved = { password: "hasPassword", clientSecret: "hasClientSecret", refreshToken: "hasRefreshToken" }[key];
                    const hintKey = FIELD_HINT[form.provider]?.[key];
                    return h("div", {
                        key, className: clsx(styles["dshc-field"], ["caldavUrl", "tokenUrl", "proxyUrl"].includes(key) && styles.fullField)
                    },
                        h("label", { htmlFor: formId + "-" + key }, t(FIELD_LABEL[key])),
                        h(Txt, {
                            id: formId + "-" + key, type: secret ? "password" : "text", disabled: busy !== "",
                            value: form[key] || "", placeholder: saved && connection?.[saved] ? t("conn.keep") : "",
                            onChange: event => patch({ [key]: event.target.value })
                        }),
                        hintKey ? h("div", { className: styles["dshc-sub"] }, t(hintKey)) : null
                    );
                })),
                result ? h("div", {
                    className: clsx(styles["dshc-alert"], result.ok ? styles.success : styles.error), role: result.ok ? "status" : "alert"
                }, (result.ok ? "✓ " : t("conn.fail") + "：") + result.text) : null,
                connection?.settingsKind === "file" ? h("p", { className: styles.pageIntro }, t("conn.storageFallback")) : null
            );
            const actions = h("div", { className: styles["dshc-actions"] },
                h(Btn, { variant: "ghost", onClick: onClose, disabled: busy !== "" }, t("action.cancel")),
                h(Btn, { onClick: test, disabled: busy !== "" || !form.provider }, busy === "test" ? t("conn.testing") : t("conn.test")),
                h(Btn, { variant: "primary", onClick: save, disabled: busy !== "" || !form.provider || !maySave }, busy === "save" ? t("conn.saving") : t("conn.save"))
            );
            if (inline) return h("section", { className: styles.workspacePage, "aria-label": title, "aria-busy": !!busy },
                h("div", { className: styles.pageInner },
                    h("h2", { className: styles.pageHeading }, title),
                    h("div", { className: styles.card }, body, actions)
                )
            );
            return h(Dlg, { open: true, onClose: () => { if (!busy) onClose(); }, title, children: body, footer: actions });
        }
        // ───────────────────────────── 主面板 ─────────────────────────────
        // ───────────────────────────── 浮层 Esc 的模块级栈 ─────────────────────────────
        // 一个页面可能同时有多个 CalendarPanel（设置页一节 + 对话页悬浮面板）。如果各自往
        // document 挂捕获监听，stopPropagation 拦不住同阶段的其他监听 —— 一次 Esc 会连关
        // 两层；用全局 querySelector 兜底也会被另一个面板的浮层误触发。这里共用一个捕获
        // 监听，按「焦点所在 root / 最近打开的层」只关一层。
        const LAYER_ESCAPE_STACK = [];
        let layerEscapeListener = null;
        function panelRootOf(node) {
            if (node === null || node === undefined || typeof node.closest !== "function")
                return null;
            return node.closest(".dshc-root");
        }
        /** 目标是否位于别的宿主浮层内（那类浮层会自己处理 Esc）。 */
        function isForeignHostLayer(node) {
            if (node === null || node === undefined || typeof node.closest !== "function")
                return false;
            const layer = node.closest('[role="dialog"], [role="alertdialog"]');
            if (layer === null)
                return false;
            if (layer.closest(".dshc-root") !== null)
                return false;
            if (layer.querySelector('[data-dshc-scope="1"]') !== null)
                return false;
            return true;
        }
        /** 是否有别的宿主浮层盖在上面：有就把 Esc 让给宿主，别关下面的日历层。 */
        function hasForeignHostDialog() {
            const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
            for (let i = 0; i < dialogs.length; i++) {
                const layer = dialogs[i];
                if (layer.closest(".dshc-root") !== null)
                    continue;
                if (layer.querySelector('[data-dshc-scope="1"]') !== null)
                    continue;
                if (layer.hidden === true || layer.getAttribute("aria-hidden") === "true")
                    continue;
                if (typeof window !== "undefined" && window !== null && typeof window.getComputedStyle === "function") {
                    const style = window.getComputedStyle(layer);
                    if (style.display === "none" || style.visibility === "hidden")
                        continue;
                }
                return true;
            }
            return false;
        }
        function registerLayerEscape(root, closeTop) {
            const entry = { root, closeTop };
            LAYER_ESCAPE_STACK.push(entry);
            if (layerEscapeListener === null) {
                layerEscapeListener = (event) => {
                    if (event.key !== "Escape" || event.isComposing === true)
                        return;
                    const target = event.target;
                    if (target?.closest?.('[role="menu"], [aria-haspopup="menu"][aria-expanded="true"]')) return;
                    // 上层有别的宿主浮层（不是本插件渲染的）时，Esc 归它；
                    // 普通宿主元素（不在任何浮层里）仍然兜底关我们自己的层。
                    if (hasForeignHostDialog() || isForeignHostLayer(target))
                        return;
                    const root = panelRootOf(target);
                    let owner = null;
                    if (root !== null) {
                        for (let i = LAYER_ESCAPE_STACK.length - 1; i >= 0; i--) {
                            const candidate = LAYER_ESCAPE_STACK[i];
                            if (candidate.root !== null && candidate.root.contains(target)) {
                                owner = candidate;
                                break;
                            }
                        }
                    }
                    if (owner === null)
                        owner = LAYER_ESCAPE_STACK[LAYER_ESCAPE_STACK.length - 1] || null;
                    if (owner === null)
                        return;
                    event.preventDefault();
                    event.stopPropagation();
                    owner.closeTop();
                };
                document.addEventListener("keydown", layerEscapeListener, true);
            }
            return () => {
                const index = LAYER_ESCAPE_STACK.indexOf(entry);
                if (index >= 0)
                    LAYER_ESCAPE_STACK.splice(index, 1);
                if (LAYER_ESCAPE_STACK.length === 0 && layerEscapeListener !== null) {
                    document.removeEventListener("keydown", layerEscapeListener, true);
                    layerEscapeListener = null;
                }
            };
        }
        Object.assign(UI.zh, {
            "conn.credentials": "这里填写日历服务的凭据。DSH 的模型 API 密钥不能用于日历登录；Google 使用 OAuth 授权，iCloud 使用应用专用密码。",
            "import.open": "导入 ICS", "import.title": "从 ICS 文件导入日程", "import.intro": "先核对预览，再导入选中的日程。已有相同 UID 的记录会跳过。",
            "import.file": "选择 ICS 文件", "import.paste": "或粘贴 ICS 内容", "import.timezone": "未标注时区的时间按", "import.chooseZone": "请主动选择时区", "import.preview": "预览与检查",
            "import.busy": "正在处理…", "import.close": "关闭导入", "import.select": "选择下一批（最多 20 条）", "import.clear": "清除选择", "import.commit": "确认导入 {n} 条",
            "import.ready": "可导入", "import.blocked": "需要修正", "import.duplicate": "已存在，跳过", "import.imported": "已导入", "import.failed": "失败，可重试",
            "import.conflicts": "首场时间与 {n} 条日程重叠，请核对", "import.recurring": "重复系列 · {n} 条例外", "import.scope": "重叠提示检查首场时间，不代表整个重复系列。每批最多 20 个系列；预览保留 15 分钟。",
            "import.ignored": "另有 {n} 个非日程组件未导入。", "import.limit": "ICS 文件最大 256 KiB；每次预览最多 100 个日程系列。", "import.results": "本批：{ok} 条已导入，{duplicate} 条已存在，{failed} 条失败。",
            "import.connection": "连接设置", "import.errorSize": "文件超过 256 KiB，请分批导出。", "import.stopped": "请求已停止；重新预览可核对已写入的日程。", "import.stop": "停止本批",
            "import.retryHint": "重试只处理失败项，成功项不会重复写入。", "import.noReady": "没有可导入的日程，请检查上面的提示。"
        });
        Object.assign(UI.en, {
            "conn.credentials": "Use credentials for your calendar service here. A DSH model API key cannot sign into a calendar. Google uses OAuth authorization; iCloud uses an app-specific password.",
            "import.open": "Import ICS", "import.title": "Import events from ICS", "import.intro": "Review the preview before importing selected events. Existing UIDs are skipped.",
            "import.file": "Choose an ICS file", "import.paste": "Or paste ICS content", "import.timezone": "Interpret times without a timezone as", "import.chooseZone": "Choose a timezone explicitly", "import.preview": "Preview and check",
            "import.busy": "Working…", "import.close": "Close import", "import.select": "Select next batch (up to 20)", "import.clear": "Clear selection", "import.commit": "Confirm import of {n} events",
            "import.ready": "Ready", "import.blocked": "Needs correction", "import.duplicate": "Already exists; skipped", "import.imported": "Imported", "import.failed": "Failed; retry available",
            "import.conflicts": "The first occurrence overlaps {n} events; please review", "import.recurring": "Recurring series · {n} exceptions", "import.scope": "Overlap checks cover the first occurrence, not the whole series. Up to 20 series per batch; previews expire in 15 minutes.",
            "import.ignored": "{n} non-event components were not imported.", "import.limit": "Up to 256 KiB per file and 100 event series per preview.", "import.results": "Batch: {ok} imported, {duplicate} already present, {failed} failed.",
            "import.connection": "Connection settings", "import.errorSize": "The file exceeds 256 KiB; export smaller batches.", "import.stopped": "Request stopped. Preview again to check which events were saved.", "import.stop": "Stop batch",
            "import.retryHint": "Retry only processes failed items; successful items are not written again.", "import.noReady": "No events are ready to import. Review the messages above."
        });
        async function importApi(action, payload, signal) {
            const res = await fetch(IMPORT_ROUTE, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "X-DSH-Calendar-Import": "1" }, body: JSON.stringify(Object.assign({ action }, payload)), signal });
            let body;
            try {
                body = await res.json();
            }
            catch (e) {
                body = null;
            }
            if (!res.ok || !body || body.ok !== true)
                throw Object.assign(new Error(backendMessage({ message: body && body.message || "HTTP " + res.status, status: res.status })), { status: res.status });
            return body.value;
        }
        function importDate(row) {
            if (!row.start)
                return "";
            if (row.allDay)
                return row.start + (row.end && row.end !== row.start ? " → " + row.end + " (" + (UI_LANG === "en" ? "exclusive end" : "结束日不计入") + ")" : "");
            let timezone = row.timezones && row.timezones[0] || "UTC";
            try {
                new Intl.DateTimeFormat("en", { timeZone: timezone });
            }
            catch (e) {
                timezone = "UTC";
            }
            const fmt = new Intl.DateTimeFormat(UI_LANG === "en" ? "en-GB" : "zh-CN", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
            return fmt.format(new Date(row.start)) + " → " + fmt.format(new Date(row.end || row.start)) + " · " + timezone;
        }
        function IcsImportPanel(props) {
            const timezoneId = useId();
            const [content, setContent] = useState(""), [timezone, setTimezone] = useState(""), [zones, setZones] = useState(["UTC", "Asia/Shanghai", "America/New_York", "Europe/London"]);
            const [preview, setPreview] = useState(null), [selected, setSelected] = useState([]), [results, setResults] = useState({}), [error, setError] = useState(""), [busy, setBusy] = useState(false);
            const controller = useRef(null), alive = useRef(true), fileSequence = useRef(0);
// Update protection: dsh-calendar.import
__stardustUpdatesGuard(React, "dsh-calendar.import", { dirty: !!content.trim(), busy });

            useEffect(() => {
                alive.current = true;
                const abort = new AbortController();
                importApi("zones", {}, abort.signal).then(v => { if (alive.current && Array.isArray(v.zones)) {
                    const common = ["Asia/Shanghai", "UTC", "Asia/Tokyo", "Europe/London", "America/New_York"];
                    setZones(common.concat(v.zones.filter(zone => !common.includes(zone))));
                } }).catch(() => { });
                return () => { alive.current = false; abort.abort(); if (controller.current)
                    controller.current.abort(); };
            }, []);
            useEffect(() => { props.onBusy(busy); return () => props.onBusy(false); }, [busy]);
            const reset = () => { setPreview(null); setSelected([]); setResults({}); setError(""); };
            const update = value => { fileSequence.current++; setContent(value); reset(); };
            const loadFile = async (event) => {
                const file = event.target.files && event.target.files[0];
                if (!file)
                    return;
                const sequence = ++fileSequence.current;
                reset();
                setContent("");
                if (file.size > 256 * 1024) {
                    setError(t("import.errorSize"));
                    return;
                }
                try {
                    const value = await file.text();
                    if (alive.current && sequence === fileSequence.current)
                        setContent(value);
                }
                catch (e) {
                    if (alive.current && sequence === fileSequence.current)
                        setError(backendMessage(e));
                }
            };
            const eligible = preview ? preview.rows.filter(row => row.status === "ready" && !["imported", "duplicate"].includes(results[row.id] && results[row.id].status)) : [];
            const run = async (committing, ids = selected) => {
                if (busy)
                    return;
                setBusy(true);
                setError("");
                const abort = new AbortController();
                controller.current = abort;
                const timer = setTimeout(() => abort.abort(), 125000);
                try {
                    const value = await importApi(committing ? "commit" : "preview", committing ? { id: preview.id, selected: ids, confirmed: true } : { ics: content, floatingTimezone: timezone }, abort.signal);
                    if (!alive.current)
                        return;
                    if (committing) {
                        const next = Object.assign({}, results);
                        value.results.forEach(row => { next[row.id] = row; });
                        setResults(next);
                        setSelected(value.results.filter(row => row.status === "failed").map(row => row.id));
                        props.onImported();
                    }
                    else {
                        setPreview(value);
                        setResults({});
                        setSelected([]);
                    }
                }
                catch (e) {
                    if (alive.current)
                        setError(abort.signal.aborted ? t("import.stopped") : backendMessage(e));
                }
                finally {
                    clearTimeout(timer);
                    controller.current = null;
                    if (alive.current)
                        setBusy(false);
                }
            };
            const count = Object.values(results);
            const failed = eligible.filter(row => results[row.id]?.status === "failed").slice(0, 20).map(row => row.id);
            const importStatusTone = { ready: styles.success, imported: styles.success, blocked: styles.warn, failed: styles.error };
            const title = t("import.title");
            const fields = h("div", { className: styles.card },
                h("label", { className: styles["dshc-field"] },
                    h("span", null, t("import.file")),
                    h("input", { className: styles["dshc-input"], type: "file", accept: ".ics,text/calendar", disabled: busy, onChange: loadFile })
                ),
                h("label", { className: styles["dshc-field"] },
                    h("span", null, t("import.paste")),
                    h("textarea", { className: clsx(styles["dshc-input"], styles.importText), value: content, rows: 5, disabled: busy, onChange: e => update(e.target.value), spellCheck: false })
                ),
                h("div", { className: styles["dshc-field"] },
                    h("label", { htmlFor: timezoneId }, t("import.timezone")),
                    h(Picker, {
                        id: timezoneId, label: t("import.timezone"), value: timezone, disabled: busy,
                        options: [{ id: "", label: t("import.chooseZone") }].concat(zones.map(id => ({
                            id, label: id === "Asia/Shanghai" ? calendarText("北京时间 · Asia/Shanghai", "Beijing time · Asia/Shanghai") : id
                        }))),
                        onChange: value => { setTimezone(value); reset(); }
                    })
                ),
                h("p", { className: styles["dshc-sub"] }, t("import.limit")),
                h("div", { className: styles["dshc-import-actions"] },
                    h(Btn, { variant: preview ? "outline" : "primary", disabled: busy || !content.trim(), onClick: () => run(false) }, busy ? t("import.busy") : t("import.preview")),
                    busy ? h(Btn, { onClick: () => controller.current?.abort() }, t("import.stop")) : null
                )
            );
            const previewCard = preview ? h("div", { className: styles.card },
                h("div", { className: styles.cardToolbar },
                    h("h3", null, t("import.preview")),
                    h("div", { className: styles["dshc-actions"] },
                        failed.length ? h(Btn, { disabled: busy || !preview.connectionReady, onClick: () => run(true, failed) },
                            calendarText("重试失败项", "Retry failed items")) : null,
                        h(Btn, { variant: "primary", disabled: busy || !preview.connectionReady || !selected.length, onClick: () => run(true) }, t("import.commit", { n: selected.length }))
                    )
                ),
                preview.connectionReady === false ? h("div", { className: clsx(styles["dshc-alert"], styles.warn) },
                    backendMessage(preview.connectionMessage), h(Btn, { onClick: props.onConnection }, t("import.connection"))) : null,
                h("p", { className: styles["dshc-sub"] }, t("import.scope")),
                preview.ignored ? h("p", null, t("import.ignored", { n: preview.ignored })) : null,
                h("div", { className: styles["dshc-import-actions"] },
                    h(Btn, { variant: "ghost", disabled: busy || !eligible.length, onClick: () => setSelected(eligible.slice(0, 20).map(row => row.id)) }, t("import.select")),
                    h(Btn, { variant: "ghost", disabled: busy || !selected.length, onClick: () => setSelected([]) }, t("import.clear"))
                ),
                h("div", { className: styles["dshc-import-rows"] }, preview.rows.map(row => {
                    const result = results[row.id], status = result?.status || row.status;
                    const checked = selected.includes(row.id);
                    const done = status === "imported" || status === "duplicate";
                    return h("div", { key: row.id, className: styles["dshc-import-row"] },
                        h("div", { className: styles["dshc-import-pick"] },
                            h(Chk, { label: row.summary, checked,
                                disabled: busy || row.status !== "ready" || done || (!checked && selected.length >= 20),
                                onChange: next => setSelected(prev => next ? prev.concat(row.id) : prev.filter(id => id !== row.id)) }),
                            h("span", { className: clsx(styles["dshc-tag"], importStatusTone[status]) }, t("import." + status))
                        ),
                        h("p", { className: styles["dshc-mono"] }, importDate(row)),
                        row.recurring ? h("p", null, t("import.recurring", { n: row.exceptions })) : null,
                        !done && row.conflicts ? h("p", { className: styles["dshc-import-warning"] }, t("import.conflicts", { n: row.conflicts })) : null,
                        !done ? row.warnings.concat(row.errors).map((message, i) => h("p", { key: i, className: styles["dshc-import-warning"] }, backendMessage(message))) : null,
                        result?.message ? h("p", { role: "alert" }, backendMessage(result.message)) : null
                    );
                })),
                count.length ? h("p", { role: "status" }, t("import.results", {
                    ok: count.filter(row => row.status === "imported").length,
                    duplicate: count.filter(row => row.status === "duplicate").length,
                    failed: count.filter(row => row.status === "failed").length
                })) : null,
                failed.length ? h("p", { className: styles["dshc-sub"] }, t("import.retryHint")) : null,
                !eligible.length && !count.length ? h("p", null, t("import.noReady")) : null
            ) : null;
            return h("section", { className: styles.workspacePage, "aria-label": title, "aria-busy": busy },
                h("div", { className: styles.pageInner },
                    h("div", { className: styles.pageHeader },
                        h("h2", { className: styles.pageHeading }, title),
                        h(IconButton, { label: t("import.close"), icon: "close", disabled: busy, onClick: props.onClose })
                    ),
                    h("p", { className: styles.pageIntro }, t("import.intro")),
                    fields,
                    error ? h("p", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" }, error) : null,
                    previewCard
                )
            );
        }
        const NO_EVENTS = [];

        function CalendarPanel(props) {
            useUILanguage();
            const compact = props.compact === true;
            const workbench = props.workbench === true;
            const workspaceId = useId();
            const viewId = useId();
            const [view, setView] = useState(loadStoredView);
            const [anchor, setAnchor] = useState(() => new Date());
            const [showCalendar, setShowCalendar] = useState(true);
            const [demo, setDemo] = useState(false);
            const [reloadToken, setReloadToken] = useState(0);
            const [selected, setSelected] = useState(null);
            const [draft, setDraft] = useState(null);
            const [busy, setBusy] = useState(false);
            const [formError, setFormError] = useState(null);
            const [banner, setBanner] = useState(null);
            const [confirmDelete, setConfirmDelete] = useState(false);
            const [configured, setConfigured] = useState(null);
            const [conn, setConn] = useState(null);
            const [connOpen, setConnOpen] = useState(false);
            const [tool, setTool] = useState("schedule");
            const [layout, setLayout] = useState(loadCalendarLayout);
            const [palette, setPalette] = useState(loadCalendarPalette);
            const dark = useCalendarDarkMode(workbench);
            const appearance = useMemo(() => workbench ? calendarAppearance(layout, palette, dark ? "dark" : "light") : undefined,
                [workbench, layout, palette, dark]);
            const [utility, setUtility] = useState(null);
            const [importBusy, setImportBusy] = useState(false);
            const [availabilityBusy, setAvailabilityBusy] = useState(false);
            const [connectionBusy, setConnectionBusy] = useState(false);
            const importOpen = tool === "import";
            const availabilityOpen = tool === "availability";
            const connectionOpen = tool === "connection";
            const layerOpen = draft !== null || selected !== null || connOpen === true || utility !== null;
            // Update protection: dsh-calendar
            __stardustUpdatesGuard(React, "dsh-calendar", { busy: busy || layerOpen || importOpen || availabilityOpen || connectionOpen });

            const rootRef = useRef(null);
            /** 让 Launcher 知道本面板里有没有浮层：宿主 Portal 的 Esc 不能被面板级监听抢走。 */
            useEffect(() => {
                const notify = typeof props.onLayerChange === "function" ? props.onLayerChange : null;
                if (notify !== null)
                    notify(layerOpen);
                return () => { if (notify !== null)
                    notify(false); };
            }, [layerOpen]);
            /** 面板内浮层的打开顺序：Esc 关最后打开的那个，而不是按类型硬编码。 */
            const layerOrderRef = useRef([]);
            useEffect(() => {
                const openKeys = [];
                if (selected !== null)
                    openKeys.push("selected");
                if (draft !== null)
                    openKeys.push("draft");
                if (connOpen === true)
                    openKeys.push("conn");
                if (utility !== null)
                    openKeys.push("utility");
                const kept = layerOrderRef.current.filter((key) => openKeys.indexOf(key) !== -1);
                const added = openKeys.filter((key) => kept.indexOf(key) === -1);
                layerOrderRef.current = kept.concat(added);
            }, [draft, connOpen, selected, utility]);
            /**
             * Esc 分层关闭：有浮层时只关最上面一层（表单/连接设置 > 详情抽屉）。
             * 监听走模块级的层栈 —— 多个 CalendarPanel 并存时一次 Esc 只关一层；
             * 焦点在上层宿主 Portal 里时直接让行，交给宿主自己的 Esc 语义。
             */
            useEffect(() => {
                if (layerOpen !== true)
                    return () => { };
                const root = rootRef.current;
                if (root === null)
                    return () => { };
                const closeTop = () => {
                    const order = layerOrderRef.current;
                    const top = order.length === 0 ? null : order[order.length - 1];
                    if (top === "draft") {
                        setDraft(null);
                        setFormError(null);
                        setConfirmDelete(false);
                    }
                    else if (top === "conn")
                        setConnOpen(false);
                    else if (top === "utility")
                        setUtility(null);
                    else if (top === "selected") {
                        setSelected(null);
                        setConfirmDelete(false);
                    }
                };
                return registerLayerEscape(root, closeTop);
            }, [draft, selected, connOpen, utility]);
            /** 乐观改期：uid → { start, end }。等服务器回读到同样的时间再撤掉，避免闪回。 */
            const [overrides, setOverrides] = useState({});
            const [undo, setUndo] = useState(null);
            const undoTimer = useRef(0);
            /** 每个 uid 一个串行队列：见 applyMove 的注释。 */
            const moveQueue = useRef({});
            useEffect(() => () => { if (undoTimer.current)
                clearTimeout(undoTimer.current); }, []);
            useEffect(() => {
                let alive = true;
                api("connection", {}).then((value) => { if (alive) {
                    setConn(value);
                    setConfigured(value && value.configured !== false);
                } })
                    .catch(() => { if (alive)
                    setConfigured(true); }); // 状态都问不到时按「已配置」处理，让错误条去解释
                return () => { alive = false; };
            }, [reloadToken]);
            const range = useMemo(() => rangeOf(view, anchor), [view, anchor.getFullYear(), anchor.getMonth(), anchor.getDate()]);
            const data = useCalendarData(range, reloadToken, demo);
            const reload = () => setReloadToken((n) => n + 1);
            /** 渲染用的事件：把乐观改期叠加在服务器数据之上。 */
            const eventsWithMoves = useMemo(() => data.events.map((event) => {
                const override = overrides[event.uid];
                return override === undefined ? event : Object.assign({}, event, override);
            }), [data.events, overrides]);
            const visibleEvents = showCalendar || demo ? eventsWithMoves : NO_EVENTS;
            const { count: conflicts, conflicted, overlap } = useMemo(() => conflictSummary(visibleEvents), [visibleEvents]);
            const source = conn?.configured ? conn.calendar || connectionSummary(conn) : null;
            /**
             * 改期成功后把焦点还给同一个日程。
             *
             * 位置必须在 const data = useCalendarData(...) **之后**：依赖数组 [data.events] 在渲染期求值，
             * 写在前面会直接 TDZ 抛错（panel 每次渲染就崩 —— 纯函数测试抓不到，评审抓到了）。
             * 另外只在「焦点还在面板里」时才回收，免得用户在慢 reload 期间已经点到别处又被抢回来。
             */
            const focusUid = useRef(null);
            useEffect(() => {
                const uid = focusUid.current;
                if (uid === null)
                    return;
                focusUid.current = null;
                const active = document.activeElement;
                const inPanel = active === undefined || active === null || active === document.body
                    || (typeof active.closest === "function" && active.closest(".dshc-root") !== null);
                if (inPanel !== true)
                    return;
                try {
                    const selector = '.dshc-slot[data-uid="' + String(uid).replace(/"/g, '\\"') + '"]';
                    const node = document.querySelector(selector);
                    if (node !== null && typeof node.focus === "function")
                        node.focus({ preventScroll: true });
                }
                catch (error) { /* uid 里有怪字符就算了，不值得为此报错 */ }
            }, [data.events]);
            /** 服务器回读到新时间后，撤掉对应的乐观覆盖（否则会一直盖着）。 */
            useEffect(() => {
                setOverrides((prev) => {
                    const uids = Object.keys(prev);
                    if (uids.length === 0)
                        return prev;
                    const next = Object.assign({}, prev);
                    let changed = false;
                    for (const uid of uids) {
                        const stored = data.events.find((event) => event.uid === uid);
                        if (stored !== undefined && stored.start === prev[uid].start && stored.end === prev[uid].end) {
                            delete next[uid];
                            changed = true;
                        }
                    }
                    return changed ? next : prev;
                });
            }, [data.events]);
            /** 乐观改期的落盘：先动画面、再发请求；失败就把覆盖撤掉并报错。 */
            /**
             * 改期落盘：**按 uid 串行 + 合并**。
             *
             * 按住方向键会按 repeat 频率连发，直接并发发 PUT 的话：乱序可能让服务器停在中间某个时间、
             * 而先发的那次失败会把后发那次的乐观位置一起回滚掉。这里同一 uid 只跑一个请求，
             * 期间来的新落点合并成「最后一次」，跑完再接着发。
             */
            const applyMove = (event, range) => {
                const uid = event.uid;
                const shown = overrides[uid] === undefined ? { start: event.start, end: event.end } : overrides[uid];
                if (range.start === shown.start && range.end === shown.end)
                    return; // 无效位移（同一格内晃一下）不发请求
                const queue = moveQueue.current;
                if (queue[uid] === undefined)
                    queue[uid] = { running: false, next: null };
                const entry = queue[uid];
                if (entry.running === true) {
                    entry.next = range;
                    return;
                }
                entry.running = true;
                void drain(uid, event, range, entry);
            };
            /** 串行队列的驱动：失败即回滚 + 对账（超时可能已经落盘，不能假设「失败 = 没改」）。 */
            const drain = async (uid, event, firstRange, entry) => {
                const original = { uid, start: event.start, end: event.end, summary: event.summary };
                let range = firstRange;
                try {
                    for (;;) {
                        setOverrides((prev) => Object.assign({}, prev, { [uid]: { start: range.start, end: range.end } }));
                        try {
                            await api("update", { uid, start: range.start, end: range.end });
                        }
                        catch (error) {
                            setOverrides((prev) => { const next = Object.assign({}, prev); delete next[uid]; return next; });
                            notify(t("move.failed", { message: error !== null && error !== undefined && error.message ? error.message : String(error) }));
                            reload(); // 对账：超时/断连时服务器可能已经改了
                            break;
                        }
                        focusUid.current = uid;
                        // 一次「连续操作」只留一个撤销点：记录的是这段操作前的原始位置，而不是上一小步。
                        setUndo(Object.assign({ recurring: false }, original));
                        if (undoTimer.current)
                            clearTimeout(undoTimer.current);
                        undoTimer.current = setTimeout(() => setUndo(null), 5000);
                        reload();
                        if (entry.next === null)
                            break;
                        range = entry.next;
                        entry.next = null;
                    }
                }
                finally {
                    entry.running = false;
                    if (entry.next === null)
                        delete moveQueue.current[uid];
                    else {
                        const pending = entry.next;
                        entry.next = null;
                        applyMove(event, pending);
                    }
                }
            };
            /** 改期入口：重复日程先问一句（拖动会移动整个系列，这是语义雷区，不能悄悄做）。 */
            const reschedule = (event, range) => {
                if (demo === true) {
                    notify(t("demo.banner"));
                    return;
                }
                // 重复日程暂不支持拖动改期：CalDAV 里整个系列是一个对象，而 update 只能改 master 的
                // DTSTART —— 把「这次实例的目标时间」发过去等于**重锚系列起点**（早于它的实例全丢、
                // COUNT/UNTIL 语义被改，撤销也回不到原系列）。评审实测过，这里必须先挡住。
                if (isRecurring(event)) {
                    notify(t("move.recurringUnsupported"));
                    return;
                }
                // 超过 24 小时的日程：当天放不下，任何位移都会被钳到 00:00，语义不清，一并挡住。
                if (slotFromEvent(event).durationMinutes > 24 * 60) {
                    notify(t("move.tooLong"));
                    return;
                }
                applyMove(event, range);
            };
            /** 撤销：把上一次改期前的 start/end 再写回去。 */
            const undoMove = async () => {
                if (undo === null)
                    return;
                const target = undo;
                setUndo(null);
                if (undoTimer.current)
                    clearTimeout(undoTimer.current);
                const optimistic = true; // 撤销只服务单次日程（重复日程不走拖动）
                if (optimistic === true)
                    setOverrides((prev) => Object.assign({}, prev, { [target.uid]: { start: target.start, end: target.end } }));
                try {
                    await api("update", { uid: target.uid, start: target.start, end: target.end });
                    reload();
                }
                catch (error) {
                    if (optimistic === true)
                        setOverrides((prev) => { const next = Object.assign({}, prev); delete next[target.uid]; return next; });
                    notify(t("move.failed", { message: error !== null && error !== undefined && error.message ? error.message : String(error) }));
                }
            };
            /** 未连接日历时的点法：别让按钮「点了没反应」，直接打开连接设置并说明原因。 */
            const connectFirst = () => {
                setConnOpen(true);
                notify(calendarText('请先连接日历，再新建日程或查找空闲时段。', 'Connect a calendar before creating events or finding available time.'));
            };
            const notify = (text) => { setBanner(text); setTimeout(() => setBanner((current) => (current === text ? null : current)), 2200); };
            const title = view === "week" ? formatWeekTitle(anchor) : view === "agenda" ? t("view.agenda") : formatMonthTitle(anchor);
            const step = (delta) => setAnchor((current) => (view === "week" ? addDays(current, delta * 7) : addMonthShift(current, delta)));
            const submit = async (form) => {
                if (demo === true) {
                    setFormError(t("demo.banner"));
                    return;
                }
                setBusy(true);
                setFormError(null);
                try {
                    const fields = fieldsOfDraft(form);
                    if (form.uid === undefined)
                        await api("create", fields);
                    else
                        await api("update", Object.assign({ uid: form.uid }, fields));
                    setDraft(null);
                    setSelected(null);
                    reload();
                    notify(form.uid === undefined ? calendarText("已创建", "Event created") : calendarText("已保存", "Event saved"));
                }
                catch (error) {
                    setFormError(backendMessage(error));
                }
                finally {
                    setBusy(false);
                }
            };
            const remove = async (event) => {
                if (demo === true) {
                    notify(t("demo.banner"));
                    return;
                }
                setBusy(true);
                try {
                    await api("delete", { uid: event.uid, ...(isRecurring(event) ? { scope: "series" } : {}) });
                    setSelected(null);
                    setConfirmDelete(false);
                    reload();
                    setDraft(null);
                    setFormError(null);
                    notify(calendarText("已删除", "Event deleted"));
                }
                catch (error) {
                    if (draft) setFormError(backendMessage(error));
                    else setBanner(backendMessage(error));
                }
                finally {
                    setBusy(false);
                }
            };
            const toolBusy = importBusy || availabilityBusy || connectionBusy;
            const backToSchedule = () => setTool("schedule");
            const showAvailability = () => {
                if (configured === true) setTool("availability");
                else connectFirst();
            };
            const createAt = (day, hour) => {
                if (demo) {
                    notify(t("demo.banner"));
                    return;
                }
                setConfirmDelete(false);
                setFormError(null);
                setDraft(draftAt(day, hour));
            };
            const startDraft = () => configured === true ? createAt(anchor) : connectFirst();
            const finishConnection = value => {
                if (value?.connection) setConn(value.connection);
                setConnOpen(false);
                if (connectionOpen) backToSchedule();
                setDemo(false);
                setShowCalendar(true);
                reload();
                notify(t("conn.savedToast"));
            };
            const openEvent = event => {
                setConfirmDelete(false);
                setFormError(null);
                if (workbench && !demo && !isRecurring(event)) {
                    setDraft(draftOfEvent(event));
                } else {
                    setSelected(event);
                }
            };
            const closeReview = () => {
                setSelected(null);
                setConfirmDelete(false);
            };
            const closeDraft = () => {
                setDraft(null);
                setFormError(null);
                setConfirmDelete(false);
            };
            const editEvent = async event => {
                if (!isRecurring(event) || demo) {
                    closeReview();
                    setDraft(draftOfEvent(event));
                    return;
                }
                setBusy(true);
                try {
                    const value = await api("event", { uid: event.uid });
                    closeReview();
                    setDraft({ ...draftOfEvent(value.event), isSeries: true });
                } catch (error) {
                    setBanner(backendMessage(error));
                } finally {
                    setBusy(false);
                }
            };
            const selectView = name => { setView(name); storeView(name); };
            const views = h(Segments, {
                id: viewId, label: calendarText("日历视图", "Calendar view"),
                items: VIEWS.map(value => ({ value, label: t("view." + value) })), value: view, onChange: selectView
            });
            const period = h("div", { className: styles.period },
                view !== "agenda" ? h(Btn, { onClick: () => setAnchor(new Date()) }, t("action.today")) : null,
                view !== "agenda" ? h(IconButton, { icon: "left", label: t("action.prev"), onClick: () => step(-1) }) : null,
                view !== "agenda" ? h(IconButton, { icon: "right", label: t("action.next"), onClick: () => step(1) }) : null,
                h("strong", { className: styles["dshc-monthhead"] }, title)
            );
            const refresh = demo
                ? h(Btn, { onClick: () => setDemo(false) }, t("action.exitDemo"))
                : h(IconButton, { icon: "refresh", label: t("action.refresh"), onClick: reload });
            const availabilityLabel = calendarText("找空闲时段", "Find available time");
            const quickLabel = calendarText("日历快捷操作", "Calendar quick actions");
            const quickKey = workbench && document.documentElement.dataset.platform === "darwin" ? "⌘⇧K" : "Ctrl+Shift+K";
            const layoutOptions = workbench ? calendarLayoutOptions() : [];
            const selectLayout = value => { setLayout(value); storeCalendarPreference(CALENDAR_LAYOUT_KEY, value); };
            const selectPalette = value => { setPalette(value); storeCalendarPreference(CALENDAR_PALETTE_KEY, value); };
            const reviewConflicts = () => setUtility("conflicts");
            const canCreate = !demo && configured !== null && !toolBusy;
            const commandActions = workbench ? [
                { id: "create", key: "n", label: t("action.new"), run: startDraft, disabled: !canCreate },
                { id: "availability", key: "f", label: availabilityLabel, run: showAvailability, disabled: demo || configured === null },
                { id: "conflicts", label: calendarText("查看日程冲突", "Review scheduling conflicts"), run: reviewConflicts, disabled: conflicts === 0 },
                { id: "import", label: t("import.open"), run: () => setTool("import"), disabled: demo },
                { id: "connection", label: t("conn.title"), run: () => setTool("connection"), disabled: configured === null },
                ...VIEWS.map(name => ({
                    id: name, key: name[0],
                    label: calendarText("切换到" + t("view." + name) + "视图", "Switch to " + t("view." + name)),
                    run: () => { backToSchedule(); selectView(name); }
                })),
                ...layoutOptions.map(option => ({
                    id: option.id,
                    label: calendarText("切换布局 · ", "Switch layout · ") + option.label,
                    run: () => selectLayout(option.id)
                }))
            ] : [];
            function onWorkbenchKeyDown(event) {
                if (layerOpen || toolBusy || event.defaultPrevented || event.nativeEvent?.isComposing) return;
                if (event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="menu"], [role="dialog"], [role="alertdialog"], [aria-expanded="true"][aria-haspopup="menu"]')) return;
                const key = event.key.toLowerCase();
                if (key === "k" && (event.ctrlKey || event.metaKey) && event.shiftKey && !event.altKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    setUtility("commands");
                    return;
                }
                if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || tool !== "schedule") return;
                const action = commandActions.find(action => action.key === key && !action.disabled);
                if (!action) return;
                event.preventDefault();
                event.stopPropagation();
                action.run();
            }
            const compactToolbar = compact ? h("header", { className: styles["dshc-toolbar"] },
                h("h2", { className: styles["dshc-title"] }, t("section.title")),
                tool === "schedule" ? period : null,
                tool === "schedule" ? views : null,
                h("span", { className: styles["dshc-spacer"] }),
                h(Btn, { disabled: configured === null || toolBusy, onClick: () => setConnOpen(true) }, t("conn.button")),
                h(Btn, { disabled: demo || toolBusy, onClick: () => importOpen ? backToSchedule() : setTool("import") }, t("import.open")),
                h(Btn, { disabled: demo || configured !== true || toolBusy, onClick: () => availabilityOpen ? backToSchedule() : showAvailability() }, availabilityLabel),
                refresh,
                h(Btn, { variant: "primary", disabled: demo || toolBusy, onClick: () => createAt(anchor) }, t("action.new"))
            ) : null;
            const topbar = !compact ? h("header", { className: styles.topbar },
                h("div", { className: styles.brand },
                    h("span", { className: styles.brandMark }, h(CalendarIcon)),
                    h("h1", null, t("section.title"))
                ),
                h(Segments, {
                    id: workspaceId, label: t("section.title"), value: tool, disabled: toolBusy,
                    items: [
                        { value: "schedule", label: calendarText("日程", "Schedule") },
                        { value: "availability", label: availabilityLabel, disabled: demo || configured === null },
                        { value: "import", label: t("import.open"), disabled: demo },
                        { value: "connection", label: calendarText("日历连接", "CalDAV"), disabled: configured === null }
                    ],
                    onChange: next => next === "availability" ? showAvailability() : setTool(next)
                }),
                h("div", { className: styles.topActions },
                    h("span", { className: styles.zone }, Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"),
                    workbench ? h(Btn, {
                        className: styles.commandTrigger, icon: "search", disabled: toolBusy,
                        "aria-label": quickLabel, title: quickLabel + " (" + quickKey + ")",
                        onClick: () => setUtility("commands"), "aria-keyshortcuts": "Control+Shift+K Meta+Shift+K"
                    }, h("kbd", { className: styles.triggerKey }, quickKey)) : null,
                    h(Btn, { variant: "primary", icon: "plus", disabled: !canCreate, onClick: startDraft }, t("action.new")),
                    workbench ? h(CalendarLayoutPicker, { layout, options: layoutOptions, onChange: selectLayout }) : null,
                    workbench ? h(CalendarPalettePicker, { palette, dark, onChange: selectPalette }) : null
                )
            ) : null;

            const renderCalendar = () => {
                if (!demo && configured === false) {
                    return h(EmptyState, {
                        title: t("state.notConfigured"),
                        action: h(React.Fragment, null,
                            h(Btn, { variant: "primary", onClick: () => setConnOpen(true) }, t("conn.button")),
                            h(Btn, { onClick: () => setDemo(true) }, t("action.demo"))
                        )
                    }, h("p", null, t("state.notConfiguredHint")));
                }
                if (configured === null || (data.loading && data.events.length === 0)) {
                    return h("div", { className: styles["dshc-grid"], "aria-busy": true },
                        Array.from({ length: configured === null ? 7 : 14 }, (_, key) => h("div", { className: styles["dshc-skel"], key })));
                }
                const calendarProps = { anchor, events: visibleEvents, conflicted, onPick: openEvent, onCreateAt: createAt };
                const calendar = view === "week"
                    ? h(WeekView, { ...calendarProps, onReschedule: demo ? undefined : reschedule })
                    : view === "agenda" ? h(AgendaView, calendarProps) : h(MonthView, calendarProps);
                const message = !demo && !showCalendar
                    ? calendarText("当前日历已隐藏。", "The connected calendar is hidden.")
                    : !demo && view !== "agenda" && !data.loading && data.events.length === 0 && !data.error
                        ? calendarText("这段时间没有日程。点日期格或「新建日程」开始。", "Nothing scheduled in this range. Click a date or use New event.")
                        : null;
                return h(React.Fragment, null,
                    message ? h("p", { className: styles["dshc-emptyhint"], role: "status" }, message) : null,
                    calendar
                );
            };
            const schedule = tool === "schedule" ? h(ScheduleLayout, {
                resizable: workbench && !compact,
                rail: compact ? null : h(ScheduleRail, {
                    id: viewId + "-sidebar",
                    anchor, onPick: setAnchor, source, showing: showCalendar, onVisibilityChange: setShowCalendar,
                    conflicts, overlap, workbench, loading: configured === null,
                    onReviewConflicts: workbench ? reviewConflicts : undefined
                })
            },
                h("div", { className: styles.scheduleMain },
                    compact ? null : h("div", { className: styles.calendarToolbar }, period,
                        h("div", { className: styles.period }, views,
                            workbench && conflicts > 0 ? h(Btn, {
                                className: styles.toolbarConflicts, icon: "warning", onClick: reviewConflicts
                            }, calendarText("查看日程冲突", "Review conflicts")) : null,
                            refresh)),
                    data.error && !demo && configured !== false ? h("div", { className: clsx(styles["dshc-alert"], styles.error), role: "alert" },
                        backendMessage(data.error) || t("error.load"),
                        h("span", { className: styles["dshc-spacer"] }),
                        h(Btn, { onClick: reload }, t("action.retry"))
                    ) : null,
                    h("div", { className: styles.calendarSurface },
                        h("div", { id: viewId + "-" + view + "-panel", role: "tabpanel", "aria-labelledby": viewId + "-" + view }, renderCalendar())
                    ),
                    h("footer", { className: styles["dshc-footer"] },
                        h("span", null, t("count.events", { n: visibleEvents.length }) +
                            (visibleEvents.some(event => event.isOccurrence) ? " · " + t("count.occurrences", { n: visibleEvents.filter(event => event.isOccurrence).length }) : "")),
                        workbench ? h(CalendarShortcutHints, { quickKey }) : null,
                        compact && source ? h("span", null, t("conn.current", { summary: source })) : null
                    )
                )
            ) : null;
            const workspacePage = importOpen
                ? h(IcsImportPanel, { onBusy: setImportBusy, onClose: backToSchedule, onConnection: () => setConnOpen(true), onImported: reload })
                : availabilityOpen ? h(AvailabilityPanel, {
                    anchor, onBusy: setAvailabilityBusy, onClose: backToSchedule,
                    onChoose: slot => {
                        backToSchedule();
                        setAnchor(new Date(slot.start));
                        setConfirmDelete(false);
                        setFormError(null);
                        setDraft(draftOfEvent({ start: slot.start, end: slot.end, allDay: false }));
                    }
                }) : connectionOpen ? h(ConnectionForm, {
                    inline: true, connection: conn, onClose: backToSchedule, onSaved: finishConnection, onBusy: setConnectionBusy
                }) : schedule;
            const original = draft?.uid && !draft.isSeries ? data.events.find(event => event.uid === draft.uid) : undefined;
            const page = h("section", {
                ref: rootRef, className: clsx(styles["dshc-root"], workbench && LAYOUT_CLASSES[layout]),
                "data-main": workbench, "data-compact": compact, style: appearance,
                onPointerMove: workbench && layout === "spotlight" ? moveCalendarSpotlight : undefined,
                tabIndex: workbench ? 0 : undefined, onKeyDown: workbench ? onWorkbenchKeyDown : undefined
            },
                h("div", { className: styles["dshc-shell"] },
                    topbar, compactToolbar,
                    banner ? h("div", { className: styles["dshc-alert"], role: "status" }, banner) : null,
                    undo ? h("div", { className: styles["dshc-undo"], role: "status" },
                        h("span", null, t("move.saved") + " · " + (undo.summary || "")),
                        h(Btn, { onClick: undoMove }, t("move.undo"))
                    ) : null,
                    demo ? h("div", { className: clsx(styles["dshc-alert"], styles.demo) }, t("demo.banner")) : null,
                    compact ? workspacePage : h("div", { className: styles.workspacePanel,
                        id: workspaceId + "-" + tool + "-panel", role: "tabpanel", "aria-labelledby": workspaceId + "-" + tool
                    }, workspacePage, workbench && typeof __stardustUpdatesFooter === "function"
                        ? __stardustUpdatesFooter(React, "dsh-calendar") : null)
                ),
                selected ? h(EventReview, {
                    event: selected, readOnly: demo, events: data.events, busy, confirmDelete, setConfirmDelete,
                    onClose: closeReview, onEdit: editEvent, onDelete: remove
                }) : null,
                draft ? h(EventForm, {
                    draft, events: eventsWithMoves, busy, error: formError, source, original,
                    onCancel: closeDraft, onSubmit: submit, onDelete: remove, confirmDelete, setConfirmDelete
                }) : null,
                utility === "commands" ? h(CalendarCommands, { actions: commandActions, onClose: () => setUtility(null) }) : null,
                utility === "conflicts" ? h(CalendarConflicts, {
                    events: conflicted, onPick: openEvent, onClose: () => setUtility(null)
                }) : null,
                connOpen ? h(ConnectionForm, { connection: conn, onClose: () => setConnOpen(false), onSaved: finishConnection }) : null
            );
            return workbench ? h(getCalendarAppearanceContext().Provider, { value: appearance }, page) : page;
        }
        /** 月份平移：先跳到本月 1 号再加月，避免 1 月 31 日 +1 个月变成 3 月 3 日。 */
        function addMonthShift(date, delta) {
            const first = new Date(date.getFullYear(), date.getMonth(), 1);
            const shifted = new Date(first.getFullYear(), first.getMonth() + delta, 1);
            const lastDay = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
            return new Date(shifted.getFullYear(), shifted.getMonth(), Math.min(date.getDate(), lastDay));
        }
        /** 设置页里的那一节。 */
        function CalendarSection({ workbench = false } = {}) { return h(CalendarPanel, { workbench }); }
        /** 对话页右下角的小按钮 + 悬浮面板（自己挂 root，不占用宿主槽位）。 */
        function Launcher() {
            const [activePanel, setActivePanel] = useState(null);
            useEffect(() => {
                let layout;
                try { layout = calendarHostContext?.get?.("layout") || calendarHostContext?.layout; } catch {}
                const panelInfo = layout?.panelInfo;
                if (!panelInfo) return;
                const update = () => setActivePanel(panelInfo.getSnapshot().activePanelId);
                update();
                return panelInfo.subscribe(update);
            }, []);
            useUILanguage();
            const [open, setOpen] = useState(false);
            const [layerOpen, setLayerOpen] = useState(false);
            useEffect(() => {
                if (open !== true)
                    return () => { };
                const onKey = (event) => {
                    if (event.key !== "Escape" || event.isComposing === true || event.defaultPrevented)
                        return;
                    // 浮层交给 CalendarPanel 的层栈；宿主 Portal 的 Esc 交给宿主组件。
                    if (layerOpen === true)
                        return;
                    setOpen(false);
                };
                document.addEventListener("keydown", onKey);
                return () => document.removeEventListener("keydown", onKey);
            }, [open, layerOpen]);
            if (activePanel) return null;
            return h("div", null,
                h("button", {
                    type: "button",
                    className: styles["dshc-fab"],
                    "aria-expanded": open,
                    title: t("nav.title"),
                    "aria-label": t("nav.title"),
                    onClick: () => setOpen((value) => !value)
                }, h(CalendarIcon, { size: 18 })),
                open === true ? h("div", { className: styles["dshc-float"] }, h(CalendarPanel, { compact: true, onLayerChange: setLayerOpen })) : null
            );
        }
        // ───────────────────────────── 挂载 ─────────────────────────────
        const inject = ["slots", "locale"];
        function apply(ctx) {
            calendarHostContext = ctx;
            const id = "dsh-calendar.workbench";
            ctx.slots.inject("main", () => ctx.slots.register({
                name: "main", key: id, inject: () => ({ workbench: true })
            }, CalendarSection));
            ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
                name: "sidebar.panellist", id, order: 58, label: () => t("nav.title")
            }, CalendarIcon));

            // 语言要在任何 t() 之前定下来（与 dsh-email 同款契约）。
            try {
                ctx.effect(() => subscribeLocale(ctx), "dsh-calendar: locale");
            }
            catch (e) { /* 没有 effect 的宿主不该拖垮面板 */ }
            try {
                ctx.effect(() => {
                    const id = "dsh-calendar/client";
                    if (document.querySelector('style[data-plugin-css="' + id + '"]'))
                        return () => { };
                    const style = document.createElement("style");
                    style.dataset.plugin = "dsh-calendar";
                    style.dataset.pluginCss = id;
                    style.textContent = CSS;
                    document.head.appendChild(style);
                    return () => { style.remove(); };
                }, "dsh-calendar: styles");
            }
            catch (e) { /* 无 DOM 环境（纯 node 侧冒烟）时跳过 */ }
            try {
                ctx.slots.inject("settings.section", () => ctx.slots.register({
                    name: "settings.section",
                    id: "dsh-calendar",
                    order: 50,
                    label: () => {
                        let lang = UI_LANG;
                        try {
                            if (activeLocaleService?.getSnapshot)
                                lang = localeToLang(activeLocaleService.getSnapshot().active);
                        }
                        catch { }
                        return UI[lang]["nav.title"];
                    },
                    inject: () => ({})
                }, CalendarSection));
            }
            catch (e) { /* 没有 slots 服务：仍是合法的插件，只是没有设置页 */ }
            try {
                ctx.effect(() => mountLauncher(), "dsh-calendar: floating panel");
            }
            catch (e) { /* 同上 */ }
        }
        /** 把悬浮面板挂到页面上；已经挂过（HMR / 重复 apply）就复用。 */
        function mountLauncher() {
            if (typeof document === "undefined" || document.body === null)
                return () => { };
            if (document.getElementById("dsh-calendar-root") !== null)
                return () => { };
            const host = document.createElement("div");
            host.id = "dsh-calendar-root";
            document.body.appendChild(host);
            let root = null;
            try {
                const ReactDomClient = require("react-dom/client");
                root = ReactDomClient.createRoot(host);
                root.render(h(Launcher, {}));
            }
            catch (e) {
                // 老宿主没有 react-dom/client 时不要静默留下一个空气泡：整个按钮一起撤掉。
                host.remove();
                return () => { };
            }
            return () => {
                try {
                    if (root !== null)
                        root.unmount();
                }
                catch (e) { /* 卸载失败也要把节点摘掉 */ }
                host.remove();
            };
        }
        relocalize = () => { for (const update of languageListeners)
            update(); };
        exports.apply = apply;
        exports.inject = inject;
        return module.exports;
    } },{"name":"dsh-calendar","version":"0.1.0","hasWorkbench":true,"packageVersion":"0.16.1","label":"日历","labelEn":"Calendar","suiteComponent":true,"sectionIds":["dsh-calendar"],"iconData":"data:image/webp;base64,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"}));

})();

/* STARDUSTLC_UPDATE_CLIENT_BODY_END */
})();
