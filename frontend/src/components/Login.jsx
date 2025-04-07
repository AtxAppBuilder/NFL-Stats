import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegistering
        ? "https://nfl-stats-1.onrender.com/api/auth/register"
        : "https://nfl-stats-1.onrender.com/api/auth/login";
      const response = await axios.post(url, {
        ...credentials,
        name: credentials.name || credentials.email.split("@")[0],
      });
      if (isRegistering) {
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
        setCredentials({ email: credentials.email, password: "" });
      } else {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true); // Update App's state
        navigate("/"); // Go to OverviewPage
      }
    } catch (err) {
      console.error("Error:", err);
      setError(isRegistering ? "Registration failed" : "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">
          {isRegistering ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              name="name"
              value={credentials.name || ""}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full p-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
            />
          )}
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition duration-200"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
          <p className="text-gray-400 text-center">
            {isRegistering ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsRegistering(!isRegistering);
              }}
              className="text-indigo-400 hover:underline"
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;