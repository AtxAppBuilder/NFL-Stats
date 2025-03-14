// salaryDataController.js
const dotenv = require('dotenv');
const { sql } = require('../config/db');
dotenv.config();

const getPlayerSalary = async (req, res) => {
    const { first_name, last_name } = req.query;

    if (!first_name || !last_name) {
        return res.status(400).json({ error: "First name and last name are required" });
      }

      try {
        const player = await sql`
          SELECT id FROM player_profile
          WHERE LOWER(first_name) = LOWER(${first_name})
          AND LOWER(last_name) = LOWER(${last_name})
          LIMIT 1;
        `;

        if (player.length === 0) {
            return res.status(404).json({ error: "Player not found" });
          }
      
          const player_id = player[0].id;

         
    const salary = await sql`
    SELECT * FROM salaries
    WHERE player_id = ${player_id}  
  `;

  if (salary.length === 0) {
    return res.status(404).json({ error: "No salary data found for this player in 2024" });
  }

  res.json(salary); 
} catch (error) {
  console.error("Error fetching salary data:", error);
  res.status(500).json({ error: "Internal server error" });
}
};

const getTopTenSalaries = async (req, res) => {
  const { first_name, last_name} = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ error: "Provide first and last name please"})
    }

  try {

    const player = await sql`
    SELECT id FROM player_profile
    WHERE LOWER(first_name) = LOWER${first_name}
    AND LOWER (last_name) = LOWER${last_name}
    LIMIT 1
    `;

    if (player.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const player_id = player[0].id;
    
    const salary = await sql`
    SELECT * FROM salaries
    WHERE player_id = ${player_id}  
  `;

  if (salary.length === 0) {
    return res.status(404).json({ error: "No salary data found for this player in 2024" });
  }

  res.json(salary); 
} catch (error) {
  console.error("Error fetching salary data:", error);
  res.status(500).json({ error: "Internal server error" });
}
};

const getTopTenSalariesByPosition = async (req, res) => {
  try {
    const { position } = req.query;

    const targetPosition = position ? position.toUpperCase() : null;

    if (!targetPosition) {
      return res.status(400).json({ error: 'Position is required (e.g., QB, RB, WR)' });
    }

    const validPositions = ['QB', 'RB', 'WR', 'TE', 'FB', 'DE', 'DL', 'CB', 'S', 'K', 'KR', 'P'];
    if (!validPositions.includes(targetPosition)) {
      return res.status(400).json({ error: `Invalid position. Use one of: ${validPositions.join(', ')}` });
    }

    const query = `
      SELECT
        first_name,
        last_name,
        apy,
        position
      FROM salaries
      WHERE position = $1
      AND apy IS NOT NULL
      ORDER BY apy DESC
      LIMIT 10
    `;
    console.log('Executing query:', query, 'with params:', [targetPosition]);
    const topTenSalaries = await sql(query, [targetPosition]);
    console.log('Query result:', topTenSalaries);

    if (topTenSalaries.length === 0) {
      return res.status(404).json({ error: `No salary data found for position ${targetPosition}` });
    }

    const result = topTenSalaries.map(player => ({
      name: `${player.first_name} ${player.last_name}`,
      salary: player.apy,
      position: player.position
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching top ten salaries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHighestPaid = async (req, res) => {
  try {
    const query = `
    SELECT s.position, MAX(s.apy) AS apy
      FROM salaries s
      WHERE s.apy IS NOT NULL
      GROUP BY s.position;
    `;

    console.log('Executing query:', query);
    const highestPaidPlayers = await sql(query);
    console.log('Query result:', highestPaidPlayers);

    if (highestPaidPlayers.length === 0) {
      return res.status(404).json({ error: 'No salary data found in the database' });
    }

    const result = highestPaidPlayers.map(player => ({
      position: player.position,
      salary: player.apy
    }));

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching highest-paid players by position:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
  getPlayerSalary,
  getTopTenSalaries,
  getTopTenSalariesByPosition,
  getHighestPaid 
};