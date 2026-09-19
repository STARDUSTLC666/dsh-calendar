/**
 * 把 lib/client.js 的内部纯函数取出来给测试用。
 *
 * client.js 是浏览器端的自注册包（window.__ModuleLoader__.load），加载时只做两件事：
 * 装 React 组件、（在真实宿主里）注册设置页与悬浮面板。这里给它一个假装载器与假 react，
 * 再把 return module.exports 之前注入一行内部导出 —— 于是测试测的是**发布文件里那份实现**，
 * 不是另抄一份算法（抄一份迟早漂移）。
 */
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../lib/client.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const EXPOSE = 'module.exports.__internals = { snapMinutes, slotFromEvent, moveSlot, slotFromDrag, resizeSlot, rangeOfSlot, conflictsForSlot, isRecurring, columnIndexFromRects };';
if (!SOURCE.includes('return module.exports;')) throw new Error('client.js 的装载契约变了，本助手要跟着改');
const patched = SOURCE.replace('return module.exports;', EXPOSE + '\nreturn module.exports;');

function fakeReact() {
  const noop = () => undefined;
  return {
    createElement: () => ({}),
    useState: (init) => [typeof init === 'function' ? init() : init, noop],
    useEffect: noop,
    useMemo: (fn) => fn(),
    useRef: (init) => ({ current: init }),
    useCallback: (fn) => fn,
  };
}

let internals = null;
const windowStub = {
  __ModuleLoader__: {
    load: (registration) => {
      const require = (name) => {
        if (name === 'react') return fakeReact();
        if (name === 'react-dom/client') return { createRoot: () => ({ render: () => {}, unmount: () => {} }) };
        if (name === 'react/jsx-runtime') return {};
        throw new Error('unexpected require: ' + name);
      };
      internals = registration.factory(require).__internals;
    },
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  localStorage: { getItem: () => null, setItem: () => {} },
};
const documentStub = {
  querySelector: () => null,
  createElement: () => ({ dataset: {}, appendChild: () => {} }),
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
};
new Function('window', 'document', patched)(windowStub, documentStub);
if (internals === null) throw new Error('没能从 client.js 取到内部函数');

export const source = SOURCE;
export const api = internals;
