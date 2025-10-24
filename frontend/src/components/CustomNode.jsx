import React, { useState, useEffect } from 'react'
import { Handle, Position, useReactFlow } from 'reactflow'

const CustomNode = ({ data, id, selected }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const { setNodes } = useReactFlow()

  // Update local label when data.label changes
  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const updateNodeLabel = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: label
            }
          }
        }
        return node
      })
    )
  }

  const handleBlur = () => {
    setIsEditing(false)
    updateNodeLabel()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      updateNodeLabel()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data.label) // Reset to original value
    }
  }

  const handleAddClick = (e, direction = 'right') => {
    e.stopPropagation()
    // Directly create one child node in the specified direction
    if (data.onAddChildren) {
      data.onAddChildren(id, 1, direction)
    }
  }

  const nodeColor = data.color || '#4ECDC4'

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        background: selected ? '#f0f9ff' : '#fff',
        border: selected ? `3px solid ${nodeColor}` : `2px solid ${nodeColor}`,
        minWidth: '150px',
        position: 'relative',
        boxShadow: selected ? `0 0 0 2px ${nodeColor}40` : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Target handle - where edges connect TO this node */}
      {/* If node is from left direction, target is on right. Otherwise on left */}
      <Handle type="target" position={data.direction === 'left' ? Position.Right : Position.Left} />

      {/* Source handles for root nodes - both left and right */}
      {data.level === 0 && (
        <>
          <Handle type="source" position={Position.Left} id="left" />
          <Handle type="source" position={Position.Right} id="right" />
        </>
      )}

      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '14px'
          }}
        />
      ) : (
        <div onDoubleClick={handleDoubleClick} style={{ fontSize: '14px' }}>
          {label}
        </div>
      )}

      {isHovered && !isEditing && (
        <>
          {/* Left + button - for root nodes OR left-branching nodes */}
          {(data.level === 0 || data.direction === 'left') && (
            <button
              onClick={(e) => handleAddClick(e, 'left')}
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: nodeColor,
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          )}
          {/* Right + button - for root nodes OR right-branching nodes */}
          {(data.level === 0 || data.direction === 'right' || !data.direction) && (
            <button
              onClick={(e) => handleAddClick(e, 'right')}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: nodeColor,
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          )}
        </>
      )}

      {/* Source handle - where edges connect FROM this node */}
      {/* If node is from left, children go left (source on left). Otherwise right. */}
      {data.level !== 0 && (
        <Handle type="source" position={data.direction === 'left' ? Position.Left : Position.Right} />
      )}
    </div>
  )
}

export default CustomNode
