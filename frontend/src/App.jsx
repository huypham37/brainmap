import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import MindMapCanvas from './components/MindMapCanvas'

function App() {
  return (
    <div className="app">
      <ReactFlowProvider>
        <MindMapCanvas />
      </ReactFlowProvider>
    </div>
  )
}

export default App
