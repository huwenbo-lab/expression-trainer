import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const files = {
  oralModule: 'src/components/OralModule.jsx',
  sceneSidebar: 'src/components/SceneSidebar.jsx',
  dialogueCard: 'src/components/DialogueCard.jsx',
  chatBubble: 'src/components/ChatBubble.jsx',
  universalExpressions: 'src/components/UniversalExpressions.jsx',
}

async function source(file) {
  return readFile(file, 'utf8')
}

function test(name, fn) {
  tests.push({ name, fn })
}

const tests = []

test('OralModule connects oral scenes, progress, filter, scene sidebar, dialogues, and universal expressions', async () => {
  const oralModule = await source(files.oralModule)

  assert.match(oralModule, /oralSceneGroups/)
  assert.match(oralModule, /oralScenes/)
  assert.match(oralModule, /useProgress\(/)
  assert.match(oralModule, /useFilter\(/)
  assert.match(oralModule, /<SceneSidebar/)
  assert.match(oralModule, /<DialogueCard/)
  assert.match(oralModule, /<UniversalExpressions/)
  assert.match(oralModule, /filterClusters/)
})

test('SceneSidebar renders grouped scene navigation with progress callbacks', async () => {
  const sceneSidebar = await source(files.sceneSidebar)

  assert.match(sceneSidebar, /sceneGroups/)
  assert.match(sceneSidebar, /group\.scenes\.map/)
  assert.match(sceneSidebar, /selectedSceneId/)
  assert.match(sceneSidebar, /onSelectScene/)
  assert.match(sceneSidebar, /getMasteredCount/)
  assert.match(sceneSidebar, /getTotalCount/)
})

test('DialogueCard is collapsible and renders ChatBubble lines', async () => {
  const dialogueCard = await source(files.dialogueCard)

  assert.match(dialogueCard, /useState/)
  assert.match(dialogueCard, /defaultOpen/)
  assert.match(dialogueCard, /aria-expanded/)
  assert.match(dialogueCard, /ChatBubble/)
  assert.match(dialogueCard, /dialogue\.lines\.map/)
})

test('ChatBubble lays out you on the right, shows zh, and highlights phrases', async () => {
  const chatBubble = await source(files.chatBubble)

  assert.match(chatBubble, /line\.speaker === 'you'/)
  assert.match(chatBubble, /line\.zh/)
  assert.match(chatBubble, /highlights/)
  assert.match(chatBubble, /<strong/)
  assert.match(chatBubble, /ml-auto/)
  assert.match(chatBubble, /mr-auto/)
})

test('UniversalExpressions reuses ClusterList rather than duplicating expression rows', async () => {
  const universalExpressions = await source(files.universalExpressions)

  assert.match(universalExpressions, /ClusterList/)
  assert.match(universalExpressions, /万能表达/)
  assert.match(universalExpressions, /toggleMastered/)
  assert.match(universalExpressions, /toggleStarred/)
})

for (const { name, fn } of tests) {
  await fn()
  console.log(`ok - ${name}`)
}
