import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjects, getBudget, addItem, updateItem, deleteItem } from '../api';
import { exportBudgetPdf } from '../utils/exportPdf';

function BudgetEditor() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    const projects = await getProjects();
    setProject(projects.find((p) => p.id === Number(id)));
    const budget = await getBudget(id);
    setItems(budget.items);
    setTotal(Number(budget.total));
  }

  useEffect(() => {
    loadData();
  }, [id]);

  function resetForm() {
    setDescription('');
    setQuantity(1);
    setUnitPrice('');
    setEditingId(null);
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setDescription(item.description);
    setQuantity(item.quantity);
    setUnitPrice(item.unit_price);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      description,
      quantity: Number(quantity),
      unit_price: Number(unitPrice),
    };
    if (editingId) {
      await updateItem(editingId, data);
    } else {
      await addItem({ project_id: Number(id), ...data });
    }
    resetForm();
    loadData();
  }

  async function handleDelete(itemId) {
    if (!window.confirm('Delete this item?')) return;
    await deleteItem(itemId);
    loadData();
  }

  return (
    <div>
      <Link to="/projects">← Back to Projects</Link>

      {project && (
        <h2>
          Budget for: {project.title} (Client: {project.client_name})
        </h2>
      )}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Unit price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Save Changes' : 'Add Item'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>Cancel</button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Line total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.unit_price).toFixed(2)}</td>
              <td>{Number(item.line_total).toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: {total.toFixed(2)}</h3>

      <button
        onClick={() => exportBudgetPdf(project, items, total)}
        disabled={!project}
      >
        Export PDF
      </button>
    </div>
  );
}

export default BudgetEditor;