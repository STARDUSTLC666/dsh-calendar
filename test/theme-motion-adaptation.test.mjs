import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const ROOT_URL = new URL('../', import.meta.url);
const PKG = JSON.parse(readFileSync(new URL('package.json', ROOT_URL), 'utf8'));
const SOURCE = readFileSync(new URL('lib/client.js', ROOT_URL), 'utf8').replace(/\r\n/g, '\n');
const EXPOSE = 'module.exports.__themeProbe = { CalendarPanel, Launcher, ConnectionForm, CoachmarkTour, computeTourLayout, DSH_STYLES, DSH_FONTS, DSH_DEFAULT_FONT, writeDshStyle, readDshStyle, writeDshFont, readDshFont, calendarAppearance, CSS };';
if (!SOURCE.includes('return module.exports;')) {
  throw new Error('client.js export contract changed');
}
const PATCHED = SOURCE.replace('return module.exports;', EXPOSE + '\nreturn module.exports;');

async function mountEnv({ withHostModal = false, darkHost = false, events = [] } = {}) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
    url: 'http://localhost/',
  });
  const win = dom.window;
  if (darkHost) win.document.body.setAttribute('data-ds-dark-theme', '');

  win.fetch = async (_url, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    if (body.action === 'connection') {
      return { ok: true, status: 200, json: async () => ({ ok: true, value: { configured: true, provider: 'custom', caldavUrl: 'https://example.test/dav', username: 'u' } }) };
    }
    return { ok: true, status: 200, json: async () => ({ ok: true, value: { count: events.length, start: '', end: '', events } }) };
  };
  globalThis.fetch = win.fetch;
  win.AbortSignal.timeout = () => undefined;
  globalThis.window = win;
  globalThis.document = win.document;
  try {
    Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true });
  } catch {}
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  const react = await import('react');
  const reactDomClient = await import('react-dom/client');
  const reactDom = await import('react-dom');

  function PortalModal(props) {
    if (!props.open) return null;
    return reactDom.createPortal(
      react.createElement('div', { className: 'host-portal-modal', role: 'dialog', 'aria-label': props.title }, props.children),
      win.document.body,
    );
  }

  let captured = null;
  win.__ModuleLoader__ = {
    load(entry) {
      captured = entry.factory(name => {
        if (name === 'react') return react;
        if (name === 'react-dom/client') return reactDomClient;
        if (name === '@deepseek-ai/dsh-client-ui-primitives' && withHostModal) {
          return { Modal: PortalModal };
        }
        throw new Error('Module not mounted in standalone test: ' + name);
      });
    },
  };

  new Function('window', 'document', 'navigator', PATCHED)(win, win.document, win.navigator);

  async function render(element) {
    const container = win.document.createElement('div');
    win.document.body.appendChild(container);
    const root = reactDomClient.createRoot(container);
    await react.act(async () => {
      root.render(element);
    });
    return {
      container,
      unmount: async () => {
        await react.act(async () => root.unmount());
        win.close();
      },
    };
  }

  return { win, react, probe: captured.__themeProbe, render };
}

test('DSH >=0.2.2-rc.3 manifest, window clearances, drag exclusion, and dsh-updates footer are intact', async () => {
  assert.equal(PKG.engines?.dsh, '>=0.2.2-rc.3');
  assert.deepEqual(PKG.dsh?.client?.inject, [
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-client-ui-layout',
    '@deepseek-ai/dsh-client-ui-sidebar',
  ]);
  assert.match(SOURCE, /data-plugin-update-footer|__StardustPluginUpdatesFooter/);
  const { probe, win } = await mountEnv();
  try {
    assert.match(probe.CSS, /--dsh-frame-top-clearance/);
    assert.match(probe.CSS, /--dsh-frame-leading-clearance/);
    assert.match(probe.CSS, /\[data-window-drag-exclude\]\{-webkit-app-region:no-drag\}/);
  } finally {
    win.close();
  }
});

test('never-too-dark: pitch-black surfaces are eliminated and host dark mode uses breathable slate', async () => {
  assert.doesNotMatch(SOURCE, /#090a0f|#0b0d13|#10121a|#121211|#151517/i);
  const { probe, win } = await mountEnv({ darkHost: true });
  try {
    for (const layout of ['native', 'floating', 'spotlight', 'cards']) {
      const vars = probe.calendarAppearance(layout, 'default', 'dark', 'harness');
      assert.match(vars['--dsw-alias-bg-base'], /^#(1f232b|20242c)$/i, `layout ${layout} dark base must be soft slate`);
      assert.match(vars['--dsw-alias-bg-layer-1'], /^#(272c36|282d37)$/i, `layout ${layout} dark layer-1 must be soft slate`);
    }
    const lightVars = probe.calendarAppearance('native', 'default', 'light', 'harness');
    assert.equal(lightVars['--dsw-alias-bg-base'], '#ffffff');
  } finally {
    win.close();
  }
});

test('13-style theme switcher & 8-font pairing switcher sync workbench, harmonizes layout/palette, and updates portaled Modal dialogs', async () => {
  const { win, react, probe, render } = await mountEnv({ withHostModal: true });
  const { container, unmount } = await render(react.createElement(probe.CalendarPanel, { workbench: true }));
  try {
    assert.deepEqual(
      Array.from(probe.DSH_STYLES, item => item.id),
      ['harness', 'cream', 'claude', 'pixel8bit', 'mint', 'glass', 'eink', 'blueprint', 'risograph', 'win98', 'songhui', 'frutiger', 'gazette'],
    );
    assert.equal(probe.DSH_DEFAULT_FONT, 'arcade');
    assert.deepEqual(
      Array.from(probe.DSH_FONTS, item => item.id),
      ['arcade', 'auto', 'songkai', 'fangsong', 'poster', 'retro98', 'serif', 'modern'],
    );
    assert.ok(probe.CSS.toLowerCase().includes('#f6f3ec'), 'gazette newsprint surface present in CSS');
    const rootSection = container.querySelector('.dshc-root');
    assert.equal(rootSection.getAttribute('data-dsh-style'), 'harness');
    assert.equal(rootSection.getAttribute('data-dsh-font'), 'arcade');

    // Open StyleSwitcher menu and pick pixel8bit
    const switcherTrigger = container.querySelector('.dsh-style-trigger');
    assert.ok(switcherTrigger, 'StyleSwitcher trigger must render in topbar');
    await react.act(async () => {
      switcherTrigger.click();
    });
    const pixelOption = [...container.querySelectorAll('[role="menuitemradio"]')].find(el => el.textContent.includes('8-Bit'));
    assert.ok(pixelOption, '8-Bit preset option must appear in menu');
    await react.act(async () => {
      pixelOption.click();
    });

    assert.equal(win.localStorage.getItem('dsh-stardust:ui-style'), 'pixel8bit');
    assert.equal(rootSection.getAttribute('data-dsh-style'), 'pixel8bit');
    // Custom style defers surface tokens to CSS instead of inline overriding --dsw-alias-bg-base
    assert.equal(rootSection.style.getPropertyValue('--dsw-alias-bg-base'), '');

    // Open FontSwitcher menu and pick songkai
    const fontTrigger = container.querySelector('.dsh-font-trigger');
    assert.ok(fontTrigger, 'FontSwitcher trigger must render beside StyleSwitcher');
    await react.act(async () => {
      fontTrigger.click();
    });
    const songkaiOption = [...container.querySelectorAll('[role="menuitemradio"]')].find(el => el.textContent.includes('中宋+楷书'));
    assert.ok(songkaiOption, 'Song + Kai font option must appear in FontSwitcher menu');
    await react.act(async () => {
      songkaiOption.click();
    });
    assert.equal(win.localStorage.getItem('dsh-stardust:ui-font'), 'songkai');
    assert.equal(rootSection.getAttribute('data-dsh-font'), 'songkai');

    // Picking a custom calendar palette swatch ("极光紫") harmonizes accent without clobbering bg-base
    const auroraSwatch = container.querySelector('button[aria-label="极光紫"]');
    assert.ok(auroraSwatch);
    await react.act(async () => {
      auroraSwatch.click();
    });
    assert.equal(rootSection.style.getPropertyValue('--dsw-alias-accent'), '#7c3aed');
    assert.equal(rootSection.style.getPropertyValue('--dsw-alias-bg-base'), '');

    // Open New Event dialog (portaled to document.body via HostModal) and verify portal sync + drag exclusion
    let newBtn = null;
    for (let i = 0; i < 30 && !newBtn; i++) {
      newBtn = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === '新建日程' && !b.disabled);
      if (!newBtn) await react.act(async () => new Promise(r => setTimeout(r, 10)));
    }
    assert.ok(newBtn, 'New event button must become enabled');
    await react.act(async () => {
      newBtn.click();
    });

    const portalDialog = win.document.body.querySelector('.host-portal-modal[role="dialog"]');
    assert.ok(portalDialog, 'Modal must portal to document.body');
    assert.equal(portalDialog.getAttribute('data-dsh-style'), 'pixel8bit');
    assert.equal(portalDialog.getAttribute('data-dsh-font'), 'songkai');
    assert.equal(portalDialog.hasAttribute('data-window-drag-exclude'), true);

    // Cross-plugin broadcast via writeDshStyle & writeDshFont updates both workbench root and open portaled dialog live
    await react.act(async () => {
      probe.writeDshStyle('gazette', win);
      probe.writeDshFont('fangsong', win);
    });
    assert.equal(rootSection.getAttribute('data-dsh-style'), 'gazette');
    assert.equal(rootSection.getAttribute('data-dsh-font'), 'fangsong');
    assert.equal(portalDialog.getAttribute('data-dsh-style'), 'gazette');
    assert.equal(portalDialog.getAttribute('data-dsh-font'), 'fangsong');
  } finally {
    await unmount();
  }
});

test('floating Launcher and SVG micro-animation icons expose data-window-drag-exclude, data-dsh-icon, and reduced-motion rules', async () => {
  const { win, react, probe, render } = await mountEnv();
  await react.act(async () => {
    probe.writeDshStyle('mint', win);
    probe.writeDshFont('retro98', win);
  });
  const { container, unmount } = await render(react.createElement(probe.Launcher, {}));
  try {
    const fab = container.querySelector('.dshc-fab');
    assert.ok(fab);
    assert.equal(fab.getAttribute('data-dsh-style'), 'mint');
    assert.equal(fab.getAttribute('data-dsh-font'), 'retro98');
    assert.equal(fab.hasAttribute('data-window-drag-exclude'), true);

    await react.act(async () => {
      fab.click();
    });
    const floatPanel = container.querySelector('.dshc-float');
    assert.ok(floatPanel);
    assert.equal(floatPanel.getAttribute('data-dsh-style'), 'mint');
    assert.equal(floatPanel.getAttribute('data-dsh-font'), 'retro98');
    assert.equal(floatPanel.hasAttribute('data-window-drag-exclude'), true);

    const icons = [...container.querySelectorAll('svg[data-dsh-icon]')].map(el => el.getAttribute('data-dsh-icon'));
    for (const expected of ['calendar', 'refresh', 'down']) {
      assert.ok(icons.includes(expected), `expected SVG icon with data-dsh-icon="${expected}", got ${icons.join(',')}`);
    }

    assert.match(probe.CSS, /steps\(2,\s*end\)/);
    assert.match(probe.CSS, /dsh-icon-wiggle/);
    assert.match(probe.CSS, /dsh-icon-pop/);
    assert.match(probe.CSS, /@starting-style/);
    assert.match(probe.CSS, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  } finally {
    await unmount();
  }
});

test('CoachmarkTour (? 引导), spotlight + directional arrow, inline prompt copy, modal auto-close, and >=0.2.2-rc.3 docs work end-to-end', async () => {
  const refZh = readFileSync(new URL('docs/REFERENCE.zh.md', ROOT_URL), 'utf8');
  const refEn = readFileSync(new URL('docs/REFERENCE.en.md', ROOT_URL), 'utf8');
  const workbenchDoc = readFileSync(new URL('docs/WORKBENCH.md', ROOT_URL), 'utf8');
  assert.doesNotMatch(refZh + '\n' + refEn + '\n' + workbenchDoc, /0\.2\.1-rc\.3/);
  assert.match(refZh, />=0\.2\.2-rc\.3/);
  assert.match(refEn, />=0\.2\.2-rc\.3/);

  const { win, react, probe, render } = await mountEnv({ withHostModal: true });
  let copiedPrompt = '';
  Object.defineProperty(win.navigator, 'clipboard', {
    value: { async writeText(val) { copiedPrompt = String(val); } },
    configurable: true,
  });
  try { Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true }); } catch {}

  let popoverShown = 0;
  let popoverHidden = 0;
  win.HTMLElement.prototype.showPopover = function showPopover() { popoverShown += 1; };
  win.HTMLElement.prototype.hidePopover = function hidePopover() { popoverHidden += 1; };

  const { container, unmount } = await render(react.createElement(probe.CalendarPanel, { workbench: true }));
  try {
    // CSS includes popover polyfill selector, directional arrow rules, pixel8bit 0px/4px hard shadow, and reduced-motion gate
    assert.match(probe.CSS, /\[popover\]:is\(:popover-open,\s*\.\\:popover-open\)\s*\{\s*display:\s*block\s*\}/);
    assert.match(probe.CSS, /\[data-side=["']?bottom["']?\]\s*>/);
    assert.match(probe.CSS, /4px 4px 0px #1e2826/);
    assert.match(probe.CSS, /@media\s*\(prefers-reduced-motion:\s*no-preference\)/);

    // Zero static top-level workflow <details> clutter in calendar shell
    assert.equal(container.querySelectorAll('details').length, 0, 'static <details> workflow guide must be removed');

    const trigger = container.querySelector('[data-calendar-tour-trigger]');
    assert.ok(trigger, '? 引导 trigger button must sit in topbar actions');
    assert.match(trigger.textContent, /\?\s*引导/);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(trigger.hasAttribute('aria-haspopup'), false, 'must not set aria-haspopup on coachmark trigger');

    // Wait for first-visit 280ms auto-open timer; verify it does NOT steal focus
    await react.act(async () => new Promise(r => setTimeout(r, 320)));
    const autoCard = container.querySelector('[data-tour-card="connection"]');
    assert.ok(autoCard, 'first-visit auto-open must mount step 1 CoachmarkTour after 280ms');
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(popoverShown >= 1, true, 'tour layer promoted via showPopover()');
    const tourLayer = container.querySelector('[data-calendar-tour]');
    assert.equal(tourLayer.getAttribute('popover'), 'manual', 'setAttribute("popover", "manual") applied');
    assert.notEqual(win.document.activeElement, container.querySelector('[data-tour-next]'), 'auto-open must not hijack focus');

    // Opening a modal dialog (New Event) immediately closes the auto-opened tour
    let newBtn = null;
    for (let i = 0; i < 30 && !newBtn; i++) {
      newBtn = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === '新建日程' && !b.disabled);
      if (!newBtn) await react.act(async () => new Promise(r => setTimeout(r, 10)));
    }
    assert.ok(newBtn, 'New event button enabled');
    await react.act(async () => { newBtn.click(); });
    assert.equal(container.querySelector('[data-tour-card]'), null, 'auto-tour closes immediately when modal opens');

    // Close New Event modal via Escape or Cancel button
    const cancelBtn = [...win.document.body.querySelectorAll('.host-portal-modal button')].find(b => b.textContent.includes('取消'));
    assert.ok(cancelBtn, 'Cancel button in New event modal');
    await react.act(async () => { cancelBtn.click(); });
    assert.equal(win.document.body.querySelector('.host-portal-modal'), null);

    // Manually click `? 引导` in topbar: tour opens at step 1/4 and focuses [data-tour-next]
    await react.act(async () => { trigger.click(); });
    const step1Card = container.querySelector('[data-tour-card="connection"]');
    assert.ok(step1Card, 'manual trigger opens step 1');
    assert.equal(step1Card.getAttribute('role'), 'dialog');
    assert.equal(step1Card.getAttribute('aria-modal'), 'false');
    assert.ok(step1Card.getAttribute('aria-labelledby'));
    assert.ok(container.querySelector('[data-tour-spotlight="connection"]'), 'spotlight cutout rendered');
    assert.ok(step1Card.querySelector('[data-tour-arrow]'), 'directional 10x10 arrow rendered');
    assert.match(step1Card.textContent, /1 \/ 4/);
    assert.match(step1Card.textContent, /连接日历账号/);
    assert.equal(win.document.activeElement, step1Card.querySelector('[data-tour-next]'), 'manual open focuses Next button');

    // Advance to Step 2 (views & drag reschedule)
    await react.act(async () => { container.querySelector('[data-tour-next]').click(); });
    const step2Card = container.querySelector('[data-tour-card="views"]');
    assert.ok(step2Card);
    assert.match(step2Card.textContent, /2 \/ 4/);
    assert.match(step2Card.textContent, /日 \/ 周 \/ 月视图切换与拖拽改期/);

    // Advance to Step 3 (availability & inline 1-click prompt copy)
    await react.act(async () => { container.querySelector('[data-tour-next]').click(); });
    const step3Card = container.querySelector('[data-tour-card="availability"]');
    assert.ok(step3Card);
    assert.match(step3Card.textContent, /3 \/ 4/);
    const copyPromptBtn = step3Card.querySelector('[data-copy-prompt]');
    assert.ok(copyPromptBtn, 'Step 3 exposes inline 1-click prompt copy button');
    await react.act(async () => { copyPromptBtn.click(); });
    assert.equal(copiedPrompt, '帮我查一下本周工作时间的空闲时段，整理成可发送的会议候选时间');
    assert.equal(copyPromptBtn.getAttribute('data-copied'), 'true');
    assert.match(step3Card.querySelector('[role="status"]').textContent, /已复制指令/);

    // Advance to Step 4 (conflicts & smart drafts) and complete tour
    await react.act(async () => { container.querySelector('[data-tour-next]').click(); });
    const step4Card = container.querySelector('[data-tour-card="smart-draft"]');
    assert.ok(step4Card);
    assert.match(step4Card.textContent, /4 \/ 4/);
    assert.match(step4Card.textContent, /冲突检查与从文字 \/ 截图智能建日程/);
    const doneBtn = step4Card.querySelector('[data-tour-next]');
    assert.match(doneBtn.textContent, /完成引导/);

    await react.act(async () => { doneBtn.click(); });
    await react.act(async () => new Promise(r => setTimeout(r, 15)));
    assert.equal(container.querySelector('[data-tour-card]'), null, 'tour closes on Done');
    assert.equal(win.localStorage.getItem('dsh-calendar.tour.v1'), 'done', 'persists done in localStorage');
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(popoverHidden >= 1, true, 'hidePopover() called on unmount');
    assert.equal(win.document.activeElement, trigger, 'restores focus to ? 引导 trigger on manual close');
  } finally {
    await unmount();
  }
});

test('v3 header, sliding tab indicator, resizable split sidebar, shimmer skeleton, and row hover actions work in calendar', async () => {
  const now = new Date();
  const start = new Date(now.getTime() + 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const end = new Date(now.getTime() + 5400000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const { win, react, probe, render } = await mountEnv({
    withHostModal: true,
    events: [{ uid: 'evt-1', summary: 'V3 Design Review', start, end, allDay: false, location: 'Studio' }],
  });
  const { container, unmount } = await render(react.createElement(probe.CalendarPanel, { workbench: true }));
  try {
    for (const token of ['dsh-header', 'dsh-tab-indicator', 'dsh-split-resizer', 'dsh-skeleton', 'dsh-row-actions', 'dsh-pixel-cursor']) {
      assert.ok(probe.CSS.includes(token), `missing v3 CSS token ${token}`);
    }

    const header = container.querySelector('[data-dsh-header]');
    assert.ok(header, 'unified topbar exposes [data-dsh-header]');
    const layoutPills = [...header.querySelectorAll('[aria-label="布局"] button')].map(b => b.textContent);
    assert.deepEqual(layoutPills, ['原生', '浮岛', '聚光', 'Bento']);
    assert.match(probe.CSS, /#ececec[\s\S]*#1b4f9c/i, 'win98 platinum toolbar contrast rule present');

    const tablist = container.querySelector('[data-dsh-tablist]');
    assert.ok(tablist, 'workspace tabs expose [data-dsh-tablist]');
    assert.ok(tablist.querySelector('.dsh-tab-indicator'), 'sliding tab indicator renders in tablist');

    const resizer = container.querySelector('[data-dsh-resizer]');
    assert.ok(resizer, 'ScheduleLayout renders DshSplitResizer');
    assert.equal(resizer.getAttribute('role'), 'separator');
    assert.equal(resizer.getAttribute('aria-valuenow'), '236');
    await react.act(async () => {
      resizer.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });
    assert.equal(resizer.getAttribute('aria-valuenow'), '252');
    assert.equal(win.localStorage.getItem('dsh-calendar:rail-width'), '252');
    await react.act(async () => {
      resizer.dispatchEvent(new win.MouseEvent('dblclick', { bubbles: true }));
    });
    assert.equal(resizer.getAttribute('aria-valuenow'), '236');

    // Switch to Agenda view to verify [data-dsh-row] + .dsh-row-actions + .dsh-pixel-cursor
    const agendaTab = [...container.querySelectorAll('[role="tab"]')].find(t => t.textContent.includes('议程'));
    assert.ok(agendaTab, 'Agenda view tab exists');
    await react.act(async () => { agendaTab.click(); });
    const row = container.querySelector('[data-dsh-row]');
    assert.ok(row, 'Agenda view renders [data-dsh-row]');
    assert.ok(row.querySelector('.dsh-pixel-cursor'), 'Agenda row includes pixel8bit cursor');
    assert.ok(row.querySelector('.dsh-row-actions'), 'Agenda row includes .dsh-row-actions');
  } finally {
    await unmount();
  }
});
