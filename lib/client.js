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
      h('style', null, styles),
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
    return h('div', { className: cx('w-status', 'w-status-' + tone, className), role: tone === 'error' ? 'alert' : 'status', 'aria-live': tone === 'error' ? 'assertive' : 'polite' }, h(Icon, { name: tone === 'success' ? 'check' : 'info', size: 18 }), h('div', null, children));
  }
  function Empty({ title, children, action, icon = 'file' }) {
    return h('div', { className: 'w-empty' }, h(Icon, { name: icon, size: 32 }), h('h2', null, title), children ? h('div', { className: 'w-muted' }, children) : null, action ? h('div', { className: 'w-toolbar' }, action) : null);
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
    return h('div', { className: 'w-overlay', onClick: event => { if (!busy && event.target === event.currentTarget) onClose(); } },
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
.dshw{--w-bg:var(--dsw-alias-bg-layer-1,#fff);--w-soft:var(--dsw-alias-bg-layer-2,#f7f8fa);--w-text:var(--dsw-alias-label-primary,#18202c);--w-muted:var(--dsw-alias-label-secondary,#667085);--w-border:var(--dsw-alias-border-l3,#e7e9ef);--w-accent:var(--dsh-plugin-workbench-accent,#4f6bdb);--w-selected:color-mix(in srgb,var(--w-accent) 10%,var(--w-bg));--w-primary:var(--w-text);--w-on-primary:var(--w-bg);container-type:inline-size;container-name:dsh-workbench;color:var(--w-text);background:var(--w-bg);font:14px/1.65 var(--dsh-font-family-content,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif);min-width:0;max-width:100%;box-sizing:border-box;text-align:start;color-scheme:inherit}
.dshw *,.dshw *:before,.dshw *:after{box-sizing:border-box}.dshw h1,.dshw h2,.dshw h3,.dshw h4,.dshw p{margin:0}.dshw h1{font-size:30px;line-height:1.25;letter-spacing:-.025em;font-weight:650}.dshw h2{font-size:24px;line-height:1.35;font-weight:650;letter-spacing:-.015em;overflow-wrap:anywhere}.dshw h3,.dshw h4{font-size:16px;line-height:1.4;font-weight:600}.dshw a{color:var(--w-accent);text-underline-offset:3px;overflow-wrap:anywhere}.dshw button,.dshw input,.dshw select,.dshw textarea{font:inherit;color:inherit;max-width:100%}.dshw input:not([type=checkbox]):not([type=radio]):not([type=file]),.dshw select,.dshw textarea{background:var(--w-bg);border:1px solid var(--w-border);border-radius:8px;padding:8px 11px;min-width:0;line-height:1.5}.dshw input:not([type=checkbox]):not([type=radio]):not([type=file]),.dshw select{min-height:38px}.dshw textarea{resize:vertical}.dshw input[type=checkbox],.dshw input[type=radio]{width:16px;height:16px;flex-shrink:0;accent-color:var(--w-accent)}.dshw :focus-visible{outline:2px solid var(--w-accent);outline-offset:3px}.dshw button:disabled,.dshw input:disabled,.dshw select:disabled,.dshw textarea:disabled{opacity:.5;cursor:not-allowed}.dshw label{font-size:13px}.dshw fieldset{min-width:0;border:1px solid var(--w-border);border-radius:8px}.dshw summary{cursor:pointer;font-weight:550;list-style:none;display:flex;align-items:center;gap:8px}.dshw summary::-webkit-details-marker{display:none}.dshw summary:after{content:'';display:block;margin-inline-start:auto;width:7px;height:7px;border-inline-end:1.75px solid currentColor;border-bottom:1.75px solid currentColor;transform:rotate(45deg);flex-shrink:0}.dshw details[open]>summary:after{transform:rotate(225deg)}.dshw details>summary+*{margin-top:12px}.dshw pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;max-width:100%;background:var(--w-soft);border-radius:6px;padding:14px}.dshw img,.dshw video,.dshw iframe{max-width:100%}
.w-page{display:flex;flex-direction:column;position:relative;padding:0;min-height:540px;gap:0}.w-page[data-main=true]{height:100%;min-height:0;padding:calc(24px + var(--dsh-frame-top-clearance,0px)) 28px 0 max(28px,var(--dsh-frame-leading-clearance,0px));overflow:auto}.w-page-header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding-bottom:22px;flex-shrink:0}.w-heading{min-width:0}.w-subtitle{margin-top:8px!important;font-size:14px;color:var(--w-muted);line-height:1.6}.w-header-actions,.w-toolbar,.w-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}.w-header-actions{justify-content:flex-end}.w-body,.w-tabs-layout{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}.w-body{overflow:auto}.w-tab-panel{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:auto}.w-tabs{display:flex;align-items:stretch;gap:20px;border-bottom:1px solid var(--w-border);flex-shrink:0;overflow-x:auto;scrollbar-width:thin}.dshw .w-tabs>button{border:0;border-bottom:2px solid transparent;background:transparent;padding:11px 8px 13px;white-space:nowrap;font-size:14px;font-weight:550;cursor:pointer;color:var(--w-muted);display:flex;align-items:center;gap:7px}.dshw .w-tabs>button[aria-selected=true]{border-bottom-color:var(--w-accent);color:var(--w-accent)}.w-count,.w-tag{font-size:12px;line-height:1.5;display:inline-flex;align-items:center;flex-shrink:0;background:var(--w-soft);border-radius:5px;padding:1px 6px;color:var(--w-muted)}.w-tabs [aria-selected=true] .w-count,.w-selected .w-tag{color:var(--w-accent);background:var(--w-selected)}
.dshw .w-button{display:inline-flex;justify-content:center;align-items:center;gap:7px;background:var(--w-bg);border:1px solid var(--w-border);border-radius:8px;padding:8px 12px;min-height:36px;line-height:1.4;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;white-space:normal}.dshw .w-button:not(:disabled):hover{background:var(--w-soft)}.dshw .w-primary{background:var(--w-primary);border-color:var(--w-primary);color:var(--w-on-primary)}.dshw .w-primary:not(:disabled):hover{background:var(--w-primary);opacity:.9}.dshw .w-ghost{background:transparent;border-color:transparent}.dshw .w-danger{color:var(--dsw-alias-state-error-primary,#b43c3c)}.dshw .w-icon-button{width:36px;min-width:36px;padding:8px}.dshw .w-button svg{flex-shrink:0}.w-muted{color:var(--w-muted);font-size:12px;line-height:1.6}.w-section{padding:24px 0;border-bottom:1px solid var(--w-border);min-width:0}.w-section>h3{margin-bottom:12px}.w-section>p+p{margin-top:8px}.w-fields{display:grid;gap:16px;min-width:0}.w-field{display:grid;gap:6px;min-width:0}.w-field>input,.w-field>select,.w-field>textarea{width:100%}.w-status{display:flex;align-items:flex-start;gap:8px;padding:11px 13px;margin:12px 0;border:1px solid var(--w-border);border-radius:8px;background:var(--w-soft);font-size:13px;overflow-wrap:anywhere;flex-shrink:0}.w-status>svg{flex-shrink:0;margin-top:2px}.w-status-error{color:var(--dsw-alias-state-error-primary,#ad3636)}.w-status-success{color:var(--dsw-alias-state-success-primary,#24794a)}.w-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;max-width:580px;padding:48px 24px;margin:auto;min-height:280px;overflow-wrap:anywhere}.w-empty>svg{color:var(--w-muted)}.w-empty h2{font-size:20px}.w-empty .w-muted{font-size:14px}.w-empty .w-toolbar{justify-content:center}
.w-split{display:grid;grid-template-columns:minmax(240px,var(--w-list-width)) minmax(0,1fr);min-height:460px;flex:1;min-width:0}.w-master{min-width:0;border-inline-end:1px solid var(--w-border);overflow:auto;padding-bottom:24px}.w-detail{min-width:0;padding:26px 28px;overflow:auto;overflow-wrap:anywhere;display:flex;flex-direction:column}.w-master-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:20px 16px}.w-search{display:flex;align-items:center;gap:8px;border:1px solid var(--w-border);border-radius:8px;padding:0 10px;min-width:0;flex:1;background:var(--w-bg)}.w-search>svg{color:var(--w-muted);flex-shrink:0}.dshw .w-search>input{border:0!important;background:transparent!important;padding:8px 0!important;width:100%;outline-offset:0}.w-row{display:flex;gap:0;min-width:0;position:relative;border-bottom:1px solid var(--w-border);border-inline-start:3px solid transparent}.w-row-select{display:flex;align-items:flex-start;padding:21px 0 0 14px}.dshw .w-row-button{display:flex;flex-direction:column;align-items:stretch;gap:7px;text-align:start;width:100%;padding:18px 18px 18px 16px;border:0;background:transparent;color:inherit;min-width:0;cursor:pointer;line-height:1.5}.dshw .w-row-button:hover{background:var(--w-soft)}.w-row-head{display:flex;align-items:flex-start;gap:10px;justify-content:space-between;min-width:0}.w-row-head>strong{font-size:14px;line-height:1.5;font-weight:600;overflow-wrap:anywhere}.w-row-meta,.w-row-description{color:var(--w-muted);font-size:12px;line-height:1.6;overflow-wrap:anywhere}.w-row-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.w-selected{background:var(--w-selected);border-inline-start-color:var(--w-accent)}.w-back{display:none!important}.w-detail-title{margin-bottom:12px!important}.w-detail-meta{color:var(--w-muted);font-size:13px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.w-detail-footer{padding:24px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:auto;border-top:1px solid var(--w-border)}.w-detail-footer .w-muted{flex:1;min-width:160px}.w-definition{display:grid;grid-template-columns:minmax(80px,120px) minmax(0,1fr);gap:8px 16px;font-size:14px;margin:20px 0}.w-definition dt{color:var(--w-muted)}.w-definition dd{margin:0;min-width:0;overflow-wrap:anywhere}
.w-switch-label{display:inline-flex;align-items:center;gap:8px;font-size:13px;position:relative;cursor:pointer}.w-switch-label>input{position:absolute;opacity:0;inset-inline-end:0;width:36px!important;height:22px!important;margin:0;cursor:pointer}.w-switch-track{width:36px;height:22px;border-radius:12px;display:block;background:var(--w-border);border:1px solid var(--w-border);pointer-events:none;padding:2px;transition:background .15s}.w-switch-track:before{content:'';display:block;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0002;transition:transform .15s}.w-switch-label>input:checked+.w-switch-track{background:var(--w-accent);border-color:var(--w-accent)}.w-switch-label>input:checked+.w-switch-track:before{transform:translateX(14px)}.w-switch-label>input:focus-visible+.w-switch-track{outline:2px solid var(--w-accent);outline-offset:3px}.w-switch-label:has(>input:disabled){opacity:.5;cursor:not-allowed}
.w-overlay{position:fixed;inset:0;background:#0005;display:flex;justify-content:flex-end;z-index:1000;padding:12px;overflow:auto}.w-dialog{width:min(620px,100%);max-height:100%;display:flex;flex-direction:column;min-height:0;background:var(--w-bg);color:var(--w-text);border:1px solid var(--w-border);border-radius:12px;box-shadow:0 18px 70px #0003}.w-dialog-header{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid var(--w-border);flex-shrink:0}.w-dialog-header>h2{font-size:20px}.w-dialog-body{overflow:auto;padding:20px 24px;min-height:0}.w-editor-grid{display:grid;grid-template-columns:210px minmax(0,1fr) 300px;min-height:500px;flex:1}.w-editor-list{padding:20px 12px;border-inline-end:1px solid var(--w-border);min-width:0}.w-editor-canvas{background:var(--w-soft);padding:20px;min-width:0;display:flex;flex-direction:column;gap:14px}.w-editor-inspector{padding:24px;border-inline-start:1px solid var(--w-border);min-width:0;overflow:auto}.w-editor-inspector h3{margin-bottom:18px}.w-preview-empty{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:12px;aspect-ratio:16/9;min-height:180px;background:var(--w-soft);border:1px solid var(--w-border);border-radius:8px;padding:24px;color:var(--w-muted)}.w-content-pad{padding:24px 0}.w-stack{display:flex;flex-direction:column;gap:16px;min-width:0}.w-scroll-x{overflow:auto;max-width:100%}
@container dsh-workbench (max-width:1000px){.w-editor-grid{grid-template-columns:160px minmax(0,1fr)}.w-editor-inspector{grid-column:1/-1;border-inline-start:0;border-top:1px solid var(--w-border)}.w-header-actions{max-width:60%}.w-split{grid-template-columns:minmax(240px,32%) minmax(0,1fr)}}
@container dsh-workbench (max-width:760px){.w-page-header{gap:14px;flex-wrap:wrap;padding-bottom:18px}.w-heading{flex:1;min-width:170px}.dshw h1{font-size:24px}.w-header-actions{max-width:100%;justify-content:flex-start}.w-subtitle{font-size:13px}.w-tabs{gap:12px}.dshw .w-tabs>button{padding:10px 4px 12px}.w-split{display:block;min-height:360px}.w-split[data-selected=false]>.w-detail{display:none}.w-split[data-selected=true]>.w-master{display:none}.w-master{border-inline-end:0}.w-detail{padding:20px 0}.w-back{display:inline-flex!important;align-self:flex-start;margin:0 0 16px!important}.w-detail h2{font-size:22px}.w-master-toolbar{padding:16px 0}.dshw .w-row-button{padding:16px 10px}.w-detail-footer{position:static}.w-detail-footer .w-muted{flex-basis:100%}.w-editor-grid{display:flex;flex-direction:column}.w-editor-list{border-inline-end:0;border-bottom:1px solid var(--w-border);padding:16px 0}.w-editor-canvas{padding:16px 0;background:var(--w-bg)}.w-editor-inspector{padding:20px 0}.w-dialog-header,.w-dialog-body{padding:16px}.w-button{min-height:40px}.w-definition{grid-template-columns:80px minmax(0,1fr)}}
@media(max-width:700px){.w-page[data-main=true]{padding:calc(16px + var(--dsh-frame-top-clearance,0px)) 16px 0 max(16px,var(--dsh-frame-leading-clearance,0px))}.w-overlay{padding:8px}.w-dialog{width:100%}}
@media(prefers-reduced-motion:reduce){.dshw *,.dshw *:before{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;
  return { Icon, Button, IconButton, Page, Tabs, Status, Empty, Split, Row, Search, Switch, Dialog, register, styles };
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
  const client = [...pool.clients].find(client => client.has(name));
  if (!client) return null;
  return React.createElement(client.Footer, { name });
}
function __stardustUpdatesInlinePage(React, element, name) {
  return React.cloneElement(element, null, element.props.children, React.createElement(__StardustPluginUpdatesFooter, { key: 'plugin-updates', React, name }));
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
  // The official manager lists top-level dependencies, not Suite's transitive
  // components. Project active, build-identified clients for display only.
  // Installation and preferences still use the real Suite row from the host.
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
    record = { refs: new Map(), timer: null, version: participant.version, alive: true, hold: false };
    pools.set(root, record);
    const shared = record;
    record.fiber = root.plugin({ name: 'stardustlc-plugin-updates-client', inject: ['slots', 'locale', 'remote', 'remote.pluginManager'], apply(ctx) {
      const client = __stardustUpdatesClient(ctx, React, require, shared);
      ctx.effect(() => () => { shared.alive = false; client.dispose(); if (pools.get(root) === shared) pools.delete(root); });
    } });
    Promise.resolve(record.fiber).catch(() => { shared.alive = false; if (pools.get(root) === shared) pools.delete(root); });
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
function __stardustUpdatesClient(ctx, React, require, shared) {
  const h = React.createElement, W = createWorkbenchUI(React), route = new URL('api/stardustlc/plugin-updates', document.baseURI);
  const { useState, useEffect } = React, id = crypto.randomUUID(), listeners = new Set(), pool = __stardustUpdatesGuards(), requests = new Set(), notified = new Set(), knownRows = new Map();
  let alive = true, registered = false, state = null, lastInteraction = Date.now(), inPoll = false, manualOperation = false;
  const language = () => String(ctx.locale?.getSnapshot?.().active || '').startsWith('en') ? 'en' : 'zh';
  const t = (zh, en) => language() === 'en' ? en : zh;
  const preferences = name => state?.preferences.packages[name] || { checkEnabled: true, autoInstall: false, deferredUntil: 0, ignoredVersion: null };
  const originalRow = name => state?.rows.find(row => row.name === name);
  const rowFor = name => { const row = originalRow(name); return row?.bundledBy ? originalRow(row.bundledBy) : row; };
  const activeJob = () => ['verifying', 'installing', 'cancelling'].includes(state?.job?.state);
  function notify() { shared.hold = manualOperation || activeJob(); for (const listener of listeners) listener(); for (const listener of pool.viewListeners) listener(); }
  async function api(body = { action: 'state' }) {
    const controller = new AbortController(); requests.add(controller);
    const timeout = setTimeout(() => controller.abort(), body.action === 'check' ? 95000 : 45000);
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
      'managed-by-suite': t('这个插件随 Suite 安装，通过 Suite 更新。', 'This plugin was installed through Suite and is updated through Suite.'),
      'owner-required': t('只有 profile 拥有者能管理更新。', 'Only the profile owner can manage updates.'),
    })[code] || t('操作未完成，请刷新后重试。DSH 不会因此自动重启。', 'The operation could not be completed. Refresh and retry. DSH will not restart automatically.');
  }
  function jobLabel(job) {
    return ({ verifying: t('正在核对版本', 'Verifying release'), installing: t('正在安装', 'Installing'), cancelling: t('正在请求取消', 'Requesting cancellation'), complete: t('已更新', 'Updated'), 'restart-required': t('已安装，等待你手动重启', 'Installed; manual restart needed'), restored: t('更新未成功，已恢复原版本', 'Update failed; previous version restored'), 'restore-failed': t('恢复未成功，请检查官方插件管理', 'Recovery failed; check native plugin management'), unknown: t('结果未确认，请检查官方插件管理', 'Result unconfirmed; check native plugin management'), cancelled: t('已取消', 'Cancelled'), failed: t('更新未成功', 'Update failed') })[job.state] || job.state;
  }
  function FooterFrame({ name, label, subtitle, actions, children }) {
    return h('section', { className: 'dshw plugin-updates-footer', 'data-plugin-update-footer': name, 'aria-label': label + t(' · 版本与更新', ' · Version and updates') },
      h('style', null, W.styles),
      h('style', null, '.plugin-updates-footer{box-sizing:border-box;flex-shrink:0;margin-top:28px;padding-top:18px;border-top:1px solid var(--dsw-alias-border-l3,#e5e7eb);min-width:0;max-width:100%;color:var(--dsw-alias-label-primary,#202124)}.plugin-updates-footer .updates-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px}.plugin-updates-footer h2{font-size:14px;line-height:22px;margin:0;font-weight:600}.plugin-updates-footer .updates-subtitle,.plugin-updates-footer .updates-version{font:12px/1.6 ui-monospace,monospace;overflow-wrap:anywhere;margin:4px 0}.plugin-updates-footer .updates-options{margin-top:12px}.plugin-updates-footer .updates-options>summary{cursor:pointer;font-size:12px;line-height:22px;color:var(--dsw-alias-label-secondary,#657080)}.plugin-updates-footer .updates-options>summary:focus-visible{outline:2px solid var(--dsw-focus-ring-color,#6b79df);outline-offset:4px}.plugin-updates-footer .updates-settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;padding:14px 0 0}.plugin-updates-footer .updates-note{margin:5px 0 0;font-size:12px;line-height:1.6}.plugin-updates-footer>.w-section{margin:10px 0 0;padding:0;border:0}.plugin-updates-footer .w-toolbar{margin-top:10px!important}.plugin-updates-footer .w-switch-label{max-width:100%;gap:12px;align-items:flex-start}.plugin-updates-footer .w-switch-track{flex-shrink:0}.plugin-updates-footer .updates-notes{margin-top:12px;padding:12px;border:1px solid var(--dsw-alias-border-l3,#e5e7eb);border-radius:10px}.plugin-updates-footer .updates-notes pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:240px;overflow:auto;font:12px/1.7 ui-monospace,monospace}.plugin-updates-footer .w-overlay{z-index:1002}@media(max-width:600px){.plugin-updates-footer .updates-head{gap:8px}.plugin-updates-footer .w-toolbar{gap:6px;flex-wrap:wrap}.plugin-updates-footer .w-button{max-width:100%}}'),
      h('div', { className: 'updates-head' }, h('div', null, h('h2', null, t('版本与更新', 'Version and updates')), h('p', { className: 'updates-subtitle w-muted' }, subtitle)), actions), children);
  }
  function Panel({ name }) {
    const snapshot = useSnapshot(), [error, setError] = useState(''), [working, setWorking] = useState(false), [checking, setChecking] = useState(false), [dialog, setDialog] = useState(null), [notes, setNotes] = useState(null), [notesOpen, setNotesOpen] = useState(false), [loadingNotes, setLoadingNotes] = useState(false);
    const row = rowFor(name), original = originalRow(name), target = row?.name || name, prefs = preferences(target), job = snapshot?.job?.name === target ? snapshot.job : null;
    async function perform(callback) { setError(''); setWorking(true); try { await callback(); await refresh(); } catch (error) { setError(error.message); await refresh().catch(() => {}); } finally { setWorking(false); } }
    async function save(changes, consent) { await api({ action: 'preferences', name: target, revision: state.preferences.revision, changes, consent }); }
    async function check() { setError(''); setChecking(true); try { await api({ action: 'check', name: target }); await refresh(); } catch (error) { setError(error.message); } finally { setChecking(false); } }
    async function install() {
      setDialog(null); manualOperation = true; notify();
      await perform(async () => {
        try {
          await heartbeat();
          const started = await api({ action: 'install', name: row.name, version: row.release.version, confirmation: 'update-installed-plugin' });
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
    if (!snapshot || !row) return h(W.Status, null, t('此插件尚未安装或已从当前 profile 移除。', 'This plugin is not installed in the current profile.'));
    const title = language() === 'en' ? original.labelEn : original.label;
    const ownPage = pageState(true), unconfirmed = ['unknown', 'restore-failed'].includes(snapshot.job?.state), pageBusy = ownPage.busy || (snapshot.pages.clients || []).some(client => client.id !== id && client.busy), installLocked = working || activeJob() || unconfirmed || snapshot.updaterRestart || snapshot.preferenceError || !snapshot.activity.known || snapshot.activity.busy || snapshot.pages.dirty || ownPage.dirty || pageBusy || !snapshot.pages.known;
    const checkingThis = checking || snapshot.checkingNames?.includes(target);
    const status = row.sourceKind !== 'registry' ? t('本地 / 外部来源，保留原安装方式', 'Local / external source; keep original install method') : row.loadError ? t('加载异常，请先检查官方插件管理', 'Loading error; check native plugin management') : row.error ? t('检查失败，可以重试', 'Check failed; retry available') : row.release && !row.release.compatible ? t('新版本暂不兼容当前环境', 'Latest release is incompatible with this environment') : row.available ? (prefs.ignoredVersion === row.release.version ? t('已忽略提醒，仍可手动更新', 'Reminder ignored; manual update available') : t('有新版本', 'Update available')) : row.checkedAt ? t('当前已是最新稳定版', 'Latest stable version') : t('尚未检查', 'Not checked yet');
    return h(FooterFrame, { name, label: title, subtitle: original.name + ' · ' + original.version, actions: h(W.Button, { icon: 'refresh', disabled: checkingThis || row.sourceKind !== 'registry', onClick: check }, checkingThis ? t('正在检查…', 'Checking…') : target === '@stardustlc/dsh-suite' ? t('检查整包更新', 'Check Suite updates') : t('检查更新', 'Check for updates')) },
      original.bundledBy && h(W.Status, null, t('此插件随 Suite 安装。以下设置与安装作用于 Suite 整包，以保持组件版本一致。单独安装的插件可以独立更新。', 'This plugin was installed through Suite. These controls update Suite as a package so its components stay consistent. Independently installed plugins update individually.')),
      h('section', { className: 'w-section' }, (original.bundledBy || row.available) && h('p', { className: 'updates-version' }, target + ' · ' + row.version, row.release?.version && row.release.version !== row.version ? ' → ' + row.release.version : ''), h('p', { className: 'w-muted updates-note' }, status), !row.enabled && h('p', { className: 'w-muted' }, t('当前已停用，更新后仍保持停用。', 'Currently disabled; it will remain disabled after updating.')), row.checkedAt && h('p', { className: 'w-muted updates-note' }, t('上次检查：', 'Last checked: ') + new Date(row.checkedAt).toLocaleString(language() === 'en' ? 'en-US' : 'zh-CN')),
        h('div', { className: 'w-toolbar' }, row.available && row.sourceKind === 'registry' && h(W.Button, { variant: 'primary', icon: 'download', disabled: installLocked || row.loadError, onClick: () => setDialog('install') }, target === '@stardustlc/dsh-suite' ? t('更新 Suite 整包', 'Update whole Suite') : t('更新此插件', 'Update this plugin')), row.release && h(W.Button, { variant: 'ghost', onClick: showNotes, 'aria-expanded': notesOpen }, t('更新记录', 'Release notes')), row.available && h(W.Button, { variant: 'ghost', disabled: working, onClick: () => perform(() => api({ action: 'later', name: target, revision: state.preferences.revision })) }, t('明天再提醒', 'Remind me tomorrow')), row.available && prefs.ignoredVersion !== row.release.version && h(W.Button, { variant: 'ghost', disabled: working, onClick: () => perform(() => api({ action: 'ignore', name: target, revision: state.preferences.revision, version: row.release.version })) }, t('忽略此版本提醒', 'Ignore this reminder')))),
      notesOpen && h('section', { className: 'updates-notes', 'aria-label': t('更新记录', 'Release notes') }, h('strong', null, target + ' · ' + (notes?.version || row.release?.version || '')), loadingNotes ? h('p', null, t('正在读取…', 'Loading…')) : notes?.text ? h('pre', null, notes.text) : h('p', null, t('未找到此版本的独立更新记录。', 'No separate notes were found for this version.')), notes?.url && h('a', { href: notes.url, target: '_blank', rel: 'noreferrer noopener' }, t('查看仓库更新记录', 'View repository changelog'))),
      h('details', { className: 'updates-options' }, h('summary', null, t('更新选项', 'Update options'), ' · ', prefs.checkEnabled ? t('自动检查：开', 'Checks: on') : t('自动检查：关', 'Checks: off'), ' · ', prefs.autoInstall ? t('自动安装：开', 'Install: on') : t('自动安装：关', 'Install: off')), h('section', { className: 'updates-settings', 'aria-label': t('这个插件的更新偏好', 'Update preferences for this plugin') },
        h('div', null, h(W.Switch, { label: t('自动检查这个插件的更新', 'Automatically check this plugin'), checked: prefs.checkEnabled, disabled: working || !!snapshot.preferenceError || row.sourceKind !== 'registry', onChange: event => perform(() => save({ checkEnabled: event.target.checked })) }), h('p', { className: 'w-muted updates-note' }, t('默认开启，每天最多一次。只影响这个插件，关闭后仍可手动检查。', 'On by default, at most once daily. This affects only this plugin; manual checks remain available.'))),
        h('div', null, h(W.Switch, { label: t('空闲时自动安装这个插件的补丁', 'Install patches for this plugin while idle'), checked: prefs.autoInstall, disabled: working || !!snapshot.preferenceError || row.sourceKind !== 'registry', onChange: event => event.target.checked ? setDialog('automatic') : perform(() => save({ autoInstall: false })) }), h('p', { className: 'w-muted updates-note' }, t('默认关闭。明确开启后，仅空闲且没有未保存修改时安装兼容补丁。其他插件的开关不变。', 'Off by default. Explicitly enable compatible patches while idle with no unsaved changes. Other plugins’ settings stay unchanged.'))))),
      error && h(W.Status, { tone: 'error' }, message(error)), snapshot.preferenceError && h(W.Status, { tone: 'error' }, message('preferences-unreadable')),
      snapshot.pendingRestart && h(W.Status, null, snapshot.updaterRestart ? message('restart-required') : t('已有更新等待手动重启后生效。你可以继续工作，自动安装已暂停。', 'Some updates need a manual restart. Continue your work; automatic installation is paused.')),
      prefs.autoInstall && snapshot.autoReady === false && h(W.Status, null, message('page-not-ready')),
      snapshot.pages.clients.some(client => !client.fresh) && h(W.Status, null, h('p', null, t('有窗口已断开，无法确认是否还有未保存修改。仍在使用的窗口请先保存并刷新；已关闭的窗口可以手动重新确认。', 'A disconnected window may contain unsaved changes. Save and refresh windows still in use. If they are closed, you can confirm that manually.')), h(W.Button, { onClick: () => setDialog('windows') }, t('重新确认已关闭的窗口', 'Confirm closed windows'))),
      (snapshot.pages.dirty || ownPage.dirty) && h(W.Status, null, message('page-dirty')), (snapshot.activity.busy || pageBusy) && h(W.Status, null, message(snapshot.activity.busy ? 'busy' : 'page-busy')),
      prefs.deferredUntil > Date.now() && h(W.Status, null, t('此插件已推迟提醒和自动安装 24 小时，仍可手动更新。', 'Reminders and automatic installation for this plugin are deferred for 24 hours. Manual updates remain available.')),
      unconfirmed && h(W.Status, { tone: 'error' }, message('operation-unconfirmed')),
      job && h('section', { className: 'w-section', 'aria-label': t('这个插件的更新进度', 'Update progress for this plugin') }, h('h3', null, jobLabel(job)), h('p', { className: 'w-muted' }, job.from + ' → ' + job.to + (job.mode === 'automatic' ? t(' · 自动补丁更新', ' · Automatic patch') : '')), (job.reason || job.outcome?.result?.error?.code) && h(W.Status, { tone: 'error' }, message(job.reason || job.outcome.result.error.code)), activeJob() && h(W.Button, { disabled: job.state === 'cancelling', onClick: () => perform(() => api({ action: 'cancel', id: job.id })) }, t('取消更新', 'Cancel update')), h('p', { className: 'w-muted updates-note' }, t('安装开始后，取消由官方包管理器处理；已落盘的写入以实际结果或恢复状态为准。', 'After installation starts, the native package manager handles cancellation. Completed writes and recovery are reported as they occur.'))),
      dialog && h(W.Dialog, { title: dialog === 'windows' ? t('断开的窗口都已关闭？', 'Are the disconnected windows closed?') : dialog === 'automatic' ? t('允许这个插件自动安装补丁？', 'Allow automatic patches for this plugin?') : t('确认更新此插件', 'Confirm this plugin update'), closeLabel: t('关闭', 'Close'), onClose: () => setDialog(null) },
        target === '@stardustlc/dsh-suite' && h('p', null, t('此处操作的是 Suite 整包，包含 18 个组件。独立安装的其他插件不受影响。', 'This action applies to the whole Suite, including its 18 components. Other independently installed plugins are unaffected.')),
        dialog === 'windows' ? h('div', { className: 'w-stack' }, h('p', null, t('只清除超过 45 秒未回应的其他窗口记录。请先确认它们已经关闭；仍在使用的窗口请保存修改并刷新。当前或仍在回应的窗口保护会保留。', 'Only other windows silent for over 45 seconds are cleared. Confirm that they are closed; save and refresh windows still in use. Current and responsive windows remain protected.')), h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('取消', 'Cancel')), h(W.Button, { onClick: () => { setDialog(null); void perform(() => api({ ...pageState(true), action: 'reconfirm-windows', confirmation: 'other-stale-windows-are-closed' })); } }, t('已关闭，重新确认状态', 'They are closed; reconfirm')))) :
        dialog === 'automatic' ? h('div', { className: 'w-stack' }, h('p', null, (language() === 'en' ? row.labelEn : row.label) + ' · ' + target), h('p', null, t('你正在主动启用这个插件的自动安装。只处理兼容的稳定补丁；有任务、未保存修改、未知窗口或等待重启时暂停。', 'You are explicitly enabling automatic installation for this plugin. Only compatible stable patches qualify; running tasks, unsaved changes, unknown windows or a pending restart pause it.')), h('p', null, t('不会自动重启 DSH，其他插件不会跟着开启。可随时关闭。', 'DSH will not restart automatically, and other plugins will not be enabled for automatic updates. Turn it off anytime.')), h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('保持关闭', 'Keep off')), h(W.Button, { variant: 'primary', onClick: () => { setDialog(null); void perform(() => save({ checkEnabled: true, autoInstall: true }, 'enable-idle-patch-updates')); } }, t('允许此插件自动安装补丁', 'Allow patches for this plugin')))) :
        h('div', { className: 'w-stack' }, h('p', { className: 'updates-version' }, target + ': ' + row.version + ' → ' + row.release.version), h('p', null, t('通过 DSH 官方插件管理器安装。需要重启时，由你手动决定时间；停用状态会保留。', 'Install through DSH’s native plugin manager. Choose when to restart if needed; disabled status is preserved.')), h('p', { className: 'w-muted' }, t('来源：npm 官方 registry，网络不可达时回退 npmmirror。安装前再次核对版本与完整性。', 'Source: official npm registry, with npmmirror fallback if unreachable. Version and integrity are checked again before installation.')), (ownPage.dirty || snapshot.pages.dirty) && h(W.Status, null, message('page-dirty')), h('div', { className: 'w-toolbar' }, h(W.Button, { onClick: () => setDialog(null) }, t('取消', 'Cancel')), h(W.Button, { variant: 'primary', disabled: installLocked || row.loadError, onClick: install }, t('确认安装此版本', 'Install this version')))))
    );
  }
  function NativeFooter({ subject }) {
    const snapshot = useSnapshot(), name = __stardustUpdatesDetailName(subject, snapshot?.rows || []);
    return name ? h(Panel, { name }) : null;
  }
  function Reminder() {
    useSnapshot();
    const row = state?.rows.find(row => { const prefs = preferences(row.name); return row.available && !row.updating && !row.bundledBy && prefs.checkEnabled && prefs.deferredUntil <= Date.now() && prefs.ignoredVersion !== row.release.version && !notified.has(row.name + '@' + row.release.version); });
    if (!row) return null;
    let Toast; try { Toast = require('@deepseek-ai/dsh-client-ui-primitives').Toast; } catch { return null; }
    if (!Toast) return null;
    const key = row.name + '@' + row.release.version;
    return h(Toast, { key, text: (language() === 'en' ? row.labelEn : row.label) + t('有新版本，可在页面底部查看。', ' has an update. Review it at the bottom of its page.'), icon: h(W.Icon, { name: 'refresh', size: 18 }), holdMs: 7000, onDone: () => { notified.add(key); notify(); } });
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
  const client = { t, Footer: Panel, has: name => registered && !!originalRow(name), row: rowFor, dispose() {
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
// Generated from templates/client.js, templates/panels/ and templates/workbench-ui.js. Edit the sources.
(function () {
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
      h('style', null, styles),
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
    return h('div', { className: cx('w-status', 'w-status-' + tone, className), role: tone === 'error' ? 'alert' : 'status', 'aria-live': tone === 'error' ? 'assertive' : 'polite' }, h(Icon, { name: tone === 'success' ? 'check' : 'info', size: 18 }), h('div', null, children));
  }
  function Empty({ title, children, action, icon = 'file' }) {
    return h('div', { className: 'w-empty' }, h(Icon, { name: icon, size: 32 }), h('h2', null, title), children ? h('div', { className: 'w-muted' }, children) : null, action ? h('div', { className: 'w-toolbar' }, action) : null);
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
    return h('div', { className: 'w-overlay', onClick: event => { if (!busy && event.target === event.currentTarget) onClose(); } },
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
.dshw{--w-bg:var(--dsw-alias-bg-layer-1,#fff);--w-soft:var(--dsw-alias-bg-layer-2,#f7f8fa);--w-text:var(--dsw-alias-label-primary,#18202c);--w-muted:var(--dsw-alias-label-secondary,#667085);--w-border:var(--dsw-alias-border-l3,#e7e9ef);--w-accent:var(--dsh-plugin-workbench-accent,#4f6bdb);--w-selected:color-mix(in srgb,var(--w-accent) 10%,var(--w-bg));--w-primary:var(--w-text);--w-on-primary:var(--w-bg);container-type:inline-size;container-name:dsh-workbench;color:var(--w-text);background:var(--w-bg);font:14px/1.65 var(--dsh-font-family-content,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif);min-width:0;max-width:100%;box-sizing:border-box;text-align:start;color-scheme:inherit}
.dshw *,.dshw *:before,.dshw *:after{box-sizing:border-box}.dshw h1,.dshw h2,.dshw h3,.dshw h4,.dshw p{margin:0}.dshw h1{font-size:30px;line-height:1.25;letter-spacing:-.025em;font-weight:650}.dshw h2{font-size:24px;line-height:1.35;font-weight:650;letter-spacing:-.015em;overflow-wrap:anywhere}.dshw h3,.dshw h4{font-size:16px;line-height:1.4;font-weight:600}.dshw a{color:var(--w-accent);text-underline-offset:3px;overflow-wrap:anywhere}.dshw button,.dshw input,.dshw select,.dshw textarea{font:inherit;color:inherit;max-width:100%}.dshw input:not([type=checkbox]):not([type=radio]):not([type=file]),.dshw select,.dshw textarea{background:var(--w-bg);border:1px solid var(--w-border);border-radius:8px;padding:8px 11px;min-width:0;line-height:1.5}.dshw input:not([type=checkbox]):not([type=radio]):not([type=file]),.dshw select{min-height:38px}.dshw textarea{resize:vertical}.dshw input[type=checkbox],.dshw input[type=radio]{width:16px;height:16px;flex-shrink:0;accent-color:var(--w-accent)}.dshw :focus-visible{outline:2px solid var(--w-accent);outline-offset:3px}.dshw button:disabled,.dshw input:disabled,.dshw select:disabled,.dshw textarea:disabled{opacity:.5;cursor:not-allowed}.dshw label{font-size:13px}.dshw fieldset{min-width:0;border:1px solid var(--w-border);border-radius:8px}.dshw summary{cursor:pointer;font-weight:550;list-style:none;display:flex;align-items:center;gap:8px}.dshw summary::-webkit-details-marker{display:none}.dshw summary:after{content:'';display:block;margin-inline-start:auto;width:7px;height:7px;border-inline-end:1.75px solid currentColor;border-bottom:1.75px solid currentColor;transform:rotate(45deg);flex-shrink:0}.dshw details[open]>summary:after{transform:rotate(225deg)}.dshw details>summary+*{margin-top:12px}.dshw pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;max-width:100%;background:var(--w-soft);border-radius:6px;padding:14px}.dshw img,.dshw video,.dshw iframe{max-width:100%}
.w-page{display:flex;flex-direction:column;position:relative;padding:0;min-height:540px;gap:0}.w-page[data-main=true]{height:100%;min-height:0;padding:calc(24px + var(--dsh-frame-top-clearance,0px)) 28px 0 max(28px,var(--dsh-frame-leading-clearance,0px));overflow:auto}.w-page-header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding-bottom:22px;flex-shrink:0}.w-heading{min-width:0}.w-subtitle{margin-top:8px!important;font-size:14px;color:var(--w-muted);line-height:1.6}.w-header-actions,.w-toolbar,.w-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}.w-header-actions{justify-content:flex-end}.w-body,.w-tabs-layout{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}.w-body{overflow:auto}.w-tab-panel{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:auto}.w-tabs{display:flex;align-items:stretch;gap:20px;border-bottom:1px solid var(--w-border);flex-shrink:0;overflow-x:auto;scrollbar-width:thin}.dshw .w-tabs>button{border:0;border-bottom:2px solid transparent;background:transparent;padding:11px 8px 13px;white-space:nowrap;font-size:14px;font-weight:550;cursor:pointer;color:var(--w-muted);display:flex;align-items:center;gap:7px}.dshw .w-tabs>button[aria-selected=true]{border-bottom-color:var(--w-accent);color:var(--w-accent)}.w-count,.w-tag{font-size:12px;line-height:1.5;display:inline-flex;align-items:center;flex-shrink:0;background:var(--w-soft);border-radius:5px;padding:1px 6px;color:var(--w-muted)}.w-tabs [aria-selected=true] .w-count,.w-selected .w-tag{color:var(--w-accent);background:var(--w-selected)}
.dshw .w-button{display:inline-flex;justify-content:center;align-items:center;gap:7px;background:var(--w-bg);border:1px solid var(--w-border);border-radius:8px;padding:8px 12px;min-height:36px;line-height:1.4;font-size:14px;font-weight:500;cursor:pointer;text-decoration:none;white-space:normal}.dshw .w-button:not(:disabled):hover{background:var(--w-soft)}.dshw .w-primary{background:var(--w-primary);border-color:var(--w-primary);color:var(--w-on-primary)}.dshw .w-primary:not(:disabled):hover{background:var(--w-primary);opacity:.9}.dshw .w-ghost{background:transparent;border-color:transparent}.dshw .w-danger{color:var(--dsw-alias-state-error-primary,#b43c3c)}.dshw .w-icon-button{width:36px;min-width:36px;padding:8px}.dshw .w-button svg{flex-shrink:0}.w-muted{color:var(--w-muted);font-size:12px;line-height:1.6}.w-section{padding:24px 0;border-bottom:1px solid var(--w-border);min-width:0}.w-section>h3{margin-bottom:12px}.w-section>p+p{margin-top:8px}.w-fields{display:grid;gap:16px;min-width:0}.w-field{display:grid;gap:6px;min-width:0}.w-field>input,.w-field>select,.w-field>textarea{width:100%}.w-status{display:flex;align-items:flex-start;gap:8px;padding:11px 13px;margin:12px 0;border:1px solid var(--w-border);border-radius:8px;background:var(--w-soft);font-size:13px;overflow-wrap:anywhere;flex-shrink:0}.w-status>svg{flex-shrink:0;margin-top:2px}.w-status-error{color:var(--dsw-alias-state-error-primary,#ad3636)}.w-status-success{color:var(--dsw-alias-state-success-primary,#24794a)}.w-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;max-width:580px;padding:48px 24px;margin:auto;min-height:280px;overflow-wrap:anywhere}.w-empty>svg{color:var(--w-muted)}.w-empty h2{font-size:20px}.w-empty .w-muted{font-size:14px}.w-empty .w-toolbar{justify-content:center}
.w-split{display:grid;grid-template-columns:minmax(240px,var(--w-list-width)) minmax(0,1fr);min-height:460px;flex:1;min-width:0}.w-master{min-width:0;border-inline-end:1px solid var(--w-border);overflow:auto;padding-bottom:24px}.w-detail{min-width:0;padding:26px 28px;overflow:auto;overflow-wrap:anywhere;display:flex;flex-direction:column}.w-master-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:20px 16px}.w-search{display:flex;align-items:center;gap:8px;border:1px solid var(--w-border);border-radius:8px;padding:0 10px;min-width:0;flex:1;background:var(--w-bg)}.w-search>svg{color:var(--w-muted);flex-shrink:0}.dshw .w-search>input{border:0!important;background:transparent!important;padding:8px 0!important;width:100%;outline-offset:0}.w-row{display:flex;gap:0;min-width:0;position:relative;border-bottom:1px solid var(--w-border);border-inline-start:3px solid transparent}.w-row-select{display:flex;align-items:flex-start;padding:21px 0 0 14px}.dshw .w-row-button{display:flex;flex-direction:column;align-items:stretch;gap:7px;text-align:start;width:100%;padding:18px 18px 18px 16px;border:0;background:transparent;color:inherit;min-width:0;cursor:pointer;line-height:1.5}.dshw .w-row-button:hover{background:var(--w-soft)}.w-row-head{display:flex;align-items:flex-start;gap:10px;justify-content:space-between;min-width:0}.w-row-head>strong{font-size:14px;line-height:1.5;font-weight:600;overflow-wrap:anywhere}.w-row-meta,.w-row-description{color:var(--w-muted);font-size:12px;line-height:1.6;overflow-wrap:anywhere}.w-row-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.w-selected{background:var(--w-selected);border-inline-start-color:var(--w-accent)}.w-back{display:none!important}.w-detail-title{margin-bottom:12px!important}.w-detail-meta{color:var(--w-muted);font-size:13px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.w-detail-footer{padding:24px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:auto;border-top:1px solid var(--w-border)}.w-detail-footer .w-muted{flex:1;min-width:160px}.w-definition{display:grid;grid-template-columns:minmax(80px,120px) minmax(0,1fr);gap:8px 16px;font-size:14px;margin:20px 0}.w-definition dt{color:var(--w-muted)}.w-definition dd{margin:0;min-width:0;overflow-wrap:anywhere}
.w-switch-label{display:inline-flex;align-items:center;gap:8px;font-size:13px;position:relative;cursor:pointer}.w-switch-label>input{position:absolute;opacity:0;inset-inline-end:0;width:36px!important;height:22px!important;margin:0;cursor:pointer}.w-switch-track{width:36px;height:22px;border-radius:12px;display:block;background:var(--w-border);border:1px solid var(--w-border);pointer-events:none;padding:2px;transition:background .15s}.w-switch-track:before{content:'';display:block;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0002;transition:transform .15s}.w-switch-label>input:checked+.w-switch-track{background:var(--w-accent);border-color:var(--w-accent)}.w-switch-label>input:checked+.w-switch-track:before{transform:translateX(14px)}.w-switch-label>input:focus-visible+.w-switch-track{outline:2px solid var(--w-accent);outline-offset:3px}.w-switch-label:has(>input:disabled){opacity:.5;cursor:not-allowed}
.w-overlay{position:fixed;inset:0;background:#0005;display:flex;justify-content:flex-end;z-index:1000;padding:12px;overflow:auto}.w-dialog{width:min(620px,100%);max-height:100%;display:flex;flex-direction:column;min-height:0;background:var(--w-bg);color:var(--w-text);border:1px solid var(--w-border);border-radius:12px;box-shadow:0 18px 70px #0003}.w-dialog-header{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 24px;border-bottom:1px solid var(--w-border);flex-shrink:0}.w-dialog-header>h2{font-size:20px}.w-dialog-body{overflow:auto;padding:20px 24px;min-height:0}.w-editor-grid{display:grid;grid-template-columns:210px minmax(0,1fr) 300px;min-height:500px;flex:1}.w-editor-list{padding:20px 12px;border-inline-end:1px solid var(--w-border);min-width:0}.w-editor-canvas{background:var(--w-soft);padding:20px;min-width:0;display:flex;flex-direction:column;gap:14px}.w-editor-inspector{padding:24px;border-inline-start:1px solid var(--w-border);min-width:0;overflow:auto}.w-editor-inspector h3{margin-bottom:18px}.w-preview-empty{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:12px;aspect-ratio:16/9;min-height:180px;background:var(--w-soft);border:1px solid var(--w-border);border-radius:8px;padding:24px;color:var(--w-muted)}.w-content-pad{padding:24px 0}.w-stack{display:flex;flex-direction:column;gap:16px;min-width:0}.w-scroll-x{overflow:auto;max-width:100%}
@container dsh-workbench (max-width:1000px){.w-editor-grid{grid-template-columns:160px minmax(0,1fr)}.w-editor-inspector{grid-column:1/-1;border-inline-start:0;border-top:1px solid var(--w-border)}.w-header-actions{max-width:60%}.w-split{grid-template-columns:minmax(240px,32%) minmax(0,1fr)}}
@container dsh-workbench (max-width:760px){.w-page-header{gap:14px;flex-wrap:wrap;padding-bottom:18px}.w-heading{flex:1;min-width:170px}.dshw h1{font-size:24px}.w-header-actions{max-width:100%;justify-content:flex-start}.w-subtitle{font-size:13px}.w-tabs{gap:12px}.dshw .w-tabs>button{padding:10px 4px 12px}.w-split{display:block;min-height:360px}.w-split[data-selected=false]>.w-detail{display:none}.w-split[data-selected=true]>.w-master{display:none}.w-master{border-inline-end:0}.w-detail{padding:20px 0}.w-back{display:inline-flex!important;align-self:flex-start;margin:0 0 16px!important}.w-detail h2{font-size:22px}.w-master-toolbar{padding:16px 0}.dshw .w-row-button{padding:16px 10px}.w-detail-footer{position:static}.w-detail-footer .w-muted{flex-basis:100%}.w-editor-grid{display:flex;flex-direction:column}.w-editor-list{border-inline-end:0;border-bottom:1px solid var(--w-border);padding:16px 0}.w-editor-canvas{padding:16px 0;background:var(--w-bg)}.w-editor-inspector{padding:20px 0}.w-dialog-header,.w-dialog-body{padding:16px}.w-button{min-height:40px}.w-definition{grid-template-columns:80px minmax(0,1fr)}}
@media(max-width:700px){.w-page[data-main=true]{padding:calc(16px + var(--dsh-frame-top-clearance,0px)) 16px 0 max(16px,var(--dsh-frame-leading-clearance,0px))}.w-overlay{padding:8px}.w-dialog{width:100%}}
@media(prefers-reduced-motion:reduce){.dshw *,.dshw *:before{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;
  return { Icon, Button, IconButton, Page, Tabs, Status, Empty, Split, Row, Search, Switch, Dialog, register, styles };
}

// Editable browser entry. Build with node scripts/build-client.mjs.
window.__ModuleLoader__.load(__stardustUpdatesWrap({ id: "dsh-calendar", factory: (require) => {
        var module = { exports: {} };
        var exports = module.exports;
        "use strict";
        const React = require("react");
        const W = createWorkbenchUI(React);
function calendarText(zh, en) { return UI_LANG === 'en' ? en : zh; }
const CALENDAR_WORKBENCH_CSS = `
.calendar-workbench .dshc-root{font-size:14px;min-width:0;display:flex;flex-direction:column;flex:1}.calendar-workbench .dshc-shell{border:0;border-radius:0;padding:0;background:transparent;box-shadow:none;max-width:none}.calendar-workbench .calendar-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;padding:0 0 18px}.calendar-workbench .calendar-period{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.calendar-workbench .calendar-period strong{font-size:20px;min-width:140px;text-align:center;font-weight:600}.calendar-workbench .calendar-view-controls{display:flex;align-items:center;gap:4px}.calendar-workbench .calendar-view-controls .w-button{border-radius:6px;border-color:transparent;min-width:50px;padding:7px 12px}.calendar-workbench .calendar-view-controls [aria-pressed=true]{background:var(--w-selected);color:var(--w-accent)}.calendar-workbench .dshc-grid{gap:0;border-inline-start:1px solid var(--w-border);margin:0!important}.calendar-workbench .dshc-dow{padding:14px 0;border-block-start:1px solid var(--w-border);border-inline-end:1px solid var(--w-border);font-size:12px;color:var(--w-muted)}.calendar-workbench .dshc-cell{border-radius:0;min-height:clamp(88px,calc((100dvh - 300px)/6),140px);padding:10px 9px;background:transparent;border:0;border-block-start:1px solid var(--w-border);border-inline-end:1px solid var(--w-border)}.calendar-workbench .dshc-grid:last-child{border-block-end:1px solid var(--w-border)}.calendar-workbench .dshc-cell.out{background:var(--w-soft);opacity:.55}.calendar-workbench .dshc-daynum{font-size:12px;line-height:24px;color:var(--w-text);margin-bottom:6px}.calendar-workbench .dshc-cell.today{border-color:var(--w-border)}.calendar-workbench .dshc-cell.today .dshc-daynum b{width:24px;height:24px;padding:0;text-align:center;border-radius:50%;background:var(--w-accent);color:#fff;font-size:12px}.calendar-workbench .dshc-chip{border-radius:4px;padding:3px 5px;font-size:12px;background:var(--w-selected);color:var(--w-text)}.calendar-workbench .dshc-chip .t{font-size:11px}.calendar-workbench .dshc-footer{padding:16px 0;font-size:12px;color:var(--w-muted);margin:0;gap:16px;flex-wrap:wrap}.calendar-workbench .dshc-btn{min-height:36px;font-size:14px;border-radius:8px;border-color:var(--w-border);padding:8px 12px}.calendar-workbench .dshc-btn.primary{background:var(--w-primary);color:var(--w-on-primary);border-color:var(--w-primary)}.calendar-workbench .dshc-empty{max-width:580px;min-height:300px;display:flex;flex-direction:column;justify-content:center;margin:auto;font-size:14px;line-height:1.7}.calendar-workbench .dshc-empty h3{font-size:20px;margin-bottom:12px}.calendar-workbench .dshc-empty>div{flex-wrap:wrap}.calendar-workbench .dshc-alert{font-size:13px;border:1px solid var(--w-border);border-radius:8px;background:var(--w-soft);color:var(--w-text);padding:12px 14px;line-height:1.6}.calendar-workbench .dshc-alert.error{color:var(--dsw-alias-state-error-primary,#ad3636)}.calendar-workbench .dshc-import{border:0!important;border-block:1px solid var(--w-border)!important;border-radius:0!important;padding:24px 0!important;margin:0 0 24px!important}.calendar-workbench .dshc-import h3{font-size:18px;margin-bottom:16px}.calendar-workbench .dshc-import label{font-size:13px}.calendar-workbench .dshc-import select,.calendar-workbench .dshc-import textarea{font-size:14px}.calendar-workbench .dshc-agenda{max-height:none;padding:6px 0 24px}.calendar-workbench .dshc-daygroup{gap:0}.calendar-workbench .dshc-daylabel{padding:12px 0}.calendar-workbench .dshc-daylabel b{font-size:16px}.calendar-workbench .dshc-row{border-radius:0;background:transparent;border:0;border-block-end:1px solid var(--w-border);padding:16px 0;font-size:14px}.calendar-workbench .dshc-week{max-height:calc(100dvh - 265px);min-height:420px}.calendar-workbench .dshc-week .dshc-dayhead{font-size:12px;padding:6px}.calendar-workbench .dshc-time,.calendar-workbench .dshc-meta{font-size:12px;color:var(--w-muted)}.calendar-workbench .dshc-slot{font-size:12px;border-radius:4px}.calendar-workbench .dshc-draghint{font-size:12px;line-height:1.6;padding:12px 0}.calendar-workbench .dshc-skel{animation:none;background:var(--w-soft);border-radius:0;border:1px solid var(--w-border)}
@container dsh-workbench (max-width:760px){.calendar-workbench .calendar-toolbar{gap:12px}.calendar-workbench .calendar-period{gap:4px}.calendar-workbench .calendar-period strong{font-size:17px;min-width:116px}.calendar-workbench .calendar-view-controls{width:100%;justify-content:space-between;border-top:1px solid var(--w-border);padding-top:10px}.calendar-workbench .dshc-cell{min-height:86px;padding:6px 3px}.calendar-workbench .dshc-daynum{font-size:11px}.calendar-workbench .dshc-chip{font-size:10px;padding:2px}.calendar-workbench .dshc-chip .t{display:none}.calendar-workbench .dshc-dow{font-size:11px;padding:10px 0}.calendar-workbench .dshc-week{overflow:auto;grid-template-columns:40px repeat(7,minmax(65px,1fr))}.calendar-workbench .dshc-footer{font-size:11px}}
`;

let calendarHostContext;
        const { useState, useEffect, useMemo, useRef, useCallback, useId } = React;
        const h = React.createElement;
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
        /* @ui-css-start */
        const CSS = [
            ".dshc-root{color:var(--dsw-alias-label-primary,#111);font-size:13px;line-height:1.5}",
            // 面板可能出现在两个宽度差很大的容器里（对话页浮层 ~760px、设置页更窄）。
            // 用容器查询按「面板自己的宽度」适配：窄的时候藏掉时间前缀与重复的标题，
            // 让芯片至少能把日程标题露出来。
            ".dshc-shell{background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));border-radius:14px;padding:14px 16px 16px;container-type:inline-size}",
            "@container (max-width: 620px){.dshc-title{display:none}.dshc-chip .t{display:none}.dshc-toolbar{gap:6px}.dshc-monthhead{min-width:0}}",
            ".dshc-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}",
            ".dshc-title{font-size:15px;font-weight:600;margin:0}",
            ".dshc-sub{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px}",
            ".dshc-spacer{flex:1}",
            ".dshc-btn{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);border-radius:9px;padding:5px 11px;font-size:12px;cursor:pointer;transition:background .12s,border-color .12s}",
            ".dshc-btn:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-label-primary,#111) 6%,transparent)}",
            ".dshc-btn:disabled{opacity:.5;cursor:not-allowed}",
            ".dshc-btn.primary{background:var(--dsw-alias-button-primary-fill,#2563eb);border-color:transparent;color:var(--dsw-alias-label-primary-foreground,#fff)}",
            ".dshc-btn.primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,#1d4ed8)}",
            ".dshc-btn.danger{color:var(--dsw-alias-state-error-primary,#dc2626);border-color:var(--dsw-alias-state-error-primary,#dc2626)}",
            ".dshc-btn.ghost{border-color:transparent;background:transparent}",
            ".dshc-tabs{display:inline-flex;background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.05));border-radius:10px;padding:2px;gap:2px}",
            ".dshc-tab{border:0;background:transparent;border-radius:8px;padding:4px 10px;font-size:12px;cursor:pointer;color:var(--dsw-alias-label-tertiary,#6b7280)}",
            ".dshc-tab.on{background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);box-shadow:var(--dsw-elevation-prominent,0 1px 2px rgba(0,0,0,.12))}",
            ".dshc-monthhead{text-align:center;font-size:13px;font-weight:600;min-width:104px}",
            ".dshc-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}",
            ".dshc-dow{text-align:center;font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);padding:2px 0 4px}",
            ".dshc-cell{display:block;width:100%;min-height:88px;box-sizing:border-box;border-radius:10px;padding:5px 5px 6px;background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.03));border:1px solid transparent;cursor:pointer;text-align:left;font:inherit;color:inherit;transition:background .12s,border-color .12s;overflow:hidden}",
            ".dshc-cell:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary,#111) 7%,transparent)}",
            ".dshc-cell.out{opacity:.45}",
            ".dshc-cell.today{border-color:var(--dsw-alias-state-business-primary,#2563eb)}",
            ".dshc-daynum{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin:0 0 3px;display:flex;justify-content:space-between}",
            ".dshc-cell.today .dshc-daynum b{background:var(--dsw-alias-state-business-primary,#2563eb);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:999px;padding:0 6px}",
            ".dshc-cell.today .dshc-daynum b{font-weight:600}",
            ".dshc-chip{display:block;width:100%;text-align:left;border:0;border-left:3px solid var(--dsw-alias-state-business-primary,#2563eb);background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);border-radius:7px;padding:3px 6px;margin-bottom:3px;font-size:12px;line-height:1.35;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
            ".dshc-chip:hover{background:var(--dsw-alias-button-elevated-fill,rgba(0,0,0,.06))}",
            ".dshc-chip.allday{border-left-color:var(--dsw-alias-state-success-primary,#16a34a)}",
            ".dshc-chip.recurring{border-left-color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
            ".dshc-chip .t{color:var(--dsw-alias-label-tertiary,#9ca3af);margin-right:4px}",
            ".dshc-more{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);padding-left:3px}",
            ".dshc-week{display:grid;grid-template-columns:56px repeat(7,minmax(0,1fr));gap:4px;max-height:520px;overflow:auto}",
            ".dshc-hour{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);text-align:right;padding-right:4px;height:44px}",
            ".dshc-daycol{position:relative;border-left:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.07));min-height:44px}",
            ".dshc-daycol.today{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#2563eb) 7%,transparent)}",
            ".dshc-dayhead{position:sticky;top:0;background:var(--dsw-alias-bg-layer-1,#fff);z-index:2;text-align:center;font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);padding-bottom:4px}",
            ".dshc-dayhead b{color:var(--dsw-alias-label-primary,#111);font-weight:600;font-size:13px}",
            ".dshc-slot{position:absolute;left:2px;right:2px;border-radius:7px;padding:3px 5px;font-size:11px;line-height:1.3;overflow:hidden;cursor:grab;background:var(--dsw-alias-state-business-primary,#2563eb);color:var(--dsw-alias-label-primary-foreground,#fff);border:0;text-align:left;touch-action:none;user-select:none}",
            ".dshc-slot:active{cursor:grabbing}",
            ".dshc-slot.dragging{opacity:.35}",
            ".dshc-slot-title{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
            ".dshc-slot-time{opacity:.78;white-space:nowrap}",
            ".dshc-resize{position:absolute;left:0;right:0;bottom:0;height:6px;cursor:ns-resize;border-bottom-left-radius:7px;border-bottom-right-radius:7px}",
            ".dshc-resize:hover{background:rgba(255,255,255,.35)}",
            ".dshc-ghost{background:transparent !important;border:1px dashed var(--dsw-alias-state-business-primary,#2563eb);color:var(--dsw-alias-label-primary,#111);z-index:3;pointer-events:none;display:flex;flex-direction:column;justify-content:center}",
            ".dshc-ghost.conflict{border-color:var(--dsw-alias-state-warn-primary,#f59e0b);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 18%,transparent) !important}",
            ".dshc-draghint{margin-top:6px;font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}",
            ".dshc-confirmbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 14%,transparent);border-radius:10px;padding:8px 10px;font-size:12px;margin-bottom:10px}",
            ".dshc-undo{display:flex;align-items:center;gap:10px;background:var(--dsw-alias-label-primary,#111);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:10px;padding:8px 12px;font-size:12px;margin-bottom:10px}",
            ".dshc-undo-btn{border:1px solid currentColor;background:transparent;color:inherit;border-radius:7px;padding:2px 8px;font-size:12px;cursor:pointer}",
            ".dshc-slot.allday{background:var(--dsw-alias-state-success-primary,#16a34a)}",
            ".dshc-slot.recurring{background:var(--dsw-alias-state-warn-primary,#f59e0b);color:#1f2937}",
            ".dshc-agenda{display:flex;flex-direction:column;gap:14px;max-height:560px;overflow:auto;padding-right:4px}",
            ".dshc-daygroup{display:flex;flex-direction:column;gap:6px}",
            ".dshc-daylabel{display:flex;align-items:baseline;gap:8px;position:sticky;top:0;background:var(--dsw-alias-bg-layer-1,#fff);padding:2px 0}",
            ".dshc-daylabel b{font-size:13px}",
            ".dshc-row{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.03));cursor:pointer;border-left:3px solid var(--dsw-alias-state-business-primary,#2563eb)}",
            ".dshc-row:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary,#111) 7%,transparent)}",
            ".dshc-row.allday{border-left-color:var(--dsw-alias-state-success-primary,#16a34a)}",
            ".dshc-row.recurring{border-left-color:var(--dsw-alias-state-warn-primary,#f59e0b)}",
            ".dshc-time{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary,#6b7280);min-width:96px;font-size:12px;padding-top:1px}",
            ".dshc-main{flex:1;min-width:0}",
            ".dshc-name{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
            ".dshc-meta{color:var(--dsw-alias-label-tertiary,#6b7280);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
            ".dshc-tag{display:inline-block;font-size:11px;padding:1px 6px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-label-primary,#111) 7%,transparent);color:var(--dsw-alias-label-tertiary,#6b7280);margin-left:6px}",
            ".dshc-empty{padding:26px 18px;text-align:center;color:var(--dsw-alias-label-tertiary,#6b7280)}",
            ".dshc-empty h3{color:var(--dsw-alias-label-primary,#111);margin:0 0 6px;font-size:14px}",
            ".dshc-empty code{background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.05));padding:1px 5px;border-radius:5px;font-size:12px}",
            ".dshc-alert{display:flex;gap:8px;align-items:flex-start;border-radius:10px;padding:8px 10px;font-size:12px;margin-bottom:10px;background:color-mix(in srgb,var(--dsw-alias-label-primary,#111) 5%,transparent)}",
            ".dshc-alert.error{background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#dc2626) 12%,transparent);color:var(--dsw-alias-state-error-primary,#dc2626)}",
            ".dshc-alert.warn{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#f59e0b) 16%,transparent)}",
            ".dshc-alert.demo{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#2563eb) 12%,transparent)}",
            ".dshc-skel{height:88px;border-radius:10px;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.04)) 25%,color-mix(in srgb,var(--dsw-alias-label-primary,#111) 10%,transparent) 37%,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.04)) 63%);background-size:400% 100%;animation:dshc-shimmer 1.4s ease infinite}",
            "@keyframes dshc-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}",
            ".dshc-overlay{position:fixed;inset:0;background:var(--dsw-alias-bg-mask-3,rgba(15,23,42,.42));display:flex;justify-content:flex-end;z-index:60}",
            ".dshc-drawer{width:min(420px,92vw);height:100%;background:var(--dsw-alias-bg-layer-1,#fff);border-left:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.08));padding:18px;overflow:auto;box-shadow:var(--dsw-elevation-prominent,0 10px 30px rgba(0,0,0,.2))}",
            ".dshc-modalwrap{position:fixed;inset:0;background:var(--dsw-alias-bg-mask-3,rgba(15,23,42,.42));display:flex;align-items:center;justify-content:center;z-index:70;padding:20px}",
            ".dshc-modal{width:min(460px,94vw);max-height:88vh;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fff);border-radius:14px;padding:18px;box-shadow:var(--dsw-elevation-prominent,0 10px 30px rgba(0,0,0,.25))}",
            ".dshc-field{margin-bottom:10px}",
            ".dshc-field label{display:block;font-size:12px;color:var(--dsw-alias-label-tertiary,#6b7280);margin-bottom:4px}",
            ".dshc-input,select.dshc-input,textarea.dshc-input{width:100%;box-sizing:border-box;background:var(--dsw-specific-input-major,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.03)));border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:9px;padding:7px 9px;font:inherit;color:inherit}",
            "textarea.dshc-input{min-height:72px;resize:vertical}",
            ".dshc-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
            ".dshc-check{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-primary,#111)}",
            ".dshc-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}",
            ".dshc-kv{display:grid;grid-template-columns:72px 1fr;gap:6px 10px;font-size:12px;margin:12px 0 0}",
            ".dshc-kv dt{color:var(--dsw-alias-label-tertiary,#6b7280)}",
            ".dshc-kv dd{margin:0;word-break:break-all}",
            ".dshc-drawertitle{font-size:16px;font-weight:600;margin:0 0 4px}",
            ".dshc-mono{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--dsw-alias-label-tertiary,#6b7280);word-break:break-all}",
            ".dshc-close{position:absolute;top:10px;right:12px}",
            ".dshc-footer{margin-top:12px;display:flex;align-items:center;gap:8px;justify-content:space-between;color:var(--dsw-alias-label-tertiary,#9ca3af);font-size:11px}"
        ].join("");
        /* @ui-css-end */
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
        async function api(action, payload) {
            const init = { credentials: "same-origin", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ action }, payload)) };
            // 请求必须有上限：挂起的 Promise 会让乐观覆盖一直盖着、撤销条永不出现，
            // 表现就是「界面改了、服务器没改」而用户以为成功。超时按失败处理（调用方会回滚并对账）。
            if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function")
                init.signal = AbortSignal.timeout(API_TIMEOUT_MS);
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
        // 平台的 seed 模块表里有 ui-primitives；老宿主没有时退回同名自绘控件，
        // 面板不会因为「组件库不在」整块消失。
        var PRIM = null;
        try {
            PRIM = require("@deepseek-ai/dsh-client-ui-primitives");
        }
        catch (e) {
            PRIM = null;
        }
        /** Button：有官方组件就用官方（variant/tokens 一致），否则退回 .dshc-btn。 */
        function Btn(props) {
            const { variant, size, icon, className, children, ...rest } = props || {};
            if (PRIM && typeof PRIM.Button === "function") {
                return h(PRIM.Button, Object.assign({ variant: variant || "ghost", size: size || "sm" }, rest, { className }), children);
            }
            const cls = ["dshc-btn", variant === "primary" ? "primary" : "", variant === "danger" ? "danger" : "", variant === "ghost" ? "ghost" : "", className || ""].join(" ").trim();
            return h("button", Object.assign({ type: "button" }, rest, { className: cls }), children);
        }
        /** Input：官方版是「带图标的 span 包 input」，属性透传，这里只用其属性面。 */
        function Txt(props) {
            const { className, ...rest } = props || {};
            if (PRIM && typeof PRIM.Input === "function")
                return h(PRIM.Input, Object.assign({}, rest, { className }));
            return h("input", Object.assign({ type: "text" }, rest, { className: ["dshc-input", className || ""].join(" ").trim() }));
        }
        /** Checkbox：回到原生勾选框 + 文案，语义与官方一致（label 既是可见名也是无障碍名）。 */
        function Chk(props) {
            if (PRIM && typeof PRIM.Checkbox === "function")
                return h(PRIM.Checkbox, props);
            return h("label", { className: "dshc-check" }, [
                h("input", { type: "checkbox", checked: props.checked === true, disabled: props.disabled === true, onChange: (e) => props.onChange(e.target.checked) }),
                h("span", null, props.label)
            ]);
        }
        /** Modal：官方版是 portal + 遮罩 + Esc 语义；没有它时用同一套 class 自绘。 */
        function Dlg(props) {
            if (PRIM && typeof PRIM.Modal === "function") {
                return h(PRIM.Modal, {
                    open: props.open,
                    onClose: props.onClose,
                    title: props.title,
                    closeLabel: props.closeLabel || props.title,
                    children: h("div", { "data-dshc-scope": "1" }, props.children),
                    footer: props.footer
                });
            }
            if (!props.open)
                return null;
            return h("div", { className: "dshc-modalwrap", onMouseDown: (e) => { if (e.target === e.currentTarget)
                    props.onClose(); } }, [
                h("div", { className: "dshc-modal" }, [
                    h("div", { style: { position: "relative" } }, [
                        h("div", { className: "dshc-drawertitle" }, props.title),
                        h("button", { type: "button", className: "dshc-btn ghost dshc-close", onClick: props.onClose, "aria-label": props.closeLabel || props.title }, "\u2715")
                    ]),
                    props.children,
                    props.footer
                ])
            ]);
        }
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
            return event.allDay ? "allday" : (event.rrule || event.isOccurrence ? "recurring" : "");
        }
        function Chip(props) {
            const { event, onClick } = props;
            return h("button", {
                type: "button",
                className: "dshc-chip " + eventClass(event),
                title: event.summary,
                onClick: (e) => { e.stopPropagation(); onClick(event); }
            }, [
                event.allDay ? null : h("span", { className: "t" }, hhmm(startDate(event))),
                h("span", null, event.summary)
            ]);
        }
        /** 议程里的一行：时间列 + 标题/地点 + 重复角标。 */
        function Row(props) {
            const { event, onClick } = props;
            const meta = [];
            if (event.location)
                meta.push(event.location);
            if (event.rrule)
                meta.push(humanRepeat(event.rrule));
            else if (event.isOccurrence)
                meta.push(t("repeat.occurrence"));
            return h("div", { className: "dshc-row " + eventClass(event), onClick: () => onClick(event), role: "button", tabIndex: 0,
                onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ")
                    onClick(event); } }, [
                h("div", { className: "dshc-time" }, event.allDay ? t("format.allday") : (hhmm(startDate(event)) + "–" + hhmm(endDate(event)))),
                h("div", { className: "dshc-main" }, [
                    h("div", { className: "dshc-name" }, event.summary),
                    meta.length > 0 ? h("div", { className: "dshc-meta" }, meta.join(" · ")) : null
                ])
            ]);
        }
        /** 月视图：6×7 网格；每格最多 3 条，多的收成「+N」。 */
        function MonthView(props) {
            const { anchor, events, onPick, onCreateAt } = props;
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
                    className: "dshc-cell" + (day.getMonth() !== anchor.getMonth() ? " out" : "") + (key === today ? " today" : ""),
                    onClick: () => onCreateAt(day),
                    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onCreateAt(day);
                    } },
                    title: t("action.new")
                }, [
                    h("div", { className: "dshc-daynum" }, [key === today ? h("b", null, String(day.getDate())) : h("span", null, String(day.getDate()))]),
                    shown.map((event) => h(Chip, { key: event.uid + "@" + key, event, onClick: onPick })),
                    rest > 0 ? h("div", { className: "dshc-more" }, "+" + rest) : null
                ]));
            }
            return h("div", null, [
                h("div", { className: "dshc-grid", style: { marginBottom: "4px" } }, WEEKDAYS_ZH.map((d, i) => h("div", { className: "dshc-dow", key: d }, UI_LANG === "en" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] : "周" + d))),
                h("div", { className: "dshc-grid" }, cells)
            ]);
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
            const { anchor, events, onPick, onCreateAt, onReschedule } = props;
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
            const hoursColumn = h("div", { key: "__hours" }, [h("div", { className: "dshc-dayhead", key: "h" }, "\u00a0")].concat(Array.from({ length: 24 }, (_, hour) => h("div", { className: "dshc-hour", key: "h" + hour }, hour === 0 ? "" : pad2(hour) + ":00"))));
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
                        key: event.uid,
                        role: "button",
                        tabIndex: 0,
                        "data-uid": event.uid,
                        className: "dshc-slot " + eventClass(event) + (dragging ? " dragging" : ""),
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
                    }, h("div", { className: "dshc-slot-title" }, event.summary), h("div", { className: "dshc-slot-time" }, hhmm(from) + "\u2013" + hhmm(to)), canEdit === true ? h("div", { className: "dshc-resize", title: t("drag.resizeTitle"), onPointerDown: (e) => { e.stopPropagation(); beginDrag(event, e, "resize"); } }) : null);
                });
                const ghostBlock = ghost !== null && ghost.slot.dayKey === key
                    ? h("div", {
                        className: "dshc-slot dshc-ghost" + (ghost.conflicts > 0 ? " conflict" : ""),
                        style: Object.assign({ top: (ghost.slot.minutes * (HOUR_PX / 60)) + "px", height: Math.max(18, ghost.slot.durationMinutes * (HOUR_PX / 60)) + "px" }, laneStyle(0)),
                        key: "__ghost"
                    }, h("div", { className: "dshc-slot-title" }, ghost.conflicts > 0 ? t("drag.conflict", { n: ghost.conflicts }) + " · " + t("drag.keep") : t("drag.drop")), h("div", { className: "dshc-slot-time" }, pad2(Math.floor(ghost.slot.minutes / 60)) + ":" + pad2(ghost.slot.minutes % 60) + " \u2192 " + pad2(Math.floor((ghost.slot.minutes + ghost.slot.durationMinutes) / 60)) + ":" + pad2((ghost.slot.minutes + ghost.slot.durationMinutes) % 60)))
                    : null;
                // 可变参数：数组子节点要求 key，而这两块在这里各只出现一次。
                return h("div", { key, style: { minWidth: 0 } }, h("div", { className: "dshc-dayhead" }, h("b", null, String(day.getDate())), " ", relativeDay(day)), h("div", {
                    className: "dshc-daycol" + (key === today ? " today" : ""),
                    "data-day": key,
                    style: { height: (24 * HOUR_PX) + "px" },
                    onClick: (clickEvent) => {
                        // 只有点在格子空白处才新建：拖拽结束后的 click 可能落在 daycol 上，靠 suppressClick 兜住。
                        if (clickEvent.target !== clickEvent.currentTarget)
                            return;
                        if (suppressClick.current === true)
                            return;
                        onCreateAt(day);
                    },
                    title: t("action.new")
                }, blocks.concat(ghostBlock === null ? [] : [ghostBlock])));
            });
            // 可变参数而不是数组：数组子节点要求 key，而这三个都只在 WeekView 里出现一次。
            return h("div", null, allDay.length > 0
                ? h("div", { style: { marginBottom: "8px" } }, allDay.map((event) => h(Row, { key: event.uid, event, onClick: onPick })))
                : null, h("div", { className: "dshc-week", ref: scroller }, [hoursColumn].concat(dayColumns)), canEdit === true ? h("div", { className: "dshc-draghint" }, t("drag.hint")) : null);
        }
        /** 议程视图：从今天起按天分组，最像「接下来要干什么」。 */
        function AgendaView(props) {
            const { events, onPick, onCreateAt } = props;
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
                return h("div", { className: "dshc-empty" }, t("state.empty"));
            return h("div", { className: "dshc-agenda" }, groups.map((group) => h("div", { className: "dshc-daygroup", key: group.key }, [
                h("div", { className: "dshc-daylabel" }, [
                    h("b", null, formatDay(group.day)),
                    h("span", { className: "dshc-sub" }, relativeDay(group.day)),
                    h("span", { className: "dshc-spacer" }),
                    h("button", { type: "button", className: "dshc-btn ghost", onClick: () => onCreateAt(group.day) }, t("action.new"))
                ]),
                group.items.map((event) => h(Row, { key: event.uid, event, onClick: onPick }))
            ])));
        }
        // ───────────────────────────── 悬浮面板的样式补充 ─────────────────────────────
        const CSS_EXTRA = [
            ".dshc-fab{position:fixed;right:18px;bottom:88px;z-index:55;width:38px;height:38px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#111);box-shadow:var(--dsw-elevation-prominent,0 6px 18px rgba(0,0,0,.18));cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.62;transition:opacity .15s,transform .15s}",
            ".dshc-fab:hover{opacity:1;transform:translateY(-1px)}",
            ".dshc-fab.on{opacity:1;background:var(--dsw-alias-button-primary-fill,#2563eb);color:var(--dsw-alias-label-primary-foreground,#fff);border-color:transparent}",
            ".dshc-float{position:fixed;right:18px;bottom:136px;z-index:56;box-sizing:border-box;width:min(760px,calc(100vw - 36px));max-height:min(calc(100vh - 160px),720px);overflow:auto;background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.1));border-radius:16px;box-shadow:var(--dsw-elevation-prominent,0 18px 48px rgba(0,0,0,.28));padding:14px}",
            ".dshc-float .dshc-shell{border:0;padding:0;background:transparent}",
            ".dshc-steps{margin:2px 0 10px;font-size:12px;color:var(--dsw-alias-label-tertiary,#6b7280)}",
            ".dshc-steps summary{cursor:pointer;color:var(--dsw-alias-state-business-primary,#2563eb)}",
            ".dshc-steps ol{margin:6px 0 0;padding-left:18px;line-height:1.6}",
            ".dshc-link{color:var(--dsw-alias-state-business-primary,#2563eb);text-decoration:none}",
            ".dshc-toast{position:fixed;right:18px;bottom:182px;z-index:57;background:var(--dsw-alias-label-primary,#111);color:var(--dsw-alias-label-primary-foreground,#fff);border-radius:10px;padding:8px 12px;font-size:12px;box-shadow:var(--dsw-elevation-prominent,0 8px 20px rgba(0,0,0,.25))}"
        ].join("");
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
            return {
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
        }
        /** 新建表单：默认落在被点的那一天，上午 10:00–11:00（日历产品的惯例）。 */
        function draftAt(date, hour) {
            const d = date || new Date();
            const startHour = typeof hour === "number" ? hour : 10;
            return {
                uid: undefined,
                summary: "",
                date: dayKey(d),
                startTime: pad2(startHour) + ":00",
                endTime: pad2(Math.min(23, startHour + 1)) + ":00",
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
                const start = new Date(draft.date + "T" + (draft.startTime || "00:00") + ":00");
                const end = new Date(draft.date + "T" + (draft.endTime || "00:00") + ":00");
                fields.start = isoOf(start);
                fields.end = isoOf(end);
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
            const fields = fieldsOfDraft(draft);
            return { uid: "__draft", summary: fields.summary || "(未命名)", start: fields.start, end: fields.end, allDay: draft.allDay === true };
        }
        function EventForm(props) {
            const { draft, events, onCancel, onSubmit, busy, error } = props;
            const formId = useId();
            const [form, setForm] = useState(draft);
// Update protection: dsh-calendar.event
__stardustUpdatesGuard(React, "dsh-calendar.event", { dirty: JSON.stringify(form) !== JSON.stringify(draft), busy: !!busy });

            useEffect(() => { setForm(draft); }, [draft.uid, draft.date, draft.startTime, draft.summary]);
            const patch = (fields) => setForm((prev) => Object.assign({}, prev, fields));
            const isEdit = draft.uid !== undefined;
            const pseudo = asPseudoEvent(form);
            const conflicts = form.summary.trim() === "" ? [] : events.filter((event) => overlaps(event, pseudo) && event.uid !== form.uid);
            const canSave = form.summary.trim() !== "" && (form.allDay === true || form.startTime <= form.endTime);
            const body = h("div", null, [
                draft.isSeries ? h("div", { className: "dshc-alert" }, t("form.series")) : null,
                error ? h("div", { className: "dshc-alert error" }, error) : null,
                h("div", { className: "dshc-field" }, [
                    h("label", { htmlFor: formId + "-summary" }, t("field.summary")),
                    h(Txt, { id: formId + "-summary", value: form.summary, autoFocus: true, onChange: (e) => patch({ summary: e.target.value }), placeholder: t("form.newTitle") })
                ]),
                h("div", { className: "dshc-field" }, [
                    h("label", { htmlFor: formId + "-date" }, t("field.date")),
                    h(Txt, { id: formId + "-date", type: "date", value: form.date, onChange: (e) => patch({ date: e.target.value }) })
                ]),
                form.allDay === true ? null : h("div", { className: "dshc-two" }, [
                    h("div", { className: "dshc-field" }, [h("label", { htmlFor: formId + "-start" }, t("field.start")), h(Txt, { id: formId + "-start", type: "time", value: form.startTime, onChange: (e) => patch({ startTime: e.target.value }) })]),
                    h("div", { className: "dshc-field" }, [h("label", { htmlFor: formId + "-end" }, t("field.end")), h(Txt, { id: formId + "-end", type: "time", value: form.endTime, onChange: (e) => patch({ endTime: e.target.value }) })])
                ]),
                h("div", { className: "dshc-field" }, [h(Chk, { checked: form.allDay === true, label: t("field.allDay"), onChange: (next) => patch({ allDay: next }) })]),
                h("div", { className: "dshc-field" }, [
                    h("label", { htmlFor: formId + "-repeat" }, t("field.repeat")),
                    h("select", { id: formId + "-repeat", className: "dshc-input", value: form.repeat, onChange: (e) => patch({ repeat: e.target.value }) }, [
                        h("option", { value: "", key: "none" }, t("repeat.none")),
                        h("option", { value: "daily", key: "d" }, t("repeat.daily")),
                        h("option", { value: "weekly", key: "w" }, t("repeat.weekly")),
                        h("option", { value: "monthly", key: "m" }, t("repeat.monthly")),
                        h("option", { value: "yearly", key: "y" }, t("repeat.yearly")),
                        h("option", { value: "custom", key: "c" }, t("repeat.custom"))
                    ])
                ]),
                form.repeat === "custom" ? h("div", { className: "dshc-field" }, [
                    h("label", { htmlFor: formId + "-rrule" }, "RRULE"),
                    h(Txt, { id: formId + "-rrule", value: form.rrule, placeholder: "FREQ=WEEKLY;COUNT=10", onChange: (e) => patch({ rrule: e.target.value }) })
                ]) : null,
                h("div", { className: "dshc-field" }, [h("label", { htmlFor: formId + "-location" }, t("field.location")), h(Txt, { id: formId + "-location", value: form.location, onChange: (e) => patch({ location: e.target.value }) })]),
                h("div", { className: "dshc-field" }, [
                    h("label", { htmlFor: formId + "-description" }, t("field.description")),
                    h("textarea", { id: formId + "-description", className: "dshc-input", value: form.description, onChange: (e) => patch({ description: e.target.value }) })
                ]),
                conflicts.length > 0 ? h("div", { className: "dshc-alert warn" }, [
                    h("div", null, [
                        h("div", null, t("conflict.title", { n: conflicts.length })),
                        conflicts.slice(0, 3).map((event) => h("div", { key: event.uid }, "\u2022 " + formatWhen(event) + " " + event.summary)),
                        h("div", { className: "dshc-sub" }, t("conflict.hint"))
                    ])
                ]) : null
            ]);
            const footer = h("div", { className: "dshc-actions" }, [
                h(Btn, { key: "cancel", variant: "ghost", onClick: onCancel, disabled: busy === true }, t("action.cancel")),
                h(Btn, { key: "save", variant: "primary", onClick: () => onSubmit(form), disabled: busy === true || canSave !== true }, busy === true ? "\u2026" : t("action.save"))
            ]);
            return h(Dlg, {
                open: true,
                onClose: onCancel,
                title: isEdit ? t("form.editTitle") : t("form.newTitle"),
                children: body,
                footer: footer
            });
        }
        // ───────────────────────────── 详情抽屉 ─────────────────────────────
        function EventDrawer(props) {
            const { event, onClose, onEdit, onDelete, busy, confirmDelete, setConfirmDelete, events, readOnly } = props;
            const [copied, setCopied] = useState(false);
            const seriesCount = event.isOccurrence ? events.filter((e) => e.seriesStart === event.seriesStart).length : 0;
            return h("div", { className: "dshc-overlay", onMouseDown: (e) => { if (e.target === e.currentTarget)
                    onClose(); } }, [
                h("div", { className: "dshc-drawer", style: { position: "relative" } }, [
                    h("button", { type: "button", className: "dshc-btn ghost dshc-close", onClick: onClose, "aria-label": "close" }, "\u2715"),
                    h("div", { className: "dshc-drawertitle" }, event.summary),
                    h("div", { className: "dshc-sub" }, [
                        formatWhen(event),
                        h("span", { className: "dshc-tag" }, formatDuration(event))
                    ].filter(Boolean)),
                    h("dl", { className: "dshc-kv" }, [
                        event.rrule ? h("dt", { key: "rdt" }, t("repeat.recurring")) : null,
                        event.rrule ? h("dd", { key: "rdd" }, humanRepeat(event.rrule) + " · " + event.rrule) : null,
                        event.isOccurrence && !event.rrule ? h("dt", { key: "odt" }, t("repeat.occurrence")) : null,
                        event.isOccurrence && !event.rrule ? h("dd", { key: "odd" }, (seriesCount > 0 ? seriesCount + " / " : "") + t("repeat.occurrence")) : null,
                        event.location ? h("dt", { key: "ldt" }, t("field.location")) : null,
                        event.location ? h("dd", { key: "ldd" }, event.location) : null,
                        event.description ? h("dt", { key: "ddt" }, t("field.description")) : null,
                        event.description ? h("dd", { key: "ddd", style: { whiteSpace: "pre-wrap" } }, event.description) : null,
                        h("dt", { key: "udt" }, t("field.uid")),
                        h("dd", { key: "udd" }, h("span", { className: "dshc-mono" }, event.uid))
                    ].filter(Boolean)),
                    h("div", { className: "dshc-actions" }, [
                        h(Btn, { key: "copy", onClick: async () => { const ok = await copyText(event.uid); if (ok) {
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1600);
                            } } }, copied ? t("action.copied") : t("action.copy")),
                        h("span", { className: "dshc-spacer" }),
                        confirmDelete
                            ? h(Btn, { key: "confirm", variant: "primary", disabled: busy === true || readOnly === true, onClick: () => onDelete(event) }, t("action.confirmDelete"))
                            : h(Btn, { key: "delete", variant: "danger", onClick: () => setConfirmDelete(true), disabled: busy === true || readOnly === true }, t("action.delete")),
                        h(Btn, { key: "edit", variant: "outline", onClick: () => onEdit(event), disabled: busy === true || readOnly === true }, t("action.edit"))
                    ]),
                    confirmDelete ? h("div", { className: "dshc-sub", style: { textAlign: "right", marginTop: "6px" } }, t(isRecurring(event) ? "confirm.deleteSeries" : "confirm.delete", { name: event.summary })) : null
                ])
            ]);
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
            const { connection, onClose, onSaved } = props;
            const formId = useId();
            const [form, setForm] = useState(() => connectionDraftOf(connection));
            const [busy, setBusy] = useState("");
            const [result, setResult] = useState(null);
            const maySave = connection === null || connection.settingsAvailable !== false;
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
            const body = h("div", null, [
                h("div", { className: "dshc-sub", style: { marginBottom: "10px" } }, t("conn.intro")),
                h("p", { className: "dshc-sub", style: { marginBottom: "10px" } }, t("conn.credentials")),
                maySave !== true
                    ? h("div", { className: "dshc-alert warn" }, t("conn.noSettings"))
                    : null,
                h("div", { className: "dshc-field" }, [
                    h("label", { htmlFor: formId + "-provider" }, t("conn.provider")),
                    h("select", { id: formId + "-provider", className: "dshc-input", "aria-label": t("conn.provider"), value: form.provider, onChange: (e) => patch({ provider: e.target.value }) }, [h("option", { value: "", key: "__none" }, "— " + t("conn.needProvider") + " —")].concat(PROVIDER_NAMES.map((name) => h("option", { value: name, key: name }, name === "custom" ? t("provider.custom") : name === "icloud" ? "iCloud" : name === "nextcloud" ? "Nextcloud" : "Google"))))
                ]),
                PROVIDER_HINT[form.provider] ? h("div", { className: "dshc-sub", style: { marginBottom: "8px" } }, t(PROVIDER_HINT[form.provider])) : null,
                form.provider === "" ? null : h("details", { className: "dshc-steps" }, [
                    h("summary", { key: "sum" }, t("conn.steps")),
                    h("ol", { key: "list" }, (UI[UI_LANG]["steps." + form.provider] || []).map((line, index) => h("li", { key: "s" + index }, line))),
                    (PROVIDER_LINKS[form.provider] || []).length === 0 ? null : h("div", { key: "links", style: { marginTop: "6px", display: "flex", gap: "10px", flexWrap: "wrap" } }, (PROVIDER_LINKS[form.provider] || []).map((link) => h("a", { key: link.href, href: link.href, target: "_blank", rel: "noreferrer", className: "dshc-link" }, t(link.key))))
                ]),
                visible.map((key) => {
                    const secret = SECRET_FIELDS.indexOf(key) !== -1;
                    const stored = connection !== null && connection !== undefined && ((key === "password" && connection.hasPassword === true)
                        || (key === "clientSecret" && connection.hasClientSecret === true)
                        || (key === "refreshToken" && connection.hasRefreshToken === true));
                    const hintKey = FIELD_HINT[form.provider] ? FIELD_HINT[form.provider][key] : undefined;
                    return h("div", { className: "dshc-field", key }, [
                        h("label", { htmlFor: formId + "-" + key }, t(FIELD_LABEL[key])),
                        h(Txt, {
                            id: formId + "-" + key,
                            type: secret ? "password" : "text",
                            "aria-label": t(FIELD_LABEL[key]),
                            value: form[key] || "",
                            placeholder: stored ? t("conn.keep") : "",
                            onChange: (e) => patch({ [key]: e.target.value })
                        }),
                        hintKey ? h("div", { className: "dshc-sub", style: { marginTop: "3px" } }, t(hintKey)) : null
                    ]);
                }),
                result !== null
                    ? h("div", { className: "dshc-alert " + (result.ok === true ? "demo" : "error") }, (result.ok === true ? "✓ " : t("conn.fail") + "：") + result.text)
                    : null,
                h("div", { className: "dshc-actions" }, [
                    h(Btn, { key: "cancel", onClick: onClose, disabled: busy !== "" }, t("action.cancel")),
                    h(Btn, { key: "test", onClick: test, disabled: busy !== "" || form.provider === "" }, busy === "test" ? t("conn.testing") : t("conn.test")),
                    h(Btn, { key: "save", variant: "primary", onClick: save, disabled: busy !== "" || form.provider === "" || maySave !== true }, busy === "save" ? t("conn.saving") : t("conn.save"))
                ]),
                maySave !== true || (connection !== null && connection !== undefined && connection.settingsKind === "file")
                    ? h("div", { className: "dshc-sub", style: { marginTop: "10px" } }, connection !== null && connection !== undefined && connection.settingsKind === "file"
                        ? t("conn.storageFallback")
                        : t("conn.current", { summary: connectionSummary(connection) }))
                    : null
            ]);
            return h(Dlg, { open: true, onClose, title: t("conn.title"), children: body });
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
            const run = async (committing) => {
                if (busy)
                    return;
                setBusy(true);
                setError("");
                const abort = new AbortController();
                controller.current = abort;
                const timer = setTimeout(() => abort.abort(), 125000);
                try {
                    const value = await importApi(committing ? "commit" : "preview", committing ? { id: preview.id, selected, confirmed: true } : { ics: content, floatingTimezone: timezone }, abort.signal);
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
            return h("section", { className: "dshc-import", "aria-label": t("import.title"), "aria-busy": busy }, [
                h("h3", { key: "title" }, t("import.title")), h("p", { key: "intro", className: "dshc-sub" }, t("import.intro")),
                h("label", { key: "file" }, [t("import.file"), h("input", { type: "file", accept: ".ics,text/calendar", disabled: busy, onChange: loadFile })]),
                h("label", { key: "paste" }, [t("import.paste"), h("textarea", { value: content, rows: 5, disabled: busy, onChange: e => update(e.target.value), spellCheck: false })]),
                h("label", { key: "zone" }, [t("import.timezone"), h("select", { value: timezone, disabled: busy, onChange: e => { setTimezone(e.target.value); reset(); } }, [h("option", { key: "empty", value: "" }, t("import.chooseZone")), ...zones.map(zone => h("option", { key: zone, value: zone }, zone === "Asia/Shanghai" ? (UI_LANG === "en" ? "Beijing time · Asia/Shanghai" : "北京时间 · Asia/Shanghai") : zone))])]),
                h("p", { key: "limit", className: "dshc-sub" }, t("import.limit")),
                h("div", { key: "actions", className: "dshc-import-actions" }, [h(Btn, { key: "preview", disabled: busy || !content.trim(), onClick: () => run(false) }, busy ? t("import.busy") : t("import.preview")), h(Btn, { key: "close", disabled: busy, onClick: props.onClose }, t("import.close")), busy ? h(Btn, { key: "stop", onClick: () => controller.current && controller.current.abort() }, t("import.stop")) : null]),
                error ? h("div", { key: "error", className: "dshc-alert error", role: "alert" }, error) : null,
                preview ? h("div", { key: "preview-data" }, [
                    preview.connectionReady === false ? h("div", { key: "connection", className: "dshc-alert warn" }, [backendMessage(preview.connectionMessage), h(Btn, { onClick: props.onConnection }, t("import.connection"))]) : null,
                    h("p", { key: "scope", className: "dshc-sub" }, t("import.scope")),
                    preview.ignored ? h("p", { key: "ignored" }, t("import.ignored", { n: preview.ignored })) : null,
                    h("div", { key: "rows", className: "dshc-import-rows" }, preview.rows.map(row => {
                        const result = results[row.id], status = result ? result.status : row.status;
                        return h("div", { key: row.id, className: "dshc-import-row" }, [
                            h("label", { key: "select", className: "dshc-import-pick" }, [h("input", { type: "checkbox", checked: selected.includes(row.id), disabled: busy || row.status !== "ready" || ["imported", "duplicate"].includes(status) || (!selected.includes(row.id) && selected.length >= 20), onChange: e => setSelected(prev => e.target.checked ? prev.concat(row.id) : prev.filter(id => id !== row.id)) }), h("strong", null, row.summary)]),
                            h("span", { key: "status", className: "dshc-tag" }, t("import." + status)), h("p", { key: "date" }, importDate(row)),
                            row.recurring ? h("p", { key: "repeat" }, t("import.recurring", { n: row.exceptions })) : null,
                            status !== "duplicate" && status !== "imported" && row.conflicts ? h("p", { key: "conflict", className: "dshc-import-warning" }, t("import.conflicts", { n: row.conflicts })) : null,
                            ...(status === "duplicate" || status === "imported" ? [] : row.warnings.concat(row.errors)).map((message, i) => h("p", { key: "message-" + i, className: "dshc-import-warning" }, backendMessage(message))),
                            result && result.message ? h("p", { key: "failure", role: "alert" }, backendMessage(result.message)) : null
                        ]);
                    })),
                    count.length ? h("p", { key: "results", role: "status", "aria-live": "polite" }, t("import.results", { ok: count.filter(r => r.status === "imported").length, duplicate: count.filter(r => r.status === "duplicate").length, failed: count.filter(r => r.status === "failed").length })) : null,
                    count.some(r => r.status === "failed") ? h("p", { key: "retry" }, t("import.retryHint")) : null,
                    !eligible.length && !count.length ? h("p", { key: "no-ready" }, t("import.noReady")) : null,
                    h("div", { key: "commit", className: "dshc-import-actions" }, [h(Btn, { key: "select", disabled: busy || !eligible.length, onClick: () => setSelected(eligible.slice(0, 20).map(row => row.id)) }, t("import.select")), h(Btn, { key: "clear", disabled: busy, onClick: () => setSelected([]) }, t("import.clear")), h(Btn, { key: "commit", variant: "primary", disabled: busy || !preview.connectionReady || !selected.length, onClick: () => run(true) }, t("import.commit", { n: selected.length }))])
                ]) : null
            ]);
        }
        function CalendarPanel(props) {
            useUILanguage();
            const compact = props.compact === true;
            const [view, setView] = useState(loadStoredView);
            const [anchor, setAnchor] = useState(() => new Date());
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
            const [importOpen, setImportOpen] = useState(false), [importBusy, setImportBusy] = useState(false);
            const layerOpen = draft !== null || selected !== null || connOpen === true;
// Update protection: dsh-calendar
__stardustUpdatesGuard(React, "dsh-calendar", { busy: busy || importBusy || layerOpen || importOpen });

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
                const kept = layerOrderRef.current.filter((key) => openKeys.indexOf(key) !== -1);
                const added = openKeys.filter((key) => kept.indexOf(key) === -1);
                layerOrderRef.current = kept.concat(added);
            }, [draft, connOpen, selected]);
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
                    }
                    else if (top === "conn")
                        setConnOpen(false);
                    else if (top === "selected") {
                        setSelected(null);
                        setConfirmDelete(false);
                    }
                };
                return registerLayerEscape(root, closeTop);
            }, [draft, selected, connOpen]);
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
            const visibleEvents = useMemo(() => data.events.map((event) => {
                const override = overrides[event.uid];
                return override === undefined ? event : Object.assign({}, event, override);
            }), [data.events, overrides]);
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
                    notify(form.uid === undefined ? "已创建" : "已保存");
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
                    notify("已删除");
                }
                catch (error) {
                    setBanner(backendMessage(error));
                }
                finally {
                    setBusy(false);
                }
            };
            const toolbar = compact ? (h("div", { className: "dshc-toolbar" }, [
                h("h3", { className: "dshc-title", key: "title" }, t("section.title")),
                h("div", { className: "dshc-tabs", key: "tabs" }, VIEWS.map((name) => h("button", {
                    key: name, type: "button", className: "dshc-tab" + (view === name ? " on" : ""),
                    onClick: () => { setView(name); storeView(name); }
                }, t("view." + name)))),
                h("span", { className: "dshc-spacer", key: "spacer" }),
                h("span", { className: "dshc-monthhead", key: "period" }, title),
                h(Btn, { key: "prev", onClick: () => step(-1), "aria-label": t("action.prev") }, "\u2039"),
                h(Btn, { key: "today", onClick: () => setAnchor(new Date()) }, t("action.today")),
                h(Btn, { key: "next", onClick: () => step(1), "aria-label": t("action.next") }, "\u203a"),
                h(Btn, { key: "conn", disabled: configured === null, onClick: () => setConnOpen(true) }, t("conn.button")),
                h(Btn, { key: "import", disabled: demo === true || importBusy, onClick: () => setImportOpen(value => !value) }, t("import.open")),
                demo === true
                    ? h(Btn, { key: "exitdemo", onClick: () => setDemo(false) }, t("action.exitDemo"))
                    : h(Btn, { key: "reload", onClick: reload }, t("action.refresh")),
                h(Btn, { key: "new", variant: "primary", disabled: demo === true, onClick: () => setDraft(draftAt(anchor)) }, t("action.new"))
            ])) : h('div',{className:'calendar-toolbar'},
 h('div',{className:'calendar-period'},h(W.IconButton,{icon:'left',label:t('action.prev'),onClick:()=>step(-1)}),h('strong',null,title),h(W.IconButton,{icon:'right',label:t('action.next'),onClick:()=>step(1)}),h(W.Button,{onClick:()=>setAnchor(new Date())},t('action.today'))),
 h('div',{className:'calendar-view-controls',role:'group','aria-label':calendarText('日历视图','Calendar view')},VIEWS.map(name=>h(W.Button,{key:name,'aria-pressed':view === name,onClick:()=>{setView(name);storeView(name);}},t('view.'+name))),demo?h(W.Button,{onClick:()=>setDemo(false)},t('action.exitDemo')):h(W.IconButton,{icon:'refresh',label:t('action.refresh'),onClick:reload})));;
            const body = () => {
                if (demo === false && configured === false) {
                    return h("div", { className: "dshc-empty" }, [
                        h("h3", null, t("state.notConfigured")),
                        h("p", null, t("state.notConfiguredHint")),
                        h("div", { style: { marginTop: "12px", display: "flex", gap: "8px", justifyContent: "center" } }, [
                            h(Btn, { key: "cfg", variant: "primary", onClick: () => setConnOpen(true) }, t("conn.button")),
                            h(Btn, { key: "demo", onClick: () => setDemo(true) }, t("action.demo"))
                        ])
                    ]);
                }
                if (configured === null)
                    return h("div", { className: "dshc-grid" }, Array.from({ length: 7 }, (_, i) => h("div", { className: "dshc-skel", key: i })));
                if (data.loading === true && data.events.length === 0) {
                    return h("div", { className: "dshc-grid" }, Array.from({ length: 14 }, (_, i) => h("div", { className: "dshc-skel", key: i })));
                }
                if (view === "week")
                    return h(WeekView, { anchor, events: visibleEvents, onPick: openEvent, onCreateAt: createAt, onReschedule: demo === true ? undefined : reschedule });
                if (view === "agenda")
                    return h(AgendaView, { events: visibleEvents, onPick: openEvent, onCreateAt: createAt });
                return h(MonthView, { anchor, events: visibleEvents, onPick: openEvent, onCreateAt: createAt });
            };
            const openEvent = (event) => { setConfirmDelete(false); setSelected(event); };
            const createAt = (day, hour) => {
                if (demo === true) {
                    notify(t("demo.banner"));
                    return;
                }
                setDraft(draftAt(day, hour));
            };
            const content = h("div", { ref: rootRef, className: "dshc-root" }, [
                h("div", { className: "dshc-shell" }, [
                    banner !== null ? h("div", { className: "dshc-alert demo", role: "status", "aria-live": "polite" }, banner) : null,
                    undo !== null
                        ? h("div", { className: "dshc-undo", role: "status", "aria-live": "polite" }, [
                            h("span", { key: "text" }, t("move.saved") + "：" + (undo.summary || "")),
                            h("button", { key: "undo", type: "button", className: "dshc-undo-btn", onClick: undoMove }, t("move.undo"))
                        ])
                        : null,
                    demo === true ? h("div", { className: "dshc-alert demo" }, t("demo.banner")) : null,
                    data.error !== null && data.error !== undefined && demo === false && configured !== false
                        ? h("div", { className: "dshc-alert error" }, [
                            h("span", null, backendMessage(data.error) || t("error.load")),
                            h("span", { className: "dshc-spacer" }),
                            h(Btn, { onClick: reload }, t("action.retry"))
                        ])
                        : null,
                    compact === true ? toolbar : h("div", null, [toolbar]),
                    importOpen ? h(IcsImportPanel, { key: "ics-import", onBusy: setImportBusy, onClose: () => setImportOpen(false), onConnection: () => setConnOpen(true), onImported: reload }) : null,
                    body(),
                    h("div", { className: "dshc-footer" }, [
                        h("span", null, t("count.events", { n: data.events.length }) + (data.events.some((e) => e.isOccurrence) ? " · " + t("count.occurrences", { n: data.events.filter((e) => e.isOccurrence).length }) : "")),
                        h("span", null, demo === true ? "" : (conn !== null && conn !== undefined && conn.configured === true ? t("conn.current", { summary: connectionSummary(conn) }) : ""))
                    ])
                ]),
                selected !== null
                    ? h(EventDrawer, {
                        readOnly: demo === true,
                        event: selected,
                        events: data.events,
                        busy,
                        confirmDelete,
                        setConfirmDelete,
                        onClose: () => { setSelected(null); setConfirmDelete(false); },
                        onEdit: async (event) => {
                            if (!isRecurring(event) || demo) {
                                setSelected(null);
                                setDraft(draftOfEvent(event));
                                return;
                            }
                            setBusy(true);
                            try {
                                const value = await api("event", { uid: event.uid });
                                setSelected(null);
                                setDraft({ ...draftOfEvent(value.event), isSeries: true });
                            }
                            catch (error) {
                                setBanner(backendMessage(error));
                            }
                            finally {
                                setBusy(false);
                            }
                        },
                        onDelete: remove
                    })
                    : null,
                draft !== null
                    ? h(EventForm, { draft, events: data.events, busy, error: formError, onCancel: () => { setDraft(null); setFormError(null); }, onSubmit: submit })
                    : null,
                connOpen === true
                    ? h(ConnectionForm, {
                        connection: conn,
                        onClose: () => setConnOpen(false),
                        onSaved: (value) => {
                            if (value && value.connection)
                                setConn(value.connection);
                            setConnOpen(false);
                            setDemo(false);
                            reload();
                            notify(t("conn.savedToast"));
                        }
                    })
                    : null
            ]);
if(compact) return content;
return __stardustUpdatesInlinePage(React,h(W.Page,{workbench:props.workbench===true,title:t('section.title'),subtitle:calendarText('查看日程、安排时间和管理导入。','View events, plan time and manage imports.'),className:'calendar-workbench',actions:h(React.Fragment,null,
 h(W.Button,{icon:'link',disabled:configured===null,onClick:()=>setConnOpen(true)},calendarText('日历连接','Calendar connection')),
 h(W.Button,{icon:'upload',disabled:demo || importBusy,onClick:()=>setImportOpen(value=>!value)},t('import.open')),
 h(W.Button,{variant:'primary',disabled:demo || configured!==true,title:configured!==true?calendarText('请先连接日历','Connect a calendar first'):undefined,onClick:()=>setDraft(draftAt(anchor))},t('action.new')))},h('style',null,CALENDAR_WORKBENCH_CSS),content),"dsh-calendar");
        }
        /** 月份平移：先跳到本月 1 号再加月，避免 1 月 31 日 +1 个月变成 3 月 3 日。 */
        function addMonthShift(date, delta) {
            const first = new Date(date.getFullYear(), date.getMonth(), 1);
            const shifted = new Date(first.getFullYear(), first.getMonth() + delta, 1);
            const lastDay = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
            return new Date(shifted.getFullYear(), shifted.getMonth(), Math.min(date.getDate(), lastDay));
        }
        /** 设置页里的那一节。 */
        function CalendarSection({workbench=false}={}) { return h(CalendarPanel,{workbench}); }
        /** 对话页右下角的小按钮 + 悬浮面板（自己挂 root，不占用宿主槽位）。 */
        function Launcher() {
const [activePanel,setActivePanel]=useState(null);
useEffect(()=>{let layout;try{layout=calendarHostContext?.get?.('layout') || calendarHostContext?.layout;}catch{}if(!layout?.panelInfo)return;const update=()=>setActivePanel(layout.panelInfo.getSnapshot().activePanelId);update();return layout.panelInfo.subscribe(update);},[]);
            useUILanguage();
            const [open, setOpen] = useState(false);
            const [layerOpen, setLayerOpen] = useState(false);
            useEffect(() => {
                if (open !== true)
                    return () => { };
                const onKey = (event) => {
                    if (event.key !== "Escape" || event.isComposing === true)
                        return;
                    // 浮层交给 CalendarPanel 的层栈；宿主 Portal 的 Esc 交给宿主组件。
                    if (layerOpen === true)
                        return;
                    setOpen(false);
                };
                document.addEventListener("keydown", onKey);
                return () => document.removeEventListener("keydown", onKey);
            }, [open, layerOpen]);
            const calendarIcon = h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" }, [
                h("rect", { key: "r", x: 3, y: 5, width: 18, height: 16, rx: 3 }),
                h("path", { key: "l", d: "M3 10h18M8 3v4M16 3v4" })
            ]);
            if(activePanel) return null;
return h("div", null, [
                h("button", {
                    type: "button",
                    className: "dshc-fab" + (open === true ? " on" : ""),
                    title: t("nav.title"),
                    "aria-label": t("nav.title"),
                    onClick: () => setOpen((value) => !value)
                }, calendarIcon),
                open === true ? h("div", { className: "dshc-float" }, h(CalendarPanel, { compact: true, onLayerChange: setLayerOpen })) : null
            ]);
        }
        // ───────────────────────────── 挂载 ─────────────────────────────
        const inject = ["slots", "locale"];
        function apply(ctx) {
calendarHostContext=ctx;W.register(ctx,{id:'dsh-calendar.workbench',label:()=>t('nav.title'),icon:'calendar',component:CalendarSection,order:58});

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
                    style.textContent = CSS + CSS_EXTRA + ".dshc-import{margin:12px 0;padding:14px;border:1px solid var(--dsw-alias-border-l2,#d5d9df);border-radius:12px;min-width:0}.dshc-import h3{margin:0 0 8px}.dshc-import label{display:block;font-size:12px;margin:10px 0}.dshc-import input[type=file],.dshc-import textarea,.dshc-import select{display:block;box-sizing:border-box;width:100%;max-width:100%;margin-top:5px;border:1px solid var(--dsw-alias-border-l2,#ccc);border-radius:8px;padding:7px;color:inherit;background:var(--dsw-alias-bg-layer-1,#fff)}.dshc-import textarea{resize:vertical;font:12px/1.5 monospace}.dshc-import-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.dshc-import-rows{max-height:480px;overflow:auto}.dshc-import-row{padding:10px 4px;border-bottom:1px solid var(--dsw-alias-border-l2,#ddd);overflow-wrap:anywhere}.dshc-import-row p{font-size:12px;margin:5px 0}.dshc-import .dshc-import-pick{display:flex;align-items:flex-start;gap:8px}.dshc-import-pick input{margin-top:2px;flex-shrink:0}.dshc-import-warning{color:var(--dsw-alias-state-warn-primary,#886200)}";
                    style.textContent += "@media(max-width:700px){[role=dialog]:has(.dshc-root){width:100%!important;max-width:100%!important;flex-direction:column!important}[role=dialog]:has(.dshc-root)>nav+div{min-width:0;width:100%}[role=dialog]:has(.dshc-root)>nav+div>div:has(.dshc-root){padding:12px!important;min-width:0}[role=dialog]:has(.dshc-root) nav{width:100%!important;flex-basis:auto!important;border-right:0;max-height:170px;overflow:auto}[role=dialog]:has(.dshc-root) nav>div:has(>button){display:flex;flex-direction:row!important;flex-wrap:wrap;flex-shrink:0;gap:4px}}";
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
    } },{"name":"dsh-calendar","version":"0.1.0","hasWorkbench":true,"packageVersion":"0.13.2","label":"日历","labelEn":"Calendar","suiteComponent":true}));

})();

/* STARDUSTLC_UPDATE_CLIENT_BODY_END */
})();
