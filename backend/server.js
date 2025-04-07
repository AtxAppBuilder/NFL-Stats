const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require("path");

const playersRoute = require("./routes/playersRoute");
const seasonStatsRoute = require('./routes/seasonStatsRoute');
const salaryDataRoute = require('./routes/salaryDataRoute');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://nfl-stats-1.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Serve uploaded files statically
//This file always needs to be here in the root file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/players', playersRoute);
app.use('/api/season_stats', seasonStatsRoute)
app.use('/api/salary', salaryDataRoute)
app.use('/api/user', profileRoutes)
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });