import axios from "axios";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your profile.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://nfl-stats-1.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar || "https://randomuser.me/api/portraits/men/3.jpg",
        });
      } catch (err) {
        console.error("Fetch profile error:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://nfl-stats-1.onrender.com/api/user/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Avatar response:", response.data);
      const newAvatarUrl = response.data.avatar;
    if (!newAvatarUrl) {
      throw new Error("No avatar URL returned from server");
    }
      setUserData((prev) => ({ ...prev, avatar: response.data.avatar || response.data.avatarUrl }));
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError("Failed to update avatar.");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        "http://nfl-stats-1.onrender.com/api/user/profile",
        { name: userData.name, email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <SettingSection icon={User} title="Profile"><p>Loading...</p></SettingSection>;
  if (error) return <SettingSection icon={User} title="Profile"><p className="text-red-400">{error}</p></SettingSection>;

  return (
    <SettingSection icon={User} title="Profile">
      <div className="flex flex-col sm:flex-row items-center mb-6">
        {isEditing ? (
          <>
            <div className="relative mb-4 sm:mb-0 sm:mr-4">
              <img
                src={userData.avatar}
                alt="Profile"
                className="rounded-full w-20 h-20 object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Change avatar"
              />
              <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                Upload
              </span>
            </div>
            <div>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="text-lg font-semibold text-gray-100 bg-gray-700 border border-gray-600 rounded px-2 py-1 mb-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="text-gray-400 bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full"
              />
            </div>
          </>
        ) : (
          <>
            <img
              src={userData.avatar}
              alt="Profile"
              className="rounded-full w-20 h-20 object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-100">{userData.name}</h3>
              <p className="text-gray-400">{userData.email}</p>
            </div>
          </>
        )}
      </div>

      {isEditing ? (
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
        >
          Edit Profile
        </button>
      )}
    </SettingSection>
  );
};

export default Profile;