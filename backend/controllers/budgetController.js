const db = require("../config/db");

const addBudget = async (req, res) => {
    try {
        const { category, amount, month } = req.body;

        if (!category || !amount || !month) {
            return res.status(400).json({
                message: "Category, amount and month are required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO budgets (user_id, category, amount, month)
             VALUES (?, ?, ?, ?)`,
            [req.user.userId, category, amount, month]
        );

        res.status(201).json({
            message: "Budget added successfully",
            budgetId: result.insertId
        });

    } catch (error) {
        console.error("Add budget error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getBudgets = async (req, res) => {
    try {
        const [budgets] = await db.execute(
            `SELECT id, category, amount, month, created_at
             FROM budgets
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.user.userId]
        );

        res.json({
            budgets: budgets
        });

    } catch (error) {
        console.error("Get budgets error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    addBudget,
    getBudgets
};