import causality from './causality.json'
import contradiction from './contradiction.json'
import gaps from './gaps.json'
import priorLiterature from './prior-literature.json'
import statistics from './statistics.json'
import methods from './methods.json'
import contributions from './contributions.json'
import degreeComparison from './degree-comparison.json'
import relationalDyadicFraming from './relational-dyadic-framing.json'
import policyContextAndScenarios from './policy-context-and-scenarios.json'
import heterogeneityAndBoundaryConditions from './heterogeneity-and-boundary-conditions.json'
import mechanismPathways from './mechanism-pathways.json'
import workFamilyBoundaries from './work-family-boundaries.json'
import socialNormsAndIdeology from './social-norms-and-ideology.json'
import theoreticalConceptualFraming from './theoretical-conceptual-framing.json'
import limitationsAndCautiousClaims from './limitations-and-cautious-claims.json'

export const academicCategories = [
  statistics,
  causality,
  contradiction,
  gaps,
  priorLiterature,
  methods,
  contributions,
  degreeComparison,
  relationalDyadicFraming,
  policyContextAndScenarios,
  heterogeneityAndBoundaryConditions,
  mechanismPathways,
  workFamilyBoundaries,
  socialNormsAndIdeology,
  theoreticalConceptualFraming,
  limitationsAndCautiousClaims,
]

export const academicCategoryMap = Object.fromEntries(
  academicCategories.map((category) => [category.id, category]),
)
