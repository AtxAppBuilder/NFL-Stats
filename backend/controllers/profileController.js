const { sql } = require('../config/db');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `SELECT username, email FROM users WHERE id = $1`;
        const result = await sql(query, [userId])

        if (result.length === 0) {
            return res.status(404).json({ error: "Profile not found"});
        }

        const user = result[0];
        res.json({
            name: user.username,
            email: user.email,
            avatar: user.avatar || "https://randomuser.me/api/portraits/men/3.jpg",
        });
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        const query = `
        UPDATE users
        SET username = $1, email = $2
        WHERE id = $3
        RETURNING username, email
        `;

        const result = await sql(query, [name, email, userId]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const updatedUser = result[0];
        res.json({
            name: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar || "https://randomuser.me/api/portraits/men/3.jpg",
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        if (error.code === "23505") {
            res.status(400).json({ error: "Email already in use"})
        } else {
            res.status(500).json({ error: "Internal server error"});
        }
    }
};

const deleteProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const query = "DELETE FROM users WHERE id = $1";
      const result = await sql(query, [userId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Profile not found" });
      }
  
      res.status(204).send(); // No content on successful deletion
    } catch (error) {
      console.error("Error in deleteProfile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // const createProfile = async (req, res) => {
  //   try {
  //     const { name, email, password } = req.body;
  //     const userId = req.user.id;
  
  //     // Check if user already exists
  //     const existingUser = await sql("SELECT id FROM users WHERE id = $1", [userId]);
  //     if (existingUser.length > 0) {
  //       return res.status(400).json({ error: "User already exists" });
  //     }

  //       // Hash the password
  //     const saltRounds = 10;
  //     const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  //     const query = `
  //       INSERT INTO users (id, username, email, password, created_at)
  //       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
  //       RETURNING username, email
  //     `;
  //     const result = await sql(query, [userId, name, email, hashedPassword]);
  
  //     const newUser = result[0];
  //     res.status(201).json({
  //       name: newUser.username,
  //       email: newUser.email,
  //       avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  //     });
  //   } catch (error) {
  //     console.error("Error in createProfile:", error);
  //     if (error.code === "23505") { // Unique violation (e.g., email already exists)
  //       res.status(400).json({ error: "Email already in use" });
  //     } else {
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }
  // };


  const uploadAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const userId = req.user.id;
      const avatarPath = `/uploads/avatar/${req.file.filename}`; 
      await sql("UPDATE users SET avatar = $1 WHERE id = $2", [avatarPath, userId]);
      const baseUrl = `${req.protocol}://${req.get("host")}`; 
      const fullAvatarUrl = `${baseUrl}${avatarPath}`; 
      console.log("Base URL:", baseUrl);
      console.log("Avatar Path:", avatarPath);
      console.log("Full Avatar URL:", fullAvatarUrl); 
      res.json({ avatar: fullAvatarUrl });
    } catch (error) {
      console.error("Error in uploadAvatar:", error);
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  };
  
module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
    uploadAvatar
}