const express = require("express");
const {
    addIncome,
    getIncome
} = require("../controllers/incomeController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Add income
router.post("/", authenticateToken, addIncome);

// Get logged-in user's income
router.get("/", authenticateToken, getIncome);

module.exports = router;