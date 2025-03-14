const axios = require('axios');
const dotenv = require('dotenv');
const {sql} = require('../config/db')
dotenv.config();

const BASE_URL = 'https://api.balldontlie.io/nfl/v1'

const getAllPlayers = async (req, res) => {
    const { first_name, last_name } = req.query;

    try {
        // Step 1: Check if the player exists in the local database
        const localPlayers = await sql`
            SELECT 
                pp.id AS player_id,
                pp.first_name,
                pp.last_name,
                pp.position,
                pp.position_abbreviation,
                pp.height,
                pp.weight,
                pp.jersey_number,
                pp.college,
                pp.experience,
                pp.age,
                t.id AS team_id,
                t.conference AS team_conference,
                t.division AS team_division,
                t.location AS team_location,
                t.name AS team_name,
                t.full_name AS team_full_name,
                t.abbreviation AS team_abbreviation
            FROM 
                player_profile pp
            JOIN 
                team t ON pp.team_id = t.id
            WHERE 
                pp.first_name ILIKE ${`%${first_name}%`} AND pp.last_name ILIKE ${`%${last_name}%`}
        `;

        // If the player exists in the local database, return the data
        if (localPlayers.length > 0) {
            return res.status(200).json(localPlayers);
        }

        // Step 2: If the player doesn't exist locally, fetch from the external API
        const response = await axios.get(`${BASE_URL}/players`, {
            headers: {
                Authorization: process.env.API_KEY,
            },
            params: {
                first_name,
                last_name,
            },
        });

        const players = response.data.data;

        // Step 3: Save the fetched players to the local database
        let successfulInserts = 0;
        let failedInserts = 0;

        for (const player of players) {
            const { 
                id, 
                first_name, 
                last_name, 
                position, 
                position_abbreviation, 
                height, 
                weight, 
                jersey_number, 
                college, 
                experience, 
                age,
                team // Destructure the nested team object
            } = player;

            // Destructure the team object
            const {
                id: team_id,
                conference: team_conference,
                division: team_division, 
                location: team_location, 
                name: team_name, 
                full_name: team_full_name, 
                abbreviation: team_abbreviation 
            } = team;

            try {
                // Insert the player into the local database
                await sql`
                    INSERT INTO player_profile (
                        id, first_name, last_name, position, position_abbreviation, 
                        height, weight, jersey_number, college, experience, age, team_id, team_conference,
                        team_division, team_location, team_name, team_full_name, team_abbreviation
                    ) VALUES (
                        ${id}, ${first_name}, ${last_name}, ${position}, ${position_abbreviation}, 
                        ${height}, ${weight}, ${jersey_number}, ${college}, ${experience}, ${age}, ${team_id},
                        ${team_conference}, ${team_division}, ${team_location}, ${team_name}, ${team_full_name},
                        ${team_abbreviation}
                    )
                    ON CONFLICT (id) DO UPDATE SET
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        position = EXCLUDED.position,
                        position_abbreviation = EXCLUDED.position_abbreviation,
                        height = EXCLUDED.height,
                        weight = EXCLUDED.weight,
                        jersey_number = EXCLUDED.jersey_number,
                        college = EXCLUDED.college,
                        experience = EXCLUDED.experience,
                        age = EXCLUDED.age,
                        team_id = EXCLUDED.team_id,
                        team_conference = EXCLUDED.team_conference,
                        team_division = EXCLUDED.team_division,
                        team_location = EXCLUDED.team_location,
                        team_name = EXCLUDED.team_name,
                        team_full_name = EXCLUDED.team_full_name,
                        team_abbreviation = EXCLUDED.team_abbreviation,
                        updated_at = NOW()
                `;
                successfulInserts++;
            } catch (dbError) {
                console.error(`Error saving player ${player.id}:`, dbError);
                failedInserts++;
            }
        }

        // Step 4: Return the fetched players
        if (players.length > 0) {
            res.status(200).json(players);
        } else {
            res.status(404).json({ error: "Player not found" });
        }
    } catch (error) {
        console.error("Error fetching or saving players:", error);
        res.status(500).json({ error: "Failed to fetch or save players" });
    }
};

    const getPlayerById = async (req, res) => {
        try {
            const { id } = req.params;
    
            const response = await axios.get(`${BASE_URL}/players/${id}`, {
                headers: {
                    Authorization: process.env.API_KEY,
                },
            });
    
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching player by ID:', error);
            res.status(500).json({ error: 'Failed to fetch player' });
        }
    };

module.exports = {
    getAllPlayers,
    getPlayerById
};


    
    