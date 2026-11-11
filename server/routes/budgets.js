const express = require('express');
const pool = require('../db');

const router = express.Router();

async function ownsProject(projectId, userId) {
  const result = await pool.query(
    `SELECT projects.id FROM projects
     JOIN clients ON projects.client_id = clients.id
     WHERE projects.id = $1 AND clients.user_id = $2`,
    [projectId, userId]
  );
  return result.rows.length > 0;
}

// GET all items of one project, plus the total
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!(await ownsProject(projectId, req.userId))) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const items = await pool.query(
      `SELECT *, quantity * unit_price AS line_total
       FROM budget_items
       WHERE project_id = $1
       ORDER BY id`,
      [projectId]
    );

    const total = await pool.query(
      `SELECT COALESCE(SUM(quantity * unit_price), 0) AS total
       FROM budget_items
       WHERE project_id = $1`,
      [projectId]
    );

    res.json({ items: items.rows, total: total.rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new item
router.post('/', async (req, res) => {
  try {
    const { project_id, description, quantity, unit_price } = req.body;

    if (!(await ownsProject(project_id, req.userId))) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const result = await pool.query(
      `INSERT INTO budget_items (project_id, description, quantity, unit_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [project_id, description, quantity || 1, unit_price || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT (edit) an item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, quantity, unit_price } = req.body;
    const result = await pool.query(
      `UPDATE budget_items
       SET description = $1, quantity = $2, unit_price = $3
       WHERE id = $4
       AND project_id IN (
         SELECT projects.id FROM projects
         JOIN clients ON projects.client_id = clients.id
         WHERE clients.user_id = $5
       )
       RETURNING *`,
      [description, quantity, unit_price, id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE an item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM budget_items
       WHERE id = $1
       AND project_id IN (
         SELECT projects.id FROM projects
         JOIN clients ON projects.client_id = clients.id
         WHERE clients.user_id = $2
       )
       RETURNING *`,
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;