import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const files = {
  app: 'src/App.jsx',
  academic: 'src/components/AcademicModule.jsx',
  sidebar: 'src/components/Sidebar.jsx',
  categoryItem: 'src/components/CategoryItem.jsx',
  filterBar: 'src/components/FilterBar.jsx',
  clusterList: 'src/components/ClusterList.jsx',
  clusterItem: 'src/components/ClusterItem.jsx',
  expressionRow: 'src/components/ExpressionRow.jsx',
  emptyState: 'src/components/EmptyState.jsx',
}

async function source(file) {
  return readFile(file, 'utf8')
}

function test(name, fn) {
  awaitableTests.push({ name, fn })
}

const awaitableTests = []

test('App renders the academic writing module', async () => {
  const app = await source(files.app)

  assert.match(app, /import\s+AcademicModule\s+from\s+['"]\.\/components\/AcademicModule/)
  assert.match(app, /academic:\s*AcademicModule/)
  assert.match(app, /const\s+ActiveModule\s*=\s*modules\[activeModule\]/)
  assert.match(app, /<ActiveModule\s*\/>/)
})

test('AcademicModule connects data, progress, filtering, sidebar, filter bar, and cluster list', async () => {
  const academic = await source(files.academic)

  assert.match(academic, /academicCategories/)
  assert.match(academic, /useProgress\(/)
  assert.match(academic, /useFilter\(/)
  assert.match(academic, /<Sidebar/)
  assert.match(academic, /<FilterBar/)
  assert.match(academic, /<ClusterList/)
  assert.match(academic, /getMasteredCount/)
  assert.match(academic, /filterClusters/)
})

test('Sidebar renders CategoryItem with category progress callbacks', async () => {
  const sidebar = await source(files.sidebar)

  assert.match(sidebar, /CategoryItem/)
  assert.match(sidebar, /getMasteredCount/)
  assert.match(sidebar, /getTotalCount/)
  assert.match(sidebar, /onSelectCategory/)
})

test('FilterBar exposes all, unmastered, and starred filter labels with progress summary', async () => {
  const filterBar = await source(files.filterBar)

  assert.match(filterBar, /全部/)
  assert.match(filterBar, /未掌握/)
  assert.match(filterBar, /已收藏/)
  assert.match(filterBar, /进度/)
})

test('ClusterList renders EmptyState when filtering removes all clusters', async () => {
  const clusterList = await source(files.clusterList)

  assert.match(clusterList, /EmptyState/)
  assert.match(clusterList, /clusters\.length/)
  assert.match(clusterList, /ClusterItem/)
})

test('ClusterItem and ExpressionRow are reusable shared expression components', async () => {
  const clusterItem = await source(files.clusterItem)
  const expressionRow = await source(files.expressionRow)

  assert.match(clusterItem, /ExpressionRow/)
  assert.match(clusterItem, /toggleMastered/)
  assert.match(clusterItem, /toggleStarred/)
  assert.match(expressionRow, /mastered\.has\(expression\.id\)/)
  assert.match(expressionRow, /starred\.has\(expression\.id\)/)
  assert.match(expressionRow, /aria-pressed/)
  assert.match(expressionRow, /opacity-40/)
  assert.match(expressionRow, /★/)
  assert.match(expressionRow, /✓/)
})

for (const { name, fn } of awaitableTests) {
  await fn()
  console.log(`ok - ${name}`)
}
