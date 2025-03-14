import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [playerData, setPlayerData] = useState(null);
  const [seasonStats, setSeasonStats] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  
  

  const updatePlayer = (data) => {
    setPlayerData(data.playerData || null);
    setSeasonStats(data.seasonStats || null);
    setSalaryData(data.salaryData || null);
    
  };

  return (
    <PlayerContext.Provider value={{ playerData, seasonStats, updatePlayer, salaryData }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);







// const [positionAverages, setPositionAverages] = useState(null);
// setPositionAverages(data.positionAverages);