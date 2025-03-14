import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TopTenPlayers = () => {
  const [playersData, setPlayersData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("QB");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/season_stats/top-ten-players?position=${selectedPosition}`
        );
        const data = response.data;
        console.log("Raw API data:", data); // Debug raw data

        const transformedData = data.map((player, index) => ({
          name: player.name,
          stat: player[Object.keys(player).find(key => key !== "name" && key !== "position")],
          fill: colors[index % colors.length] // Pre-assign color to data
        }));
        console.log("Transformed data:", transformedData); // Debug transformed data
        setPlayersData(transformedData);
      } catch (error) {
        console.error("Error fetching top players:", error);
        setPlayersData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, [selectedPosition]);

  const positionOptions = [
    "QB", "RB", "WR", "TE", "FB", "DE", "DL", "CB", "S", "K", "KR", "P"
  ];

  const colors = [
    "#8B5CF6", 
    "#3B82F6", 
    "#10B981", 
    "#F59E0B", 
    "#EF4444", 
    "#EC4899", 
    "#14B8A6", 
    "#D97706", 
    "#6B7280", 
    "#22D3EE", 
  ];

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Top 10 Players by Position</h2>
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          {positionOptions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : playersData.length === 0 ? (
          <p className="text-gray-400">No data available for {selectedPosition}</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={playersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                itemStyle={{ color: "#E5E7EB" }}
                formatter={(value) => [value, `${selectedPosition} Stat`]}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="stat"
                fillOpacity={0.6}
                name={`${selectedPosition} Stat`}
                fill={(entry) => entry.fill || colors[playersData.indexOf(entry) % colors.length]}
                activeBar={{ fillOpacity: 0.8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default TopTenPlayers;