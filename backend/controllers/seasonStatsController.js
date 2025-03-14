const axios = require('axios');
const dotenv = require('dotenv');
const {sql} = require('../config/db')
dotenv.config();
const BASE_URL = 'https://api.balldontlie.io/nfl/v1'

const getAllSeasonStats = async (req, res) => {
    try {
        const {season, team_id, postseason, sort_by, sort_order} = req.query;

        let allSeasonStats = [];
        let currentCursor = null;

        do {
        const response = await axios.get(`${BASE_URL}/season_stats`, {
            headers: {
                Authorization: process.env.API_KEY,
            },
            params: {
                season,
                team_id,
                postseason,
                sort_by,
                sort_order,
                cursor: currentCursor || null 
            },
            if (player_ids) {
                this.params.player_ids = player_ids;
            }
        });

        const seasonStats = response.data.data;
        const meta = response.data.meta;

        // ✅ Save season stats to database
        for (const stat of seasonStats) {
            const {
                player :{id: player_id},
                season, postseason, games_played, passing_completions, passing_attempts, passing_yards,
                yards_per_pass_attempt, passing_touchdowns, passing_interceptions, passing_yards_per_game, passing_completion_pct,
                qbr, rushing_attempts, rushing_yards, rushing_yards_per_game, yards_per_rush_attempt, rushing_touchdowns,
                rushing_fumbles, rushing_fumbles_lost, rushing_first_downs, receptions, receiving_yards, yards_per_reception,
                receiving_touchdowns, receiving_fumbles, receiving_fumbles_lost, receiving_first_downs, receiving_targets,
                receiving_yards_per_game, fumbles_forced, fumbles_recovered, total_tackles, defensive_sacks, defensive_sack_yards,
                solo_tackles, assist_tackles, fumbles_touchdowns, defensive_interceptions, interception_touchdowns,
                kick_returns, kick_return_yards, yards_per_kick_return, kick_return_touchdowns, punt_returner_returns,
                punt_returner_return_yards, yards_per_punt_return, punt_return_touchdowns, field_goal_attempts, field_goals_made,
                field_goal_pct, punts, punt_yards, field_goals_made_1_19, field_goals_made_20_29, field_goals_made_30_39,
                field_goals_made_40_49, field_goals_made_50, field_goals_attempts_1_19, field_goals_attempts_20_29,
                field_goals_attempts_30_39, field_goals_attempts_40_49, field_goals_attempts_50
            } = stat;

            try {
                await sql`
                    INSERT INTO season_stats (
                        player_id, season, postseason, games_played, passing_completions, passing_attempts, passing_yards,
                        yards_per_pass_attempt, passing_touchdowns, passing_interceptions, passing_yards_per_game, passing_completion_pct,
                        qbr, rushing_attempts, rushing_yards, rushing_yards_per_game, yards_per_rush_attempt, rushing_touchdowns,
                        rushing_fumbles, rushing_fumbles_lost, rushing_first_downs, receptions, receiving_yards, yards_per_reception,
                        receiving_touchdowns, receiving_fumbles, receiving_fumbles_lost, receiving_first_downs, receiving_targets,
                        receiving_yards_per_game, fumbles_forced, fumbles_recovered, total_tackles, defensive_sacks, defensive_sack_yards,
                        solo_tackles, assist_tackles, fumbles_touchdowns, defensive_interceptions, interception_touchdowns,
                        kick_returns, kick_return_yards, yards_per_kick_return, kick_return_touchdowns, punt_returner_returns,
                        punt_returner_return_yards, yards_per_punt_return, punt_return_touchdowns, field_goal_attempts, field_goals_made,
                        field_goal_pct, punts, punt_yards, field_goals_made_1_19, field_goals_made_20_29, field_goals_made_30_39,
                        field_goals_made_40_49, field_goals_made_50, field_goals_attempts_1_19, field_goals_attempts_20_29,
                        field_goals_attempts_30_39, field_goals_attempts_40_49, field_goals_attempts_50
                    ) VALUES (
                        ${player_id}, ${season}, ${postseason}, ${games_played}, ${passing_completions}, ${passing_attempts}, ${passing_yards},
                        ${yards_per_pass_attempt}, ${passing_touchdowns}, ${passing_interceptions}, ${passing_yards_per_game}, ${passing_completion_pct},
                        ${qbr}, ${rushing_attempts}, ${rushing_yards}, ${rushing_yards_per_game}, ${yards_per_rush_attempt}, ${rushing_touchdowns},
                        ${rushing_fumbles}, ${rushing_fumbles_lost}, ${rushing_first_downs}, ${receptions}, ${receiving_yards}, ${yards_per_reception},
                        ${receiving_touchdowns}, ${receiving_fumbles}, ${receiving_fumbles_lost}, ${receiving_first_downs}, ${receiving_targets},
                        ${receiving_yards_per_game}, ${fumbles_forced}, ${fumbles_recovered}, ${total_tackles}, ${defensive_sacks}, ${defensive_sack_yards},
                        ${solo_tackles}, ${assist_tackles}, ${fumbles_touchdowns}, ${defensive_interceptions}, ${interception_touchdowns},
                        ${kick_returns}, ${kick_return_yards}, ${yards_per_kick_return}, ${kick_return_touchdowns}, ${punt_returner_returns},
                        ${punt_returner_return_yards}, ${yards_per_punt_return}, ${punt_return_touchdowns}, ${field_goal_attempts}, ${field_goals_made},
                        ${field_goal_pct}, ${punts}, ${punt_yards}, ${field_goals_made_1_19}, ${field_goals_made_20_29}, ${field_goals_made_30_39},
                        ${field_goals_made_40_49}, ${field_goals_made_50}, ${field_goals_attempts_1_19}, ${field_goals_attempts_20_29},
                        ${field_goals_attempts_30_39}, ${field_goals_attempts_40_49}, ${field_goals_attempts_50}, NOW()
                    )
                    ON CONFLICT (player_id, season, postseason) DO UPDATE SET
                        player_id = EXCLUDED.player_id,
                        season = EXCLUDED.season,
                        postseason = EXCLUDED.postseason,
                        games_played = EXCLUDED.games_played,
                        passing_completions = EXCLUDED.passing_completions,
                        passing_attempts = EXCLUDED.passing_attempts,
                        passing_yards = EXCLUDED.passing_yards,
                        yards_per_pass_attempt = EXCLUDED.yards_per_pass_attempt,
                        passing_touchdowns = EXCLUDED.passing_touchdowns,
                        passing_interceptions = EXCLUDED.passing_interceptions,
                        passing_yards_per_game = EXCLUDED.passing_yards_per_game,
                        passing_completion_pct = EXCLUDED.passing_completion_pct,
                        qbr = EXCLUDED.qbr,
                        rushing_attempts = EXCLUDED.rushing_attempts,
                        rushing_yards = EXCLUDED.rushing_yards,
                        rushing_yards_per_game = EXCLUDED.rushing_yards_per_game,
                        yards_per_rush_attempt = EXCLUDED.yards_per_rush_attempt,
                        rushing_touchdowns = EXCLUDED.rushing_touchdowns,
                        rushing_fumbles = EXCLUDED.rushing_fumbles,
                        rushing_fumbles_lost = EXCLUDED.rushing_fumbles_lost,
                        rushing_first_downs = EXCLUDED.rushing_first_downs,
                        receptions = EXCLUDED.receptions,
                        receiving_yards = EXCLUDED.receiving_yards,
                        yards_per_reception = EXCLUDED.yards_per_reception,
                        receiving_touchdowns = EXCLUDED.receiving_touchdowns,
                        receiving_fumbles = EXCLUDED.receiving_fumbles,
                        receiving_fumbles_lost = EXCLUDED.receiving_fumbles_lost,
                        receiving_first_downs = EXCLUDED.receiving_first_downs,
                        receiving_targets = EXCLUDED.receiving_targets,
                        receiving_yards_per_game = EXCLUDED.receiving_yards_per_game,
                        fumbles_forced = EXCLUDED.fumbles_forced,
                        fumbles_recovered = EXCLUDED.fumbles_recovered,
                        total_tackles = EXCLUDED.total_tackles,
                        defensive_sacks = EXCLUDED.defensive_sacks,
                        defensive_sack_yards = EXCLUDED.defensive_sack_yards,
                        solo_tackles = EXCLUDED.solo_tackles,
                        assist_tackles = EXCLUDED.assist_tackles,
                        fumbles_touchdowns = EXCLUDED.fumbles_touchdowns,
                        defensive_interceptions = EXCLUDED.defensive_interceptions,
                        interception_touchdowns = EXCLUDED.interception_touchdowns,
                        kick_returns = EXCLUDED.kick_returns,
                        kick_return_yards = EXCLUDED.kick_return_yards,
                        yards_per_kick_return = EXCLUDED.yards_per_kick_return,
                        kick_return_touchdowns = EXCLUDED.kick_return_touchdowns,
                        punt_returner_returns = EXCLUDED.punt_returner_returns,
                        punt_returner_return_yards = EXCLUDED.punt_returner_return_yards,
                        yards_per_punt_return = EXCLUDED.yards_per_punt_return,
                        punt_return_touchdowns = EXCLUDED.punt_return_touchdowns,
                        field_goal_attempts = EXCLUDED.field_goal_attempts,
                        field_goals_made = EXCLUDED.field_goals_made,
                        field_goal_pct = EXCLUDED.field_goal_pct,
                        punts = EXCLUDED.punts,
                        punt_yards = EXCLUDED.punt_yards,
                        field_goals_made_1_19 = EXCLUDED.field_goals_made_1_19,
                        field_goals_made_20_29 = EXCLUDED.field_goals_made_20_29,
                        field_goals_made_30_39 = EXCLUDED.field_goals_made_30_39,
                        field_goals_made_40_49 = EXCLUDED.field_goals_made_40_49,
                        field_goals_made_50 = EXCLUDED.field_goals_made_50,
                        field_goals_attempts_1_19 = EXCLUDED.field_goals_attempts_1_19,
                        field_goals_attempts_20_29 = EXCLUDED.field_goals_attempts_20_29,
                        field_goals_attempts_30_39 = EXCLUDED.field_goals_attempts_30_39,
                        field_goals_attempts_40_49 = EXCLUDED.field_goals_attempts_40_49,
                        field_goals_attempts_50 = EXCLUDED.field_goals_attempts_50,
                        
                `;

                console.log(`✅ Season stat for player ${player_id} saved/updated`);

            } catch (dbError) {
                if (dbError.code === '23503') {

                    console.error(`❌ Foreign key violation - player ${player_id} doesn't exist`);
                } else if (dbError.code === '23505') {
                    console.error(`❌ Duplicate entry for player ${player_id}`);
                } else {
                    console.error(`❌ Database error for player ${player_id}:`, dbError);
                }
                    throw dbError;
            }
        }

        allSeasonStats = allSeasonStats.concat(seasonStats);
        currentCursor = meta?.next_cursor; 

        } while (currentCursor); 

        res.status(200).json({ message: 'All season stats saved successfully', totalStats: allSeasonStats.length });

    } catch (error) {
        console.error('❌ Error fetching or saving season stats:', error);
        res.status(500).json({ error: 'Failed to fetch or save season stats' });
    }
};

const searchSeasonStats = async (req, res) => {
    try {
        const { first_name, last_name } = req.query;

        if (!first_name || !last_name ) {
            return res.status(400).json({ error: "Please provide first_name, last_name"})
        }

        const player = await sql`
        SELECT id FROM player_profile
        WHERE LOWER(first_name) = LOWER(${first_name})
        AND LOWER (last_name) = LOWER(${last_name})
        LIMIT 1;
        `

        if (player.length === 0) {
            return res.status(404).json({ error: "Player not found"});
        }

        const player_id = player[0].id;
        const stats = await sql`
        SELECT * FROM season_stats
        WHERE player_id = ${player_id}
        AND season = 2024;
        `

        if (stats.length === 0) {
            return res.status(404).json({ error: "No season stats for this player and season"});
        }

        res.json(stats[0]);
        
    }catch(error) {
        console.error('Error searching season stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getPositionAverages = async (req, res) => {
    try {
        const { season = 2024, postseason = false, position } = req.query;

        let averages;

        if (position) {
            averages = await sql`
                SELECT 
                    p.position_abbreviation AS position,
                    AVG(ss.passing_yards::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_passing_yards,
                    AVG(ss.passing_touchdowns::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_passing_touchdowns,
                    AVG(ss.passing_interceptions::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_passing_interceptions,
                    AVG(ss.rushing_yards::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_rushing_yards,
                    AVG(ss.rushing_touchdowns::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_rushing_touchdowns,
                    AVG(ss.receptions::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_receptions,
                    AVG(ss.receiving_yards::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_receiving_yards,
                    AVG(ss.receiving_touchdowns::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_receiving_touchdowns,
                    AVG(ss.total_tackles::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_total_tackles,
                    AVG(ss.defensive_sacks::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_defensive_sacks,
                    AVG(ss.defensive_interceptions::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_defensive_interceptions
                FROM season_stats ss
                JOIN player_profile p ON ss.player_id = p.id
                WHERE ss.season = ${season}
                AND ss.postseason = ${postseason}
                AND p.position_abbreviation = ${position.toUpperCase()}
                AND ss.games_played >= 10  -- Filter for likely starters
                GROUP BY p.position_abbreviation
                HAVING COUNT(*) > 0;
            `;
        } else {
            averages = await sql`
                SELECT 
                    p.position_abbreviation AS position,
                    AVG(ss.passing_yards::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_passing_yards,
                    AVG(ss.passing_touchdowns::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_passing_touchdowns,
                    AVG(ss.passing_interceptions::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_passing_interceptions,
                    AVG(ss.rushing_yards::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_rushing_yards,
                    AVG(ss.rushing_touchdowns::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_rushing_touchdowns,
                    AVG(ss.receptions::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_receptions,
                    AVG(ss.receiving_yards::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_receiving_yards,
                    AVG(ss.receiving_touchdowns::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_receiving_touchdowns,
                    AVG(ss.total_tackles::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_total_tackles,
                    AVG(ss.defensive_sacks::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_defensive_sacks,
                    AVG(ss.defensive_interceptions::numeric / NULLIF(ss.games_played, 0)) * 17 AS avg_defensive_interceptions
                FROM season_stats ss
                JOIN player_profile p ON ss.player_id = p.id
                WHERE ss.season = ${season}
                AND ss.postseason = ${postseason}
                AND ss.games_played >= 10  -- Filter for likely starters
                GROUP BY p.position_abbreviation
                HAVING COUNT(*) > 0;
            `;
        }

        if (averages.length === 0) {
            return res.status(404).json({ message: "No stats found for the specified criteria" });
        }

        const formattedAverages = averages.reduce((acc, row) => {
            acc[row.position] = {
                avg_passing_yards: Number(Number(row.avg_passing_yards).toFixed(2)),
                avg_passing_touchdowns: Number(Number(row.avg_passing_touchdowns).toFixed(2)),
                avg_passing_interceptions: Number(Number(row.avg_passing_interceptions).toFixed(2)),
                avg_rushing_yards: Number(Number(row.avg_rushing_yards).toFixed(2)),
                avg_rushing_touchdowns: Number(Number(row.avg_rushing_touchdowns).toFixed(2)),
                avg_receptions: Number(Number(row.avg_receptions).toFixed(2)),
                avg_receiving_yards: Number(Number(row.avg_receiving_yards).toFixed(2)),
                avg_receiving_touchdowns: Number(Number(row.avg_receiving_touchdowns).toFixed(2)),
                avg_total_tackles: Number(Number(row.avg_total_tackles).toFixed(2)),
                avg_defensive_sacks: Number(Number(row.avg_defensive_sacks).toFixed(2)),
                avg_defensive_interceptions: Number(Number(row.avg_defensive_interceptions).toFixed(2))
            };
            return acc;
        }, {});

        res.status(200).json(formattedAverages);

    } catch (error) {
        console.error('❌ Error fetching position averages:', error);
        res.status(500).json({ error: 'Failed to fetch position averages' });
    }
};

const getTopTenPlayers = async (req, res) => {
    try {
        const { season, position } = req.query;

        const targetSeason = season || 2024;
        const targetPosition = position ? position.toUpperCase() : null;

        if (!targetPosition) {
            return res.status(400).json({ error: 'Position is required (e.g., QB, RB, WR)' });
        }

        const validPositions = ['QB', 'RB', 'WR', 'TE', 'FB', 'DE', 'DL', 'CB', 'S', 'K', 'KR', 'P'];
        if (!validPositions.includes(targetPosition)) {
            return res.status(400).json({ error: `Invalid position. Use one of: ${validPositions.join(', ')}` });
        }

        const positionStatMap = {
            'QB': 'passing_yards',
            'RB': 'rushing_yards',
            'WR': 'receiving_yards',
            'TE': 'receiving_yards',
            'FB': 'rushing_yards',
            'DE': 'defensive_sacks',
            'DL': 'defensive_sacks',
            'CB': 'defensive_interceptions',
            'S': 'defensive_interceptions',
            'K': 'field_goals_made',
            'KR': 'kick_return_yards',
            'P': 'punt_yards'
        };

        const targetStat = positionStatMap[targetPosition];

        const query = `
            SELECT
                pp.first_name,
                pp.last_name,
                ss.${targetStat} AS stat_value,
                pp.position_abbreviation AS position
            FROM season_stats ss
            JOIN player_profile pp ON ss.player_id = pp.id
            WHERE ss.season = $1
            AND pp.position_abbreviation = $2
            AND ss.${targetStat} IS NOT NULL
            ORDER BY ss.${targetStat} DESC
            LIMIT 10
        `;
        console.log('Executing query:', query, 'with params:', [targetSeason, targetPosition]);
        const topTenPlayers = await sql(query, [targetSeason, targetPosition]);
        console.log('Query result:', topTenPlayers);

        if (topTenPlayers.length === 0) {
            return res.status(404).json({ error: `No stats found for season ${targetSeason} and position ${targetPosition}` });
        }

        const result = topTenPlayers.map(player => ({
            name: `${player.first_name} ${player.last_name}`,
            [targetStat]: player.stat_value,
            position: player.position,
            statName: targetStat
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching top ten players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllSeasonStats,
    searchSeasonStats,
    getPositionAverages,
    getTopTenPlayers,
}






