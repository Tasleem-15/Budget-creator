import { useState, useEffect } from 'react';
import { getClients, addClient, updateClient, deleteClient } from '../api';

function Clients() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState(null);

  async function loadClients() {
    const data = await getClients();
    setClients(data);
  }

  useEffect(() => {
    loadClients();
  }, []);

  function resetForm() {
    setName('');
    setEmail('');
    setPhone('');
    setEditingId(null);
  }

  function handleEdit(client) {
    setEditingId(client.id);
    setName(client.name);
    setEmail(client.email || '');
    setPhone(client.phone || '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await updateClient(editingId, { name, email, phone });
    } else {
      await addClient({ name, email, phone });
    }
    resetForm();
    loadClients();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this client and all their projects?')) return;
    await deleteClient(id);
    loadClients();
  }

  return (
    <div>
      <h2>Clients</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">{editingId ? 'Save Changes' : 'Add Client'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.email} - {client.phone}
            <button onClick={() => handleEdit(client)}>Edit</button>
            <button onClick={() => handleDelete(client.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;