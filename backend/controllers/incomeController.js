const db = require("../config/db");

// ===============================
// ADD INCOME
// ===============================
const addIncome = async (req, res) => {
    try {
        const { source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({
                message: "Source, amount and date are required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO income (user_id, source, amount, date)
             VALUES (?, ?, ?, ?)`,
            [req.user.userId, source, amount, date]
        );

        res.status(201).json({
            message: "Income added successfully",
            incomeId: result.insertId
        });

    } catch (error) {
        console.error("Add income error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET USER INCOME
// ===============================
const getIncome = async (req, res) => {
    try {
        const [income] = await db.execute(
            `SELECT id, source, amount, date, created_at
             FROM income
             WHERE user_id = ?
             ORDER BY date DESC`,
            [req.user.userId]
        );

        res.json({
            income: income
        });

    } catch (error) {
        console.error("Get income error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addIncome,
    getIncome
};