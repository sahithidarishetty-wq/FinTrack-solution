const db = require("../config/db");

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get total income
        const [incomeResult] = await db.execute(
            `SELECT COALESCE(SUM(amount), 0) AS totalIncome
             FROM income
             WHERE user_id = ?`,
            [userId]
        );

        // Get total expenses
        const [expenseResult] = await db.execute(
            `SELECT COALESCE(SUM(amount), 0) AS totalExpenses
             FROM expenses
             WHERE user_id = ?`,
            [userId]
        );

        const totalIncome = Number(incomeResult[0].totalIncome);
        const totalExpenses = Number(expenseResult[0].totalExpenses);

        const balance = totalIncome - totalExpenses;

        res.json({
            totalIncome,
            totalExpenses,
            balance
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboard
};