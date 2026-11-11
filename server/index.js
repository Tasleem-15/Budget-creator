require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requireAuth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', requireAuth, require('./routes/clients'));
app.use('/api/projects', requireAuth, require('./routes/projects'));
app.use('/api/budgets', requireAuth, require('./routes/budgets'));
app.use('/api/dashboard', requireAuth, require('./routes/dashboard'));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});