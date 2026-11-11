const BASE = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth
export const registerUser = (body) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(body) });

export const loginUser = (body) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(body) });

// Clients
export const getClients = () => request('/clients');

export const addClient = (client) =>
  request('/clients', { method: 'POST', body: JSON.stringify(client) });

export const updateClient = (id, client) =>
  request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(client) });

export const deleteClient = (id) =>
  request(`/clients/${id}`, { method: 'DELETE' });

// Projects
export const getProjects = () => request('/projects');

export const addProject = (project) =>
  request('/projects', { method: 'POST', body: JSON.stringify(project) });

export const updateProject = (id, project) =>
  request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) });

export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: 'DELETE' });

// Budget items
export const getBudget = (projectId) => request(`/budgets/project/${projectId}`);

export const addItem = (item) =>
  request('/budgets', { method: 'POST', body: JSON.stringify(item) });

export const updateItem = (id, item) =>
  request(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(item) });

export const deleteItem = (id) =>
  request(`/budgets/${id}`, { method: 'DELETE' });

// Dashboard
export const getDashboard = () => request('/dashboard');