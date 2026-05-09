import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const academicDir = path.join(root, 'src/data/academic')
const oralDir = path.join(root, 'src/data/oral')

const expectedAcademic = {
  causality: [
    'influence-verb',
    'influence-noun',
    'cause-direct',
    'mechanism',
    'moderate',
    'consequence',
    'amplify',
    'attenuate',
  ],
  contradiction: [
    'inconsistent',
    'challenge',
    'concession',
    'contrary-expectation',
    'tension',
    'complicate',
    'nuance',
    'paradox',
  ],
  gaps: [
    'under-explored',
    'open-question',
    'limitation-prior',
    'aim',
    'specific-questions',
    'address-gap',
    'extend',
    'puzzle',
  ],
  'prior-literature': [
    'established',
    'growing-evidence',
    'scholars-argue',
    'focused-on',
    'mixed-findings',
    'dominant-view',
    'theoretical-framework',
    'distinction',
  ],
  statistics: [
    'significant-positive',
    'significant-negative',
    'not-significant',
    'coefficient-size',
    'after-controlling',
    'interaction',
    'model-fit',
    'robustness',
    'magnitude',
    'attenuation',
    'pattern',
    'subgroup',
  ],
  methods: [
    'data-source',
    'sample-restriction',
    'method-choice',
    'endogeneity',
    'operationalize',
    'measure',
    'coding',
    'analytic-strategy',
  ],
  contributions: [
    'contribute-literature',
    'methodological',
    'empirical',
    'policy-implication',
    'broaden',
    'first-to',
    'bridge',
  ],
  'degree-comparison': [
    'substantially',
    'marginally',
    'in-comparison',
    'more-than',
    'to-some-extent',
    'disproportionately',
    'uniformly-vs-varied',
    'over-time',
  ],
}

const expectedOral = [
  'handling-qa',
  'giving-talks',
  'asking-questions',
  'coffee-lunch',
  'conference-networking',
]

const registerValues = new Set(['formal', 'neutral', 'literary', 'colloquial', 'casual'])
const expressionIds = new Map()
const failures = []

function fail(location, message) {
  failures.push(`${location}: ${message}`)
}

function hasChinese(value) {
  return /[\u3400-\u9fff]/.test(value)
}

function assertString(location, value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(location, `missing non-empty ${field}`)
    return false
  }
  return true
}

function validateExpression(expression, location, { requireExample }) {
  assertString(location, expression.id, 'id')
  assertString(location, expression.en, 'en')
  assertString(location, expression.note, 'note')

  if (expression.id) {
    const firstLocation = expressionIds.get(expression.id)
    if (firstLocation) {
      fail(location, `duplicate expression id already used at ${firstLocation}`)
    } else {
      expressionIds.set(expression.id, location)
    }
  }

  if (expression.note && (!hasChinese(expression.note) || expression.note.length < 8)) {
    fail(location, 'note must be a Chinese usage-difference explanation')
  }

  if (expression.note && /(翻译|意思是|means|meaning)/i.test(expression.note)) {
    fail(location, 'note appears to be a translation/definition rather than a difference note')
  }

  if (requireExample) {
    assertString(location, expression.example, 'example')
  }

  if (expression.register && !registerValues.has(expression.register)) {
    fail(location, `invalid register "${expression.register}"`)
  }
}

function validateClusters(clusters, location, { requireExample, minExpressions, maxExpressions }) {
  if (!Array.isArray(clusters) || clusters.length === 0) {
    fail(location, 'clusters must be a non-empty array')
    return
  }

  for (const cluster of clusters) {
    const clusterLocation = `${location}/${cluster.id ?? 'unknown-cluster'}`
    assertString(clusterLocation, cluster.id, 'id')
    assertString(clusterLocation, cluster.meaning, 'meaning')

    if (!Array.isArray(cluster.expressions)) {
      fail(clusterLocation, 'expressions must be an array')
      continue
    }

    if (
      cluster.expressions.length < minExpressions ||
      cluster.expressions.length > maxExpressions
    ) {
      fail(
        clusterLocation,
        `expected ${minExpressions}-${maxExpressions} expressions, got ${cluster.expressions.length}`,
      )
    }

    cluster.expressions.forEach((expression, index) => {
      validateExpression(expression, `${clusterLocation}/expressions[${index}]`, {
        requireExample,
      })
    })
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

async function validateAcademic() {
  const files = await readdir(academicDir)
  const jsonFiles = files.filter((file) => file.endsWith('.json'))
  const expectedFiles = Object.keys(expectedAcademic).map((id) => `${id}.json`)

  for (const file of expectedFiles) {
    if (!jsonFiles.includes(file)) {
      fail('src/data/academic', `missing ${file}`)
    }
  }

  let statisticsCount = 0
  let maxNonStatisticsCount = 0

  for (const [categoryId, expectedClusterIds] of Object.entries(expectedAcademic)) {
    const filePath = path.join(academicDir, `${categoryId}.json`)
    const category = await readJson(filePath)
    const location = `academic/${categoryId}`

    if (category.id !== categoryId) {
      fail(location, `id should be "${categoryId}"`)
    }

    assertString(location, category.name, 'name')
    assertString(location, category.nameEn, 'nameEn')
    assertString(location, category.description, 'description')

    const actualClusterIds = category.clusters?.map((cluster) => cluster.id) ?? []
    for (const clusterId of expectedClusterIds) {
      if (!actualClusterIds.includes(clusterId)) {
        fail(location, `missing cluster ${clusterId}`)
      }
    }

    validateClusters(category.clusters, location, {
      requireExample: true,
      minExpressions: 4,
      maxExpressions: 6,
    })

    const expressionCount = category.clusters.reduce(
      (sum, cluster) => sum + cluster.expressions.length,
      0,
    )
    if (categoryId === 'statistics') {
      statisticsCount = expressionCount
    } else {
      maxNonStatisticsCount = Math.max(maxNonStatisticsCount, expressionCount)
    }
  }

  if (statisticsCount <= maxNonStatisticsCount) {
    fail(
      'academic/statistics',
      `statistics should be the richest category, got ${statisticsCount} vs max ${maxNonStatisticsCount}`,
    )
  }
}

function validateDialogueLine(line, location) {
  assertString(location, line.speaker, 'speaker')
  assertString(location, line.en, 'en')

  if (line.speaker === 'you') {
    if (!assertString(location, line.zh, 'zh')) {
      return
    }
    if (!hasChinese(line.zh)) {
      fail(location, 'speaker "you" must include Chinese zh translation')
    }
  }

  if (line.highlights) {
    if (!Array.isArray(line.highlights)) {
      fail(location, 'highlights must be an array when present')
      return
    }

    for (const highlight of line.highlights) {
      if (typeof highlight !== 'string' || !line.en.includes(highlight)) {
        fail(location, `highlight "${highlight}" is not present in en`)
      }
    }
  }
}

async function validateOral() {
  const files = await readdir(oralDir)
  const jsonFiles = files.filter((file) => file.endsWith('.json'))

  for (const sceneId of expectedOral) {
    const file = `${sceneId}.json`
    if (!jsonFiles.includes(file)) {
      fail('src/data/oral', `missing ${file}`)
      continue
    }

    const scene = await readJson(path.join(oralDir, file))
    const location = `oral/${sceneId}`

    if (scene.id !== sceneId) {
      fail(location, `id should be "${sceneId}"`)
    }

    assertString(location, scene.scene, 'scene')
    assertString(location, scene.name, 'name')
    assertString(location, scene.nameEn, 'nameEn')
    assertString(location, scene.description, 'description')

    if (!Array.isArray(scene.dialogues) || scene.dialogues.length < 2 || scene.dialogues.length > 3) {
      fail(location, `expected 2-3 dialogues, got ${scene.dialogues?.length ?? 0}`)
    } else {
      scene.dialogues.forEach((dialogue, dialogueIndex) => {
        const dialogueLocation = `${location}/dialogues[${dialogueIndex}]`
        assertString(dialogueLocation, dialogue.id, 'id')
        assertString(dialogueLocation, dialogue.title, 'title')
        assertString(dialogueLocation, dialogue.context, 'context')

        if (!Array.isArray(dialogue.lines) || dialogue.lines.length < 4) {
          fail(dialogueLocation, 'dialogue needs at least 4 lines')
        } else {
          dialogue.lines.forEach((line, lineIndex) => {
            validateDialogueLine(line, `${dialogueLocation}/lines[${lineIndex}]`)
          })
        }
      })
    }

    validateClusters(scene.universalExpressions, `${location}/universalExpressions`, {
      requireExample: false,
      minExpressions: 3,
      maxExpressions: 6,
    })
  }
}

try {
  await validateAcademic()
  await validateOral()
} catch (error) {
  failures.push(error.message)
}

if (failures.length > 0) {
  console.error(`Data validation failed with ${failures.length} issue(s):`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(
  `Data validation passed: ${Object.keys(expectedAcademic).length} academic categories, ${expectedOral.length} oral scenes, ${expressionIds.size} unique expressions.`,
)
