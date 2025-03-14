const fs = require('fs');
const { sql } = require('./config/db');
require('dotenv').config();

const migrateSalaries = async () => {
  try {
    let playerSalaries;
    try {
      playerSalaries = JSON.parse(
        fs.readFileSync(
          '/mnt/c/MyApps/Portfolio/NFL-Stats/backend/salaries.json',
          'utf-8'
        )
      );
    } catch (fileError) {
      console.error('Error reading salaries.json:', fileError.message);
      console.error('Please check if the path points to a valid JSON file. Current path:', '/mnt/c/MyApps/Portfolio/NFL-Stats/backend/salaries.json');
      return;
    }

    const normalizeName = (name) => {
      let normalized = name
        .replace(/Jr\.?|Sr\.?|I{2,5}/gi, '')
        .replace(/\./g, '')
        .trim();

      normalized = normalized.replace(/\b\w+/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });

      return normalized;
    };

    const teamNameMap = {
      'Rams': 'LA',
      'Cowboys': 'DAL',
      'Bengals': 'CIN',
      'Patriots': 'NE',
      'Bills': 'BUF',
      'Jets': 'NYJ',
      'Dolphins': 'MIA',
      'Ravens': 'BAL',
      'Steelers': 'PIT',
      'Browns': 'CLE',
      'Texans': 'HOU',
      'Titans': 'TEN',
      'Colts': 'IND',
      'Jaguars': 'JAX',
      'Chiefs': 'KC',
      'Broncos': 'DEN',
      'Raiders': 'LV',
      'Chargers': 'LAC',
      'Eagles': 'PHI',
      'Giants': 'NYG',
      'Commanders': 'WSH',
      'Packers': 'GB',
      'Vikings': 'MIN',
      'Bears': 'CHI',
      'Lions': 'DET',
      'Saints': 'NO',
      'Falcons': 'ATL',
      'Buccaneers': 'TB',
      'Panthers': 'CAR',
      '49ers': 'SF',
      'Seahawks': 'SEA',
      'Cardinals': 'ARI'
    };

    for (const salary of playerSalaries) {
      try {
        const normalizedFirstName = normalizeName(salary.first_name);
        const normalizedLastName = normalizeName(salary.last_name);
        const teamKey = teamNameMap[salary.team] || salary.team;

        let teamResult;
        try {
          teamResult = await sql`
            SELECT id
            FROM public.team
            WHERE LOWER(abbreviation) = LOWER(${teamKey}) OR LOWER(name) = LOWER(${teamKey})
            LIMIT 1;
          `;
          console.log('teamResult for', teamKey, ':', teamResult); // Debugging
        } catch (error) {
          console.error(`Error querying team for ${teamKey}:`, error);
          continue; // Skip to the next iteration
        }

        // Handle Neon result format (direct array) vs. pg result format (object with rows)
        const rows = Array.isArray(teamResult) ? teamResult : (teamResult?.rows || []);

        // Safeguard against invalid teamResult
        if (!rows) {
          console.warn(`Invalid team result for ${teamKey}. Skipping...`);
          continue;
        }

        const team_id = rows.length > 0 ? rows[0].id : null;

        if (!team_id) {
          console.warn(`No team found for ${salary.team} (key: ${teamKey}). Skipping...`);
          continue;
        }

        const playerResult = await sql`
          SELECT id
          FROM player_profile
          WHERE LOWER(first_name) = LOWER(${normalizedFirstName})
          AND LOWER(last_name) = LOWER(${normalizedLastName})
          AND team_id = ${team_id}
          LIMIT 1;
        `;
        const playerRows = Array.isArray(playerResult) ? playerResult : (playerResult?.rows || []);
        let player_id = playerRows.length > 0 ? playerRows[0].id : null;

        if (!player_id) {
          console.warn(`No player found for ${salary.first_name} ${salary.last_name} on team ${salary.team}. Attempting to insert new player...`);
          const newPlayerResult = await sql`
            INSERT INTO player_profile (first_name, last_name, position, team_id)
            VALUES (${salary.first_name}, ${salary.last_name}, ${salary.position}, ${team_id})
            ON CONFLICT (first_name, last_name, team_id) DO NOTHING
            RETURNING id;
          `;
          const newPlayerRows = Array.isArray(newPlayerResult) ? newPlayerResult : (newPlayerResult?.rows || []);
          player_id = newPlayerRows.length > 0 ? newPlayerRows[0].id : null;

          if (!player_id) {
            console.error(`Failed to insert or find player ${salary.first_name} ${salary.last_name}. Skipping...`);
            continue;
          }
        }

        const totalValue = parseFloat(salary.total_value.replace(/[^\d.]/g, '')) || 0;
        const apy = parseFloat(salary.apy.replace(/[^\d.]/g, '')) || 0;
        const totalGuaranteed = parseFloat(salary.total_guaranteed.replace(/[^\d.]/g, '')) || 0;
        const avgGuaranteePerYear = parseFloat(salary.avg_guarantee_per_year.replace(/[^\d.]/g, '')) || 0;
        const percentGuaranteed = parseFloat(salary.percent_guaranteed.replace('%', '').trim()) || 0;

        const result = await sql`
          INSERT INTO salaries (
            player_id, first_name, last_name, team, position,
            total_value, apy, total_guaranteed, avg_guarantee_per_year, percent_guaranteed
          )
          VALUES (${player_id}, ${salary.first_name}, ${salary.last_name}, ${team_id}, ${salary.position}, ${totalValue}, ${apy}, ${totalGuaranteed}, ${avgGuaranteePerYear}, ${percentGuaranteed})
          ON CONFLICT (player_id) DO NOTHING
          RETURNING salary_id;
        `;
        const resultRows = Array.isArray(result) ? result : (result?.rows || []);
        const insertedSalaryId = resultRows.length > 0 ? resultRows[0].salary_id : 'N/A (conflict)';
        console.log(`Inserted salary for: ${salary.first_name} ${salary.last_name} (salary_id: ${insertedSalaryId})`);
      } catch (error) {
        console.error(`Error inserting salary for ${salary.first_name} ${salary.last_name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

migrateSalaries();



