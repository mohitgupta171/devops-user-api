require("dotenv").config();

const express = require("express");
const pool = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health/live", (req, res) => {
  res.status(200).json({ status: "alive" });
});

app.get("/health/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    return res.status(200).json({
      status: "ready",
      database: "connected",
    });
  } catch (error) {
    console.error("Readiness check failed:", error.message);

    return res.status(503).json({
      status: "not ready",
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users ORDER BY id"
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to retrieve users:", error.message);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to retrieve user:", error.message);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Failed to delete user:", error.message);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});


app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
      [name, email]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    console.error("Failed to create user:", error.message);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on port ${port}`);
});

