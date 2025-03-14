const { sql } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = "SELECT id, password FROM users WHERE email = $1";
    const result = await sql(query, [email]);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await sql("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const maxIdResult = await sql("SELECT MAX(id) FROM users");
    const newId = (maxIdResult[0].max ? maxIdResult[0].max + 1 : 1);

    const query = `
      INSERT INTO users (id, username, email, password, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, username, email
    `;
    const result = await sql(query, [newId, name, email, hashedPassword]);

    const newUser = result[0];
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    if (error.code === "23505") {
      res.status(400).json({ error: "Email already in use" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = { 
  login,
  register 
};