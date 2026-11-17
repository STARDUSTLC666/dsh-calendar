import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import modules from 'postcss-modules'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
const require = createRequire(import.meta.url)

function compactPostcssRoot(astRoot) {
  astRoot.walkComments(comment => comment.remove())
  astRoot.walk(node => {
    node.raws.before = node.parent.type === 'root' ? '\n' : ''
    if (node.type === 'decl') node.raws.between = ':'
    if (node.nodes) {
      node.raws.between = ''
      node.raws.after = ''
      node.raws.semicolon = false
    }
  })
  return astRoot.toString().trim()
}

const themeStylesheet = join(root, 'templates/themes-and-motion.css')
const compiledThemes = await postcss().process(read(themeStylesheet), { from: themeStylesheet })
const themeCss = compactPostcssRoot(compiledThemes.root)

const stylesheet = join(root, 'templates/calendar.module.css')
let classNames
const compiled = await postcss([
  modules({
    // The original calendar classes are already plugin-scoped. Keep those DOM
    // hooks stable for the compatibility panel and integration tests.
    generateScopedName: name => /^(dshc-|w-empty$)/.test(name) ? name : 'dsh-calendar_' + name,
    getJSON: (_path, result) => { classNames = result },
  }),
]).process(read(stylesheet), { from: stylesheet })

// Keep the stylesheet in the Loader script, so the plugin works under a mounted
// DSH URL without a second asset route. Keep one line per top-level CSS rule.
const css = (themeCss + '\n' + compactPostcssRoot(compiled.root)).replace(/[`$\\]/g, '\\$&')
const styleKit = read(join(root, 'templates/style-switcher.js'))
  .replace(/^export\s+(?=(?:const|function)\s)/gm, '')
const kit = read(join(root, 'templates/workbench-ui.js'))
const directory = join(root, 'templates/panels')
const panels = readdirSync(directory).filter(name => name.endsWith('.js')).sort()
  .map(name => read(join(directory, name))).join('\n')
const marker = '// @calendar-ui'
const client = read(join(root, 'templates/client.js'))
if (!client.includes(marker)) throw new Error('Calendar UI source marker missing')

// Bundle the real clsx implementation. React and UI primitives resolve through
// the host Loader and continue to share the host's single React instance.
const clsxEntry = require.resolve('clsx')
const clsx = read(clsxEntry).trim()
const clsxLicense = read(join(dirname(clsxEntry), '..', 'license')).trim()
const header = `// Generated from templates/ by scripts/build-client.mjs. Edit the sources.
(function () {
/* clsx
${clsxLicense}
*/
const clsx = (() => {
  const module = { exports: {} };
  ${clsx}
  return module.exports.clsx;
})();
const styles = Object.freeze(${JSON.stringify(classNames)});
const CSS = \`${css}\`;
`

mkdirSync(join(root, 'lib'), { recursive: true })
writeFileSync(join(root, 'lib/client.js'), header + client.replace(marker, () => styleKit + '\n' + kit + '\n' + panels) + '\n})();\n')
