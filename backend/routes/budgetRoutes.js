const express = require("express");

const {
    addBudget,
    getBudgets
} = require("../controllers/budgetController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, addBudget);
router.get("/", authenticateToken, getBudgets);

module.exports = router;