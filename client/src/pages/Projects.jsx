import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients, getProjects, addProject, updateProject, deleteProject } from '../api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('draft');
  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    setProjects(await getProjects());
    setClients(await getClients());
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setClientId('');
    setTitle('');
    setStatus('draft');
    setEditingId(null);
  }

  function handleEdit(project) {
    setEditingId(project.id);
    setClientId(project.client_id);
    setTitle(project.title);
    setStatus(project.status);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { client_id: Number(clientId), title, status };
    if (editingId) {
      await updateProject(editingId, data);
    } else {
      await addProject(data);
    }
    resetForm();
    loadData();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project and its budget items?')) return;
    await deleteProject(id);
    loadData();
  }

  return (
    <div>
      <h2>Projects</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit">{editingId ? 'Save Changes' : 'Add Project'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            Project: {project.title} | Client: {project.client_name} | Status: {project.status}
            <Link to={`/projects/${project.id}/budget`}> Budget </Link>
            <button onClick={() => handleEdit(project)}>Edit</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;