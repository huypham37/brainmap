import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds
} from 'reactflow'
import { toJpeg } from 'html-to-image'
import 'reactflow/dist/style.css'
import CustomNode from './CustomNode'
import ProjectSwitcher from './ProjectSwitcher'
import { getColorForLevel } from '../utils/colors'
import { mindmapsAPI, projectsAPI } from '../services/api'

const nodeTypes = {
  custom: CustomNode
}

const MindMapCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [currentMindmapId, setCurrentMindmapId] = useState(null)
  const [currentProjectId, setCurrentProjectId] = useState(1) // Default project for now
  const [mindmaps, setMindmaps] = useState([])
  const [saveStatus, setSaveStatus] = useState('')
  const reactFlowInstance = useReactFlow()
  const { project, getNode, getNodes } = reactFlowInstance
  const nodeCountRef = useRef(0)
  const autoSaveTimerRef = useRef(null)
  const reactFlowWrapper = useRef(null)

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        // Get source node to determine edge color
        const sourceNode = nodes.find(n => n.id === params.source)
        const edgeColor = sourceNode?.data?.color || '#555'
        
        // Create edge with custom styling to match automatic edges
        const newEdge = {
          ...params,
          style: { stroke: edgeColor, strokeWidth: 2 },
          animated: false
        }
        
        return addEdge(newEdge, eds)
      })
    },
    [nodes, setEdges]
  )

  // Add child nodes function
  const addChildNodes = useCallback((parentId, count, direction = 'right') => {
    // Use functional updates to get current state
    setNodes((currentNodes) => {
      const parentNode = currentNodes.find(n => n.id === parentId)
      if (!parentNode) return currentNodes

      // We'll update edges separately
      const newNodesList = []
      const newEdgesList = []

      setEdges((currentEdges) => {
        // Find existing children of this parent in the SAME direction using current edges
        console.log('=== ADDING CHILD ===')
        console.log('Direction:', direction)
        console.log('All edges from parent:', currentEdges.filter(e => e.source === parentId))

        const existingChildren = currentEdges
          .filter(edge => {
            const matches = edge.source === parentId && edge.sourceHandle === direction
            console.log(`Edge ${edge.id}: sourceHandle=${edge.sourceHandle}, direction=${direction}, matches=${matches}`)
            return matches
          })
          .map(edge => currentNodes.find(n => n.id === edge.target))
          .filter(node => node !== undefined)

        console.log('Existing children found:', existingChildren.length, existingChildren.map(c => ({ id: c.id, y: c.position.y })))

        const parentLevel = parentNode.data.level || 0
        const childLevel = parentLevel + 1
        const childColor = getColorForLevel(childLevel)

        // Horizontal tree layout: children go left or right and stack vertically
        const horizontalGap = 250  // Distance left/right
        const verticalSpacing = 120  // Vertical spacing between children
        const childX = direction === 'left'
          ? parentNode.position.x - horizontalGap
          : parentNode.position.x + horizontalGap
        const parentY = parentNode.position.y

        // Count children above, at, and below parent's horizontal line
        const childrenAbove = existingChildren.filter(child => child.position.y < parentY).length
        const childrenAtLevel = existingChildren.filter(child => child.position.y === parentY).length
        const childrenBelow = existingChildren.filter(child => child.position.y > parentY).length

        console.log('Parent:', parentId, 'Y:', parentY)
        console.log('Existing children:', existingChildren.length, 'Above:', childrenAbove, 'At level:', childrenAtLevel, 'Below:', childrenBelow)
        console.log('Children positions:', existingChildren.map(c => ({ id: c.id, y: c.position.y })))

        // Decide where to place new child
        let newChildY

        if (existingChildren.length === 0) {
          // First child - place at parent level
          newChildY = parentY
          console.log('First child - placing at parent Y:', newChildY)
        } else if (childrenAbove <= childrenBelow) {
          // Add above - find the topmost child and add above it
          const topmostChild = existingChildren.reduce((top, child) =>
            (!top || child.position.y < top.position.y) ? child : top
          , null)
          newChildY = topmostChild.position.y - verticalSpacing
          console.log('Adding above - topmost child Y:', topmostChild.position.y, 'new Y:', newChildY)
        } else {
          // Add below - find the bottommost child and add below it
          const bottommostChild = existingChildren.reduce((bottom, child) =>
            (!bottom || child.position.y > bottom.position.y) ? child : bottom
          , null)
          newChildY = bottommostChild.position.y + verticalSpacing
          console.log('Adding below - bottommost child Y:', bottommostChild.position.y, 'new Y:', newChildY)
        }

        // Create new child
        const id = `node-${Date.now()}`
        const childNode = {
          id,
          type: 'custom',
          position: {
            x: childX,
            y: newChildY
          },
          data: {
            label: 'New Node',
            color: childColor,
            level: childLevel,
            direction: direction,
            onAddChildren: addChildNodes
          }
        }

        const edge = {
          id: `edge-${parentId}-${id}`,
          source: parentId,
          sourceHandle: direction === 'left' ? 'left' : 'right',
          target: id,
          style: { stroke: childColor, strokeWidth: 2 },
          animated: false
        }

        newNodesList.push(childNode)
        newEdgesList.push(edge)
        nodeCountRef.current += count

        return [...currentEdges, ...newEdgesList]
      })

      return [...currentNodes, ...newNodesList]
    })
  }, [setNodes, setEdges])

  // Save mindmap to backend
  const handleSave = useCallback(async () => {
    try {
      setSaveStatus('Saving...')
      const mindmapData = {
        nodes: nodes.map(node => ({
          ...node,
          data: { ...node.data, onAddChildren: undefined } // Remove function from data
        })),
        edges
      }

      if (currentMindmapId) {
        // Update existing mindmap
        await mindmapsAPI.update(currentMindmapId, { data: mindmapData })
        setSaveStatus('Saved!')
      } else {
        // Create new mindmap
        const response = await mindmapsAPI.create(currentProjectId, 'My Mindmap', mindmapData)
        setCurrentMindmapId(response.data.id)
        setSaveStatus('Saved!')
      }

      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('Save failed!')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }, [nodes, edges, currentMindmapId, currentProjectId])

  // Load mindmaps for current project
  const loadMindmaps = useCallback(async () => {
    try {
      const response = await mindmapsAPI.getAll(currentProjectId)
      setMindmaps(response.data)
    } catch (error) {
      console.error('Failed to load mindmaps:', error)
    }
  }, [currentProjectId])

  // Load a specific mindmap
  const loadMindmap = useCallback(async (mindmapId) => {
    try {
      setSaveStatus('Loading...')
      const mindmap = mindmaps.find(m => m.id === mindmapId)

      if (mindmap) {
        setCurrentMindmapId(mindmap.id)

        // Restore nodes with onAddChildren function
        const loadedNodes = mindmap.data.nodes.map(node => ({
          ...node,
          data: { ...node.data, onAddChildren: addChildNodes }
        }))

        setNodes(loadedNodes)
        setEdges(mindmap.data.edges)
        setSaveStatus('Loaded!')
      }

      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Load error:', error)
      setSaveStatus('Load failed!')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }, [mindmaps, setNodes, setEdges, addChildNodes])

  // Load mindmap from backend (legacy function for Load button)
  const handleLoad = useCallback(async () => {
    try {
      setSaveStatus('Loading...')
      const response = await mindmapsAPI.getAll(currentProjectId)

      if (response.data.length > 0) {
        const mindmap = response.data[0] // Load the first mindmap for now
        setCurrentMindmapId(mindmap.id)

        // Restore nodes with onAddChildren function
        const loadedNodes = mindmap.data.nodes.map(node => ({
          ...node,
          data: { ...node.data, onAddChildren: addChildNodes }
        }))

        setNodes(loadedNodes)
        setEdges(mindmap.data.edges)
        setMindmaps(response.data)
        setSaveStatus('Loaded!')
      } else {
        setSaveStatus('No mindmaps found')
      }

      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      console.error('Load error:', error)
      setSaveStatus('Load failed!')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }, [currentProjectId, setNodes, setEdges, addChildNodes])

  // Handle project change
  const handleProjectChange = useCallback(async (projectId) => {
    setCurrentProjectId(projectId)
    setCurrentMindmapId(null)
    setNodes([])
    setEdges([])
    nodeCountRef.current = 0

    // Load mindmaps for the new project
    try {
      const response = await mindmapsAPI.getAll(projectId)
      setMindmaps(response.data)

      // Auto-load first mindmap if exists
      if (response.data.length > 0) {
        const mindmap = response.data[0]
        setCurrentMindmapId(mindmap.id)
        const loadedNodes = mindmap.data.nodes.map(node => ({
          ...node,
          data: { ...node.data, onAddChildren: addChildNodes }
        }))
        setNodes(loadedNodes)
        setEdges(mindmap.data.edges)
      }
    } catch (error) {
      console.error('Failed to load mindmaps:', error)
    }
  }, [setNodes, setEdges, addChildNodes])

  // Create new mindmap in current project
  const handleNewMindmap = useCallback(() => {
    setCurrentMindmapId(null)
    setNodes([])
    setEdges([])
    nodeCountRef.current = 0
    setSaveStatus('New mindmap - save to create')
    setTimeout(() => setSaveStatus(''), 3000)
  }, [setNodes, setEdges])

  // Export to JPEG
  const handleExportJPEG = useCallback(() => {
    // First, fit the view to include all nodes and edges
    reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false, duration: 0 })
    
    // Wait a bit for the fitView to apply
    setTimeout(() => {
      const nodesBounds = getNodesBounds(getNodes())
      const viewport = getViewportForBounds(
        nodesBounds,
        1920,  // width
        1080,  // height
        0.5,   // minZoom
        2,     // maxZoom
        0.2    // padding - increased for better edge visibility
      )

      setSaveStatus('Exporting...')

      const viewportElement = document.querySelector('.react-flow__viewport')

      if (viewportElement) {
        toJpeg(viewportElement, {
          backgroundColor: '#ffffff',
          width: 1920,
          height: 1080,
          style: {
            width: '1920px',
            height: '1080px',
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
          },
          quality: 0.95
        })
          .then((dataUrl) => {
            const link = document.createElement('a')
            link.download = `mindmap-${Date.now()}.jpg`
            link.href = dataUrl
            link.click()
            setSaveStatus('Exported!')
            setTimeout(() => setSaveStatus(''), 2000)
          })
          .catch((error) => {
            console.error('Export failed:', error)
            setSaveStatus('Export failed!')
            setTimeout(() => setSaveStatus(''), 2000)
          })
      }
    }, 100) // Small delay to ensure fitView completes
  }, [getNodes, reactFlowInstance])

  // Auto-save effect: debounced save when nodes or edges change
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Only auto-save if there's data and we have a mindmap ID (after first manual save)
    if (nodes.length > 0 || edges.length > 0) {
      autoSaveTimerRef.current = setTimeout(() => {
        if (currentMindmapId) {
          setSaveStatus('Auto-saving...')
          handleSave()
        }
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    // Cleanup
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [nodes, edges, currentMindmapId])

  // Double-click canvas to create node
  const onPaneClick = useCallback((event) => {
    // Check if it's a double-click
    if (event.detail === 2) {
      console.log('Double-click detected!', event)
      const position = project({ x: event.clientX, y: event.clientY })
      console.log('Position:', position)
      const id = `node-${Date.now()}`
      const level = 0  // Root nodes are level 0
      const color = getColorForLevel(level)

      const newNode = {
        id,
        type: 'custom',
        position,
        data: {
          label: 'New Node',
          color: color,
          level: level,
          onAddChildren: addChildNodes
        }
      }

      console.log('Creating node:', newNode)
      setNodes((nds) => [...nds, newNode])
      nodeCountRef.current += 1
    }
  }, [setNodes, project, addChildNodes])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Top Toolbar - Project Switcher */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <ProjectSwitcher
          currentProjectId={currentProjectId}
          onProjectChange={handleProjectChange}
        />
      </div>

      {/* Toolbar */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Save
        </button>
        <button
          onClick={handleExportJPEG}
          style={{
            padding: '8px 16px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Export JPEG
        </button>
        {saveStatus && (
          <span style={{
            padding: '8px 12px',
            fontSize: '14px',
            color: '#555'
          }}>
            {saveStatus}
          </span>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        zoomOnDoubleClick={false}
        deleteKeyCode="KeyX"
        edgesUpdatable={true}
        edgesFocusable={true}
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        selectionMode="partial"
        multiSelectionKeyCode="Shift"
        connectionLineStyle={{ stroke: '#555', strokeWidth: 2 }}
        defaultEdgeOptions={{
          style: { strokeWidth: 2 }
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default MindMapCanvas
