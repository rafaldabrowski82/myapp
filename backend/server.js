const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "db",
  user: "user",
  password: "password",
  database: "app"
});

function connectDB() {
  db.connect((err) => {
    if (err) {
      console.error("Database connection error, retrying in 3s:", err.message);
      setTimeout(connectDB, 3000);
    } else {
      console.log("✅ Connected to database");
      startServer();
    }
  });
}

function startServer() {
  app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });

  app.post("/users", (req, res) => {
    const { name } = req.body;
    db.query("INSERT INTO users (name) VALUES (?)", [name], err => {
      if (err) return res.status(500).send(err);
      res.send("OK");
    });
  });

  app.listen(3001, () => {
    console.log("✅ Backend running on port 3001");
  });
}

connectDB();
