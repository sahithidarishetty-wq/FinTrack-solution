const express = require("express");

const {
    addExpense,
    getExpenses
} = require("../controllers/expenseController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Add expense
router.post("/", authenticateToken, addExpense);

// Get logged-in user's expenses
router.get("/", authenticateToken, getExpenses);

module.exports = router;