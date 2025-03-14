import { useEffect, useState } from "react"; 
import { Navigate, Route, Routes } from "react-router-dom"; 
import Sidebar from "./components/common/Sidebar";
import Login from "./components/Login";
import { PlayerContextProvider } from "./context/PlayerContext";
import AnalyticsPage from "./pages/AnalyticsPage";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("App checking token:", token);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <PlayerContextProvider>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
        {isAuthenticated && <Sidebar />} 
        <div className="flex-1 overflow-auto relative z-10">
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/"
              element={isAuthenticated ? <OverviewPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/login" />} /> {/* Catch-all redirect */}
          </Routes>
        </div>
      </div>
    </PlayerContextProvider>
  );
}

export default App;