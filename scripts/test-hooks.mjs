import assert from 'node:assert/strict'

import {
  FILTERS,
  filterClusters,
  isSupportedFilter,
} from '../src/hooks/useFilter.js'
import {
  PROGRESS_STORAGE_KEY,
  countMasteredExpressions,
  countTotalExpressions,
  createEmptyProgress,
  readStoredProgress,
  toggleIdInSet,
  writeStoredProgress,
} from '../src/hooks/useProgress.js'

const clusters = [
  {
    id: 'cluster-a',
    meaning: 'A',
    expressions: [
      { id: 'a-1', en: 'one' },
      { id: 'a-2', en: 'two' },
    ],
  },
  {
    id: 'cluster-b',
    meaning: 'B',
    expressions: [
      { id: 'b-1', en: 'three' },
      { id: 'b-2', en: 'four' },
    ],
  },
]

function createStorage(initial = {}) {
  const store = new Map(Object.entries(initial))

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }
}

function test(name, fn) {
  fn()
  console.log(`ok - ${name}`)
}

test('filterClusters returns every cluster and expression for all mode', () => {
  const filtered = filterClusters(clusters, new Set(['a-1']), new Set(['b-2']), FILTERS.all)

  assert.equal(filtered.length, 2)
  assert.deepEqual(filtered[0].expressions.map((expression) => expression.id), ['a-1', 'a-2'])
  assert.notEqual(filtered[0], clusters[0])
  assert.notEqual(filtered[0].expressions, clusters[0].expressions)
})

test('filterClusters keeps only unmastered expressions and hides empty clusters', () => {
  const filtered = filterClusters(
    clusters,
    new Set(['a-1', 'b-1', 'b-2']),
    new Set(),
    FILTERS.unmastered,
  )

  assert.deepEqual(filtered.map((cluster) => cluster.id), ['cluster-a'])
  assert.deepEqual(filtered[0].expressions.map((expression) => expression.id), ['a-2'])
})

test('filterClusters keeps only starred expressions and hides empty clusters', () => {
  const filtered = filterClusters(clusters, new Set(), new Set(['a-2', 'b-1']), FILTERS.starred)

  assert.deepEqual(filtered.map((cluster) => cluster.id), ['cluster-a', 'cluster-b'])
  assert.deepEqual(filtered[0].expressions.map((expression) => expression.id), ['a-2'])
  assert.deepEqual(filtered[1].expressions.map((expression) => expression.id), ['b-1'])
})

test('isSupportedFilter accepts only the three documented filters', () => {
  assert.equal(isSupportedFilter(FILTERS.all), true)
  assert.equal(isSupportedFilter(FILTERS.unmastered), true)
  assert.equal(isSupportedFilter(FILTERS.starred), true)
  assert.equal(isSupportedFilter('archived'), false)
})

test('readStoredProgress returns empty sets when localStorage is empty or malformed', () => {
  assert.equal(PROGRESS_STORAGE_KEY, 'expression-trainer-progress')

  const empty = readStoredProgress(createStorage())
  assert.deepEqual([...empty.mastered], [])
  assert.deepEqual([...empty.starred], [])

  const malformed = readStoredProgress(createStorage({ [PROGRESS_STORAGE_KEY]: '{bad json' }))
  assert.deepEqual([...malformed.mastered], [])
  assert.deepEqual([...malformed.starred], [])
})

test('readStoredProgress can run without a browser localStorage object', () => {
  const progress = readStoredProgress(undefined)

  assert.deepEqual([...progress.mastered], [])
  assert.deepEqual([...progress.starred], [])
})

test('writeStoredProgress persists mastered and starred arrays to the shared key', () => {
  const storage = createStorage()
  writeStoredProgress(storage, {
    mastered: new Set(['a-1', 'b-2']),
    starred: new Set(['a-2']),
  })

  assert.deepEqual(JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY)), {
    mastered: ['a-1', 'b-2'],
    starred: ['a-2'],
  })
})

test('toggleIdInSet returns a new set with membership toggled', () => {
  const original = new Set(['a-1'])
  const removed = toggleIdInSet(original, 'a-1')
  const added = toggleIdInSet(original, 'a-2')

  assert.deepEqual([...original], ['a-1'])
  assert.deepEqual([...removed], [])
  assert.deepEqual([...added].sort(), ['a-1', 'a-2'])
})

test('count helpers count total and mastered expressions in a category', () => {
  assert.equal(countTotalExpressions({ clusters }), 4)
  assert.equal(countMasteredExpressions({ clusters }, new Set(['a-1', 'b-2', 'missing'])), 2)
})

test('count helpers also count oral universalExpressions in a scene', () => {
  const oralScene = {
    universalExpressions: [
      {
        id: 'oral-a',
        expressions: [
          { id: 'oral-a-1' },
          { id: 'oral-a-2' },
        ],
      },
      {
        id: 'oral-b',
        expressions: [{ id: 'oral-b-1' }],
      },
    ],
  }

  assert.equal(countTotalExpressions(oralScene), 3)
  assert.equal(countMasteredExpressions(oralScene, new Set(['oral-a-2'])), 1)
})

test('createEmptyProgress creates independent empty sets', () => {
  const first = createEmptyProgress()
  const second = createEmptyProgress()

  first.mastered.add('a-1')
  assert.equal(second.mastered.has('a-1'), false)
  assert.equal(first.starred instanceof Set, true)
})
