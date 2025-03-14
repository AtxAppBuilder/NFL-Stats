import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TopTenSalaries = () => {
  const [salariesData, setSalariesData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("QB");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSalaries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/salary/top-ten-salaries-position?position=${selectedPosition}`
        );
        const data = response.data;
        console.log("Raw API response:", data);

        if (!Array.isArray(data) || data.length === 0) {
          console.log("Warning: API returned no data or invalid format");
        }

        const transformedData = data.map((player, index) => {
          const salary = Number(player.apy || player.salary || 0); // Fallback for apy/salary
          console.log(`Player ${index}:`, { name: player.name, salary });
          return {
            name: player.name,
            salary,
            fill: colors[index % colors.length]
          };
        });
        console.log("Transformed salariesData:", transformedData);
        setSalariesData(transformedData);
      } catch (error) {
        console.error("Error fetching top salaries:", error);
        console.log("Axios error details:", error.response?.data || error.message);
        setSalariesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSalaries();
  }, [selectedPosition]);

  const positionOptions = [
    "QB", "RB", "WR", "TE", "FB", "DE", "DL", "CB", "S", "K", "KR", "P"
  ];

  const colors = [
    "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#EC4899", "#14B8A6", "#D97706", "#6B7280", "#22D3EE"
  ];

  console.log("Rendering with:", { loading, salariesData });

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Top 10 {selectedPosition} Salaries
        </h2>
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        ) : salariesData.length === 0 ? (
          <p className="text-gray-400">No salary data available for {selectedPosition}</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={salariesData}>
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
                formatter={(value) => [`$${value.toLocaleString()}`, "Salary"]}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="salary"
                fillOpacity={0.6}
                name="Salary"
                fill={(entry) => entry.fill || colors[salariesData.indexOf(entry) % colors.length]}
                activeBar={{ fillOpacity: 0.8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default TopTenSalaries;