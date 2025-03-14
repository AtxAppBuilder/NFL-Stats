import { motion } from "framer-motion";

const PlayerStats = ({ seasonStats, position }) => {
  console.log("PlayerStats received:", { seasonStats, position }); 

  const statGroups = {
    QB: [
      { label: "Passing Yards", key: "passing_yards" },
      { label: "Passing YPG", key: "passing_yards_per_game" },
      { label: "Completion %", key: "passing_completion_pct" },
      { label: "Passing TDs", key: "passing_touchdowns" },
      { label: "QBR", key: "qbr" },
      { label: "Rushing Yards", key: "rushing_yards" },
      { label: "Rushing TDs", key: "rushing_touchdowns" },
      { label: "Rushing YPG", key: "rushing_yards_per_game" },
    ],
    RB: [
      { label: "Rushing Yards", key: "rushing_yards" },
      { label: "Rushing YPG", key: "rushing_yards_per_game" },
      { label: "Rushing TDs", key: "rushing_touchdowns" },
      { label: "Yards/Rush", key: "yards_per_rush_attempt" },
      { label: "Receptions", key: "receptions" },
      { label: "Receiving Yards", key: "receiving_yards" },
      { label: "Receiving TDs", key: "receiving_touchdowns" },
    ],
    WR: [
      { label: "Receptions", key: "receptions" },
      { label: "Receiving Yards", key: "receiving_yards" },
      { label: "Receiving YPG", key: "receiving_yards_per_game" },
      { label: "Yards/Reception", key: "yards_per_reception" },
      { label: "Receiving TDs", key: "receiving_touchdowns" },
      { label: "Rushing Yards", key: "rushing_yards" },
    ],
    TE: [
      { label: "Receptions", key: "receptions" },
      { label: "Receiving Yards", key: "receiving_yards" },
      { label: "Receiving YPG", key: "receiving_yards_per_game" },
      { label: "Yards/Reception", key: "yards_per_reception" },
      { label: "Receiving TDs", key: "receiving_touchdowns" },
    ],
    DL: [
      { label: "Total Tackles", key: "total_tackles" },
      { label: "Sacks", key: "defensive_sacks" },
      { label: "Sack Yards", key: "defensive_sack_yards" },
      { label: "Fumbles Forced", key: "fumbles_forced" },
      { label: "Fumbles Recovered", key: "fumbles_recovered" },
    ],
    LB: [
      { label: "Total Tackles", key: "total_tackles" },
      { label: "Sacks", key: "defensive_sacks" },
      { label: "Interceptions", key: "defensive_interceptions" },
      { label: "Fumbles Forced", key: "fumbles_forced" },
      { label: "Tackles (Solo)", key: "solo_tackles" },
    ],
    CB: [
      { label: "Total Tackles", key: "total_tackles" },
      { label: "Interceptions", key: "defensive_interceptions" },
      { label: "Int. TDs", key: "interception_touchdowns" },
      { label: "Passes Defended", key: "passes_defended" }, 
      { label: "Tackles (Solo)", key: "solo_tackles" },
    ],

    DEFAULT: [
      { label: "Games Played", key: "games_played" }, 
    ],
  };

  const positionMap = {
    "Quarterback": "QB",
    "Running Back": "RB",
    "Wide Receiver": "WR",
    "Tight End": "TE",
    "Defensive Line": "DL",
    "Linebacker": "LB",
    "Cornerback": "CB",
    QB: "QB",
    RB: "RB",
    WR: "WR",
    TE: "TE",
    DL: "DL",
    LB: "LB",
    CB: "CB",
  };

  const normalizedPosition = positionMap[position] || "DEFAULT";
  const statsToShow = statGroups[normalizedPosition] || statGroups.DEFAULT;

  console.log("Normalized position:", normalizedPosition);
  console.log("Stats to show:", statsToShow);
  
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-2 text-gray-100">Player Stats (2024 Season)</h2>
      <div className="h-64 overflow-auto">
        {seasonStats ? (
          <div className="grid grid-cols-2 gap-4 text-white">
            {/* Column 1 */}
            <div className="space-y-4">
              {statsToShow.slice(0, Math.ceil(statsToShow.length / 2)).map((stat) => (
                <div key={stat.key}>
                  <h3 className="text-md font-semibold">{stat.label}</h3>
                  <p className="text-gray-300">{seasonStats[stat.key] ?? "N/A"}</p>
                </div>
              ))}
            </div>
            {/* Column 2 */}
            <div className="space-y-4">
              {statsToShow.slice(Math.ceil(statsToShow.length / 2)).map((stat) => (
                <div key={stat.key}>
                  <h3 className="text-md font-semibold">{stat.label}</h3>
                  <p className="text-gray-300">{seasonStats[stat.key] ?? "N/A"}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-300">
            No stats available. Search for a player to display their season stats.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerStats;