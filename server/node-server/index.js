require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const analyzeRoutes = require('./routes/analyzeRoutes');
const replayRoutes = require("./routes/replayRoutes");

const app = express();

/* ================= Env ================= */

const PORT = process.env.PORT || 5000;

/* ================= Middleware ================= */

app.use(cors());
app.use(express.json());

/* ================= Static Files ================= */

// Node owns screenshots only
app.use(
  '/screenshots',
  express.static(path.join(__dirname, 'storage', 'screenshots'))
);

/* ================= Routes (Node only stuff) ================= */

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/analyze', analyzeRoutes);
app.use('/api/replay', replayRoutes);

// Serve generated reports
app.use('/reports', express.static(path.join(__dirname, 'reports')));

/* ================= Start ================= */

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
