const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

// Middleware
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);

// Protected test route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "Protected route accessed successfully!",
        user: req.user
    });
});

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "FinTrack Backend is running successfully!"
    });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log("FinTrack Backend Started");
    console.log(`Running at http://localhost:${PORT}`);
    console.log("=================================");
});