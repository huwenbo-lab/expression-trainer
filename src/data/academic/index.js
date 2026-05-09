import causality from './causality.json'
import contradiction from './contradiction.json'
import gaps from './gaps.json'
import priorLiterature from './prior-literature.json'
import statistics from './statistics.json'
import methods from './methods.json'
import contributions from './contributions.json'
import degreeComparison from './degree-comparison.json'

export const academicCategories = [
  statistics,
  causality,
  contradiction,
  gaps,
  priorLiterature,
  methods,
  contributions,
  degreeComparison,
]

export const academicCategoryMap = Object.fromEntries(
  academicCategories.map((category) => [category.id, category]),
)
