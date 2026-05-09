import handlingQa from './handling-qa.json'
import givingTalks from './giving-talks.json'
import askingQuestions from './asking-questions.json'
import coffeeLunch from './coffee-lunch.json'
import conferenceNetworking from './conference-networking.json'

export const oralScenes = [
  handlingQa,
  givingTalks,
  askingQuestions,
  coffeeLunch,
  conferenceNetworking,
]

export const oralSceneGroups = [
  {
    id: 'conference',
    name: '会议与学术报告',
    nameEn: 'Conference & Presentations',
    scenes: [givingTalks, handlingQa, askingQuestions, conferenceNetworking],
  },
  {
    id: 'department',
    name: '系里日常',
    nameEn: 'Department Daily Life',
    scenes: [coffeeLunch],
  },
]

export const oralSceneMap = Object.fromEntries(oralScenes.map((scene) => [scene.id, scene]))
