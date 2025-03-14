const express = require('express')

const { getAllSeasonStats, searchSeasonStats, getPositionAverages, getTopTenPlayers } = require("../controllers/seasonStatsController.js");

const router = express.Router();

router.get("/", getAllSeasonStats);
router.get('/search', searchSeasonStats)
router.get('/position-averages', getPositionAverages);
router.get('/top-ten-players', getTopTenPlayers);

module.exports = router;

