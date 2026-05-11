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
import lifeCourseAndTrajectories from './life-course-and-trajectories.json'
import dyadicAndWithinFamilyComplexity from './dyadic-and-within-family-complexity.json'
import stratificationAndSocialContext from './stratification-and-social-context.json'
import adaptiveResponseAndResilience from './adaptive-response-and-resilience.json'

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
  lifeCourseAndTrajectories,
  dyadicAndWithinFamilyComplexity,
  stratificationAndSocialContext,
  adaptiveResponseAndResilience,
]

export const academicCategoryMap = Object.fromEntries(
  academicCategories.map((category) => [category.id, category]),
)
