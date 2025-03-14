const express = require('express')

const router = express.Router();

const { getPlayerSalary, getTopTenSalaries, getTopTenSalariesByPosition, getHighestPaid } = require("../controllers/salaryDataController.js");

router.get("/", getPlayerSalary);

router.get('/top-ten-salaries', getTopTenSalaries)

router.get('/top-ten-salaries-position', getTopTenSalariesByPosition)

router.get('/highest-paid', getHighestPaid)

module.exports = router;