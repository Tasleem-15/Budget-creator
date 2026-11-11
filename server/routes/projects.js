const express = require('express');
const pool = require('../db');

const router = express.Router();

async function ownsClient(clientId, userId) {
  const result = await pool.query(
    'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
    [clientId, userId]
  );
  return result.rows.length > 0;
}

// GET my projects (with the client's name)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT projects.*, clients.name AS client_name
       FROM projects
       JOIN clients ON projects.client_id = clients.id
       WHERE clients.user_id = $1
       ORDER BY projects.id`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new project
router.post('/', async (req, res) => {
  try {
    const { client_id, title, status } = req.body;

    if (!(await ownsClient(client_id, req.userId))) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const result = await pool.query(
      'INSERT INTO projects (client_id, title, status) VALUES ($1, $2, $3) RETURNING *',
      [client_id, title, status || 'draft']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT (edit) a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, title, status } = req.body;

    if (!(await ownsClient(client_id, req.userId))) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const result = await pool.query(
      `UPDATE projects SET client_id = $1, title = $2, status = $3
       WHERE id = $4
       AND client_id IN (SELECT id FROM clients WHERE user_id = $5)
       RETURNING *`,
      [client_id, title, status, id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM projects
       WHERE id = $1
       AND client_id IN (SELECT id FROM clients WHERE user_id = $2)
       RETURNING *`,
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;