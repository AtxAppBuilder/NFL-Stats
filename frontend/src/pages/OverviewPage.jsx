import { motion } from "framer-motion";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";


import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import PlayerProfile from "../components/overview/PlayerProfile";
import PlayerSalary from "../components/overview/PlayerSalary";
import PlayerStats from "../components/overview/PlayerStats";

const OverviewPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { playerData, seasonStats, updatePlayer, salaryData } = usePlayer();
  
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(null);
    

    try {
      const nameParts = searchQuery.trim().split(" ");
      if (nameParts.length < 2) {
        throw new Error("Please enter a full name (first and last)");
      }
      const [firstName, ...lastNameParts] = nameParts;
      const lastName = lastNameParts.join(" ");

      const playerResponse = await fetch(
        `http://localhost:5000/api/players?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`
      );
      if (!playerResponse.ok) throw new Error("Player fetch failed");
      const playerProfile = await playerResponse.json();
      if (!playerProfile.length) throw new Error("Player not found");
      const fetchedPlayerData = playerProfile[0];


      const statsResponse = await fetch(
        `http://localhost:5000/api/season_stats/search?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`
      );
      if (!statsResponse.ok) throw new Error("Stats fetch failed");
      const fetchedSeasonStats = await statsResponse.json();


      // Fetch salary data
      const salaryResponse = await fetch(
        `http://localhost:5000/api/salary?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`
      );
      if (!salaryResponse.ok) throw new Error("Salary fetch failed");
      const salaryArray = await salaryResponse.json();
      if (!salaryArray.length) throw new Error("No salary data found");
      const fetchedSalaryData = salaryArray[0];

      updatePlayer({
        playerData: fetchedPlayerData,
        seasonStats: fetchedSeasonStats,
        salaryData: fetchedSalaryData,
      });

      console.log("Updated context with salaryData:", fetchedSalaryData);

    } catch (err) {
      setError(err.message || "An error occurred while fetching data");
      console.error("Error in handleSearch:", err);
      updatePlayer({ playerData: null, seasonStats: null, salaryData: null });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter player's full name (e.g., Lamar Jackson)"
              className="p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 w-full"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:bg-gray-500"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Player Name"
            icon={Zap}
            value={playerData ? `${playerData.first_name} ${playerData.last_name}` : "N/A"}
            color="#6366F1"
          />
          <StatCard
            name="Team"
            icon={Users}
            value={playerData ? playerData.team_full_name || "N/A" : "N/A"}
            color="#8B5CF6"
          />
          <StatCard
            name="Position"
            icon={ShoppingBag}
            value={playerData ? playerData.position_abbreviation || "N/A" : "N/A"}
            color="#EC4899"
          />
          <StatCard
            name="Experience"
            icon={BarChart2}
            value={playerData ? playerData.experience || "N/A" : "N/A"}
            color="#10B981"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PlayerProfile playerData={playerData} /> 
          <PlayerStats seasonStats={seasonStats} position={playerData?.position || "N/A"} />
          <PlayerSalary salaryData={salaryData} />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;














// Fetch position averages
    //  const averagesResponse = await fetch(
    //   `http://localhost:5000/api/season_stats/averages?position=${encodeURIComponent(fetchedPlayerData.position)}`
    // );
    // if (!averagesResponse.ok) throw new Error("Averages fetch failed");
    // const positionAverages = await averagesResponse.json();  