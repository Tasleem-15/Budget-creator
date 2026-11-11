const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const uid = req.userId;

    const counts = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM clients WHERE user_id = $1) AS clients,
         (SELECT COUNT(*) FROM projects
            JOIN clients ON projects.client_id = clients.id
            WHERE clients.user_id = $1) AS projects`,
      [uid]
    );

    const earnings = await pool.query(
      `SELECT COALESCE(SUM(bi.quantity * bi.unit_price), 0) AS total_earnings
       FROM budget_items bi
       JOIN projects p ON bi.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       WHERE p.status = 'completed' AND c.user_id = $1`,
      [uid]
    );

    const byStatus = await pool.query(
      `SELECT p.status, COUNT(*) AS count
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE c.user_id = $1
       GROUP BY p.status`,
      [uid]
    );

    const byMonth = await pool.query(
      `SELECT TO_CHAR(p.created_at, 'YYYY-MM') AS month,
              SUM(bi.quantity * bi.unit_price) AS earnings
       FROM budget_items bi
       JOIN projects p ON bi.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       WHERE p.status = 'completed' AND c.user_id = $1
       GROUP BY month
       ORDER BY month`,
      [uid]
    );

    res.json({
      clients: Number(counts.rows[0].clients),
      projects: Number(counts.rows[0].projects),
      totalEarnings: Number(earnings.rows[0].total_earnings),
      byStatus: byStatus.rows,
      byMonth: byMonth.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;