import { useState } from 'react'

import AcademicModule from './components/AcademicModule.jsx'
import OralModule from './components/OralModule.jsx'
import TopNav from './components/TopNav.jsx'

const modules = {
  academic: AcademicModule,
  oral: OralModule,
}

function App() {
  const [activeModule, setActiveModule] = useState('academic')
  const ActiveModule = modules[activeModule]

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-ink)]">
      <TopNav activeModule={activeModule} onChangeModule={setActiveModule} />
      <ActiveModule />
    </div>
  )
}

export default App
