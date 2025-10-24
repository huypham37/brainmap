import axios from 'axios'

const API_BASE_URL = '/api'

// Projects API
export const projectsAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/projects`),
  create: (name) => axios.post(`${API_BASE_URL}/projects`, { name }),
  delete: (id) => axios.delete(`${API_BASE_URL}/projects/${id}`)
}

// Mindmaps API
export const mindmapsAPI = {
  getAll: (projectId) => axios.get(`${API_BASE_URL}/mindmaps`, {
    params: projectId ? { project_id: projectId } : {}
  }),
  create: (projectId, name, data) => axios.post(`${API_BASE_URL}/mindmaps`, {
    project_id: projectId,
    name,
    data
  }),
  update: (id, data) => axios.put(`${API_BASE_URL}/mindmaps/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/mindmaps/${id}`)
}
