import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const ROOT_URL = new URL('../', import.meta.url);
const PKG = JSON.parse(readFileSync(new URL('package.json', ROOT_URL), 'utf8'));
const SOURCE = readFileSync(new URL('lib/client.js', ROOT_URL), 'utf8').replace(/\r\n/g, '\n');
const EXPOSE = 'module.exports.__themeProbe = { CalendarPanel, Launcher, ConnectionForm, DSH_STYLES, writeDshStyle, readDshStyle, calendarAppearance, CSS };';
if (!SOURCE.includes('return module.exports;')) {
  throw new Error('client.js export contract changed');
}
const PATCHED = SOURCE.replace('return module.exports;', EXPOSE + '\nreturn module.exports;');

async function mountEnv({ withHostModal = false, darkHost = false } = {}) {
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
    return { ok: true, status: 200, json: async () => ({ ok: true, value: { count: 0, start: '', end: '', events: [] } }) };
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

test('5-style theme switcher syncs workbench, harmonizes layout/palette, and updates portaled Modal dialogs', async () => {
  const { win, react, probe, render } = await mountEnv({ withHostModal: true });
  const { container, unmount } = await render(react.createElement(probe.CalendarPanel, { workbench: true }));
  try {
    assert.deepEqual(
      Array.from(probe.DSH_STYLES, item => item.id),
      ['harness', 'cream', 'claude', 'pixel8bit', 'mint'],
    );
    const rootSection = container.querySelector('.dshc-root');
    assert.equal(rootSection.getAttribute('data-dsh-style'), 'harness');

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
    assert.equal(portalDialog.hasAttribute('data-window-drag-exclude'), true);

    // Cross-plugin broadcast via writeDshStyle updates both workbench root and open portaled dialog live
    await react.act(async () => {
      probe.writeDshStyle('claude', win);
    });
    assert.equal(rootSection.getAttribute('data-dsh-style'), 'claude');
    assert.equal(portalDialog.getAttribute('data-dsh-style'), 'claude');
  } finally {
    await unmount();
  }
});

test('floating Launcher and SVG micro-animation icons expose data-window-drag-exclude, data-dsh-icon, and reduced-motion rules', async () => {
  const { win, react, probe, render } = await mountEnv();
  await react.act(async () => {
    probe.writeDshStyle('mint', win);
  });
  const { container, unmount } = await render(react.createElement(probe.Launcher, {}));
  try {
    const fab = container.querySelector('.dshc-fab');
    assert.ok(fab);
    assert.equal(fab.getAttribute('data-dsh-style'), 'mint');
    assert.equal(fab.hasAttribute('data-window-drag-exclude'), true);

    await react.act(async () => {
      fab.click();
    });
    const floatPanel = container.querySelector('.dshc-float');
    assert.ok(floatPanel);
    assert.equal(floatPanel.getAttribute('data-dsh-style'), 'mint');
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

test('collapsible workflow guide, 1-click chat prompt chips, marker CSS rules, and >=0.2.2-rc.3 docs stay compliant', async () => {
  const refZh = readFileSync(new URL('docs/REFERENCE.zh.md', ROOT_URL), 'utf8');
  const refEn = readFileSync(new URL('docs/REFERENCE.en.md', ROOT_URL), 'utf8');
  const workbenchDoc = readFileSync(new URL('docs/WORKBENCH.md', ROOT_URL), 'utf8');
  assert.doesNotMatch(refZh + '\n' + refEn + '\n' + workbenchDoc, /0\.2\.1-rc\.3/);
  assert.match(refZh, />=0\.2\.2-rc\.3/);
  assert.match(refEn, />=0\.2\.2-rc\.3/);

  const { win, react, probe, render } = await mountEnv();
  let copiedPrompt = '';
  Object.defineProperty(win.navigator, 'clipboard', {
    value: { async writeText(val) { copiedPrompt = String(val); } },
    configurable: true,
  });
  try { Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true }); } catch {}

  const { container, unmount } = await render(react.createElement(probe.CalendarPanel, { workbench: true }));
  try {
    assert.match(probe.CSS, /content:"▸";content:"▸"\s*\/\s*""/);
    assert.match(probe.CSS, /@media\s*\(prefers-reduced-motion:\s*no-preference\)\{[^}]*transition:rotate/);

    const guide = container.querySelector('details');
    assert.ok(guide, 'collapsible <details> workflow guide must render');
    const summary = guide.querySelector('summary');
    assert.ok(summary);
    assert.match(summary.textContent, /三步用起来/);
    assert.equal(summary.querySelectorAll('h1, h2, h3, h4, h5, h6').length, 0, 'never place headings inside <summary>');

    const chip45 = [...guide.querySelectorAll('button')].find(b => b.textContent.includes('帮我找本周下午两个 45 分钟空闲时段'));
    const chipToday = [...guide.querySelectorAll('button')].find(b => b.textContent.includes('汇总今天的会议议程并提醒冲突'));
    assert.ok(chip45, '45-min free slot prompt chip must render');
    assert.ok(chipToday, 'today agenda prompt chip must render');

    await react.act(async () => { chip45.click(); });
    assert.equal(chip45.getAttribute('data-copied'), 'true');
    assert.match(copiedPrompt, /45 分钟空闲时段/);
    assert.match(guide.querySelector('[role="status"]').textContent, /已复制对话指令/);

    await react.act(async () => { chipToday.click(); });
    assert.equal(chipToday.getAttribute('data-copied'), 'true');
    assert.match(copiedPrompt, /汇总今天的会议议程并提醒冲突/);
  } finally {
    await unmount();
  }
});
