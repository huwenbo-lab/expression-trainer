import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function source(file) {
  return readFile(file, 'utf8')
}

function test(name, fn) {
  tests.push({ name, fn })
}

const tests = []

test('App renders TopNav and switches between academic and oral modules', async () => {
  const app = await source('src/App.jsx')

  assert.match(app, /useState/)
  assert.match(app, /TopNav/)
  assert.match(app, /activeModule/)
  assert.match(app, /setActiveModule/)
  assert.match(app, /academic:\s*AcademicModule/)
  assert.match(app, /oral:\s*OralModule/)
})

test('TopNav exposes the two required module tabs', async () => {
  const topNav = await source('src/components/TopNav.jsx')

  assert.match(topNav, /学术写作/)
  assert.match(topNav, /口语交流/)
  assert.match(topNav, /aria-pressed/)
  assert.match(topNav, /onChangeModule/)
})

test('Modules no longer duplicate the global application header', async () => {
  const academic = await source('src/components/AcademicModule.jsx')
  const oral = await source('src/components/OralModule.jsx')

  assert.doesNotMatch(academic, /<header/)
  assert.doesNotMatch(oral, /<header/)
  assert.match(academic, /学术写作表达训练/)
  assert.match(oral, /口语交流场景训练/)
})

test('Global CSS uses requested editorial fonts and avoids generic AI styling', async () => {
  const css = await source('src/index.css')

  assert.match(css, /Source\+Serif\+4/)
  assert.match(css, /--font-serif/)
  assert.match(css, /#f6efe3/)
  assert.doesNotMatch(css, /Inter/i)
  assert.doesNotMatch(css, /purple/i)
  assert.doesNotMatch(css, /#[0-9a-fA-F]{0,2}8b5cf6/)
})

for (const { name, fn } of tests) {
  await fn()
  console.log(`ok - ${name}`)
}
