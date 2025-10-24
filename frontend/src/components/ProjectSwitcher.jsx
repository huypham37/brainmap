import React, { useState, useEffect } from 'react'
import { projectsAPI } from '../services/api'

const ProjectSwitcher = ({ currentProjectId, onProjectChange }) => {
  const [projects, setProjects] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateInput, setShowCreateInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [status, setStatus] = useState('')

  // Load projects on component mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      setProjects(response.data)
    } catch (error) {
      console.error('Failed to load projects:', error)
      setStatus('Failed to load projects')
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      setStatus('Creating...')
      const response = await projectsAPI.create(newProjectName.trim())
      setProjects([...projects, response.data])
      onProjectChange(response.data.id)
      setNewProjectName('')
      setShowCreateInput(false)
      setIsOpen(false)
      setStatus('Project created!')
      setTimeout(() => setStatus(''), 2000)
    } catch (error) {
      console.error('Failed to create project:', error)
      setStatus('Failed to create project')
      setTimeout(() => setStatus(''), 2000)
    }
  }

  const handleProjectSelect = (projectId) => {
    onProjectChange(projectId)
    setIsOpen(false)
  }

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation() // Prevent triggering project select

    if (projects.length <= 1) {
      setStatus('Cannot delete last project')
      setTimeout(() => setStatus(''), 2000)
      return
    }

    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      setStatus('Deleting...')
      await projectsAPI.delete(projectId)

      // Remove from list
      const updatedProjects = projects.filter(p => p.id !== projectId)
      setProjects(updatedProjects)

      // If we deleted the current project, switch to the first available one
      if (projectId === currentProjectId && updatedProjects.length > 0) {
        onProjectChange(updatedProjects[0].id)
      }

      setStatus('Project deleted!')
      setTimeout(() => setStatus(''), 2000)
    } catch (error) {
      console.error('Failed to delete project:', error)
      setStatus('Delete failed!')
      setTimeout(() => setStatus(''), 2000)
    }
  }

  const currentProject = projects.find(p => p.id === currentProjectId)

  return (
    <div style={{ position: 'relative' }}>
      {/* Project selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 16px',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📁</span>
        <span>{currentProject ? currentProject.name : 'Select Project'}</span>
        <span style={{ fontSize: '10px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '0',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '250px',
          zIndex: 2000,
          overflow: 'hidden'
        }}>
          {/* Project list */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
                style={{
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: project.id === currentProjectId ? '#f3f4f6' : 'white',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = project.id === currentProjectId ? '#f3f4f6' : 'white'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  style={{
                    padding: '6px',
                    background: 'transparent',
                    color: '#9ca3af',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  title="Delete project"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Create new project section */}
          <div style={{
            borderTop: '2px solid #e5e7eb',
            padding: '8px'
          }}>
            {!showCreateInput ? (
              <button
                onClick={() => setShowCreateInput(true)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#f9fafb',
                  color: '#374151',
                  border: '1px dashed #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                + New Project
              </button>
            ) : (
              <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 12px',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateInput(false)
                    setNewProjectName('')
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Status message */}
      {status && (
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '0',
          background: 'white',
          padding: '4px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '12px',
          color: '#374151',
          whiteSpace: 'nowrap'
        }}>
          {status}
        </div>
      )}
    </div>
  )
}

export default ProjectSwitcher
