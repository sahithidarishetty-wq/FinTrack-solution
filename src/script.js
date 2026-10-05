// ==========================================
// FINTRACK - FRONTEND + BACKEND
// ==========================================

const API_BASE_URL = "http://192.168.0.56:5000";

// ==========================================
// FINANCIAL DATA
// ==========================================

let totalIncome = 0;
let totalExpenses = 0;

const budgets = {
    Food: 2000,
    Transport: 1500,
    Shopping: 3000,
    Bills: 2500,
    Other: 2000
};

const categoryExpenses = {
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0
};

const expenseHistory = [];

// ==========================================
// GET AUTH TOKEN
// ==========================================

function getToken() {
    return localStorage.getItem("fintrackToken");
}

// ==========================================
// SHOW LOGIN
// ==========================================

function showLogin() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.classList.remove("hidden");
    }

    if (signupForm) {
        signupForm.classList.add("hidden");
    }
}

// ==========================================
// SHOW SIGNUP
// ==========================================

function showSignup() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.classList.add("hidden");
    }

    if (signupForm) {
        signupForm.classList.remove("hidden");
    }
}

// ==========================================
// LOGIN
// ==========================================

async function demoLogin() {
    const emailElement =
        document.getElementById("loginEmail");

    const passwordElement =
        document.getElementById("loginPassword");

    const email = emailElement.value.trim();
    const password = passwordElement.value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Invalid username or password.");
            return;
        }

        // Save authentication details
        localStorage.setItem(
            "fintrackToken",
            data.token
        );

        localStorage.setItem(
            "fintrackUserId",
            data.userId
        );

        localStorage.setItem(
            "fintrackUserName",
            data.name
        );

        // Show application
        document
            .getElementById("authPage")
            .classList.add("hidden");

        document
            .getElementById("mainApp")
            .classList.remove("hidden");

        const welcomeText =
            document.getElementById("welcomeText");

        if (welcomeText) {
            welcomeText.textContent =
                `Welcome back, ${data.name}!`;
        }

        alert("Login successful!");

        // Load user's saved data from MySQL
        await loadFinancialData();

    } catch (error) {
        console.error("Login error:", error);

        alert(
            "Cannot connect to the FinTrack server.\n\n" +
            "Please make sure your friend's backend is running."
        );
    }
}

// ==========================================
// SIGN UP
// ==========================================

async function demoSignup() {
    const nameElement =
        document.getElementById("signupName");

    const emailElement =
        document.getElementById("signupEmail");

    const passwordElement =
        document.getElementById("signupPassword");

    const confirmPasswordElement =
        document.getElementById("confirmPassword");

    const name = nameElement.value.trim();
    const email = emailElement.value.trim();
    const password = passwordElement.value;
    const confirmPassword =
        confirmPasswordElement.value;

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed.");
            return;
        }

        alert(
            "Account created successfully!\n\n" +
            "Please login with your email and password."
        );

        nameElement.value = "";
        emailElement.value = "";
        passwordElement.value = "";
        confirmPasswordElement.value = "";

        showLogin();

    } catch (error) {
        console.error("Signup error:", error);

        alert(
            "Cannot connect to the FinTrack server."
        );
    }
}

// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

function togglePassword(inputId, button) {
    const input =
        document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁️";
    }
}

// ==========================================
// LOGOUT
// ==========================================

function logout() {
    localStorage.removeItem("fintrackToken");
    localStorage.removeItem("fintrackUserId");
    localStorage.removeItem("fintrackUserName");

    totalIncome = 0;
    totalExpenses = 0;

    Object.keys(categoryExpenses).forEach(
        function(category) {
            categoryExpenses[category] = 0;
        }
    );

    expenseHistory.length = 0;

    document
        .getElementById("mainApp")
        .classList.add("hidden");

    document
        .getElementById("authPage")
        .classList.remove("hidden");

    showLogin();
}

// ==========================================
// LOAD ALL FINANCIAL DATA FROM BACKEND
// ==========================================

async function loadFinancialData() {
    const token = getToken();

    if (!token) {
        return;
    }

    try {
        const headers = {
            "Authorization": `Bearer ${token}`
        };

        // Get income
        const incomeResponse = await fetch(
            `${API_BASE_URL}/api/income`,
            {
                method: "GET",
                headers: headers
            }
        );

        if (incomeResponse.ok) {
            const incomeData =
                await incomeResponse.json();

            totalIncome = 0;

            incomeData.income.forEach(
                function(item) {
                    totalIncome += Number(item.amount);
                }
            );
        }

        // Get expenses
        const expenseResponse = await fetch(
            `${API_BASE_URL}/api/expenses`,
            {
                method: "GET",
                headers: headers
            }
        );

        if (expenseResponse.ok) {
            const expenseData =
                await expenseResponse.json();

            totalExpenses = 0;

            Object.keys(categoryExpenses).forEach(
                function(category) {
                    categoryExpenses[category] = 0;
                }
            );

            expenseHistory.length = 0;

            expenseData.expenses.forEach(
                function(item) {

                    const amount = Number(item.amount);

                    totalExpenses += amount;

                    const category =
                        item.category || "Other";

                    if (
                        Object.prototype.hasOwnProperty.call(
                            categoryExpenses,
                            category
                        )
                    ) {
                        categoryExpenses[category] += amount;
                    } else {
                        categoryExpenses.Other += amount;
                    }

                    expenseHistory.push({
                        name: item.name,
                        category: category,
                        amount: amount,
                        date: item.date
                    });
                }
            );
        }

        updateDashboard();
        updateBudget();
        updateExpenseChart();
        updateRecentExpenses();
        updateFinancialWarnings();

    } catch (error) {
        console.error(
            "Error loading financial data:",
            error
        );
    }
}

// ==========================================
// ADD INCOME - BACKEND
// ==========================================

async function addIncome() {
    const incomeInput =
        document.getElementById("incomeAmount");

    if (!incomeInput) {
        return;
    }

    const amount = Number(incomeInput.value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    const token = getToken();

    if (!token) {
        alert("Please login first.");
        return;
    }

    // Today's date
    const today =
        new Date().toISOString().split("T")[0];

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/income`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    source: "Income",
                    amount: amount,
                    date: today
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(
                data.message ||
                "Failed to add income."
            );
            return;
        }

        incomeInput.value = "";

        // Reload data from MySQL
        await loadFinancialData();

        alert(
            `₹${amount.toLocaleString("en-IN")} income added successfully.`
        );

    } catch (error) {
        console.error(
            "Add income error:",
            error
        );

        alert(
            "Could not connect to the backend."
        );
    }
}

// ==========================================
// ADD EXPENSE - BACKEND
// ==========================================

async function addExpense() {
    const expenseInput =
        document.getElementById("expenseAmount");

    const categoryInput =
        document.getElementById("expenseCategory");

    if (!expenseInput || !categoryInput) {
        return;
    }

    const amount =
        Number(expenseInput.value);

    const category =
        categoryInput.value;

    if (!amount || amount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    if (!category) {
        alert("Please select an expense category.");
        return;
    }

    const token = getToken();

    if (!token) {
        alert("Please login first.");
        return;
    }

    const today =
        new Date().toISOString().split("T")[0];

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/expenses`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: category,
                    amount: amount,
                    category: category,
                    date: today
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(
                data.message ||
                "Failed to add expense."
            );
            return;
        }

        expenseInput.value = "";

        await loadFinancialData();

        alert(
            `₹${amount.toLocaleString("en-IN")} expense added successfully.`
        );

    } catch (error) {
        console.error(
            "Add expense error:",
            error
        );

        alert(
            "Could not connect to the backend."
        );
    }
}

// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {
    const incomeElement =
        document.getElementById("totalIncome");

    const expensesElement =
        document.getElementById("totalExpenses");

    const balanceElement =
        document.getElementById("balance");

    if (incomeElement) {
        incomeElement.textContent =
            `₹${totalIncome.toLocaleString("en-IN")}`;
    }

    if (expensesElement) {
        expensesElement.textContent =
            `₹${totalExpenses.toLocaleString("en-IN")}`;
    }

    const balance =
        totalIncome - totalExpenses;

    if (balanceElement) {
        balanceElement.textContent =
            `₹${balance.toLocaleString("en-IN")}`;
    }
}

// ==========================================
// UPDATE BUDGET
// ==========================================

function updateBudget() {
    const budgetContainer =
        document.getElementById("budgetContainer");

    if (!budgetContainer) {
        return;
    }

    budgetContainer.innerHTML = "";

    Object.keys(budgets).forEach(
        function(category) {

            const budget =
                budgets[category];

            const spent =
                categoryExpenses[category];

            const percentage =
                budget > 0
                    ? Math.min(
                        (spent / budget) * 100,
                        100
                    )
                    : 0;

            const budgetItem =
                document.createElement("div");

            budgetItem.className =
                "budget-item";

            budgetItem.innerHTML = `
                <div class="budget-header">
                    <span>${category}</span>

                    <span>
                        ₹${spent.toLocaleString("en-IN")}
                        /
                        ₹${budget.toLocaleString("en-IN")}
                    </span>
                </div>

                <div class="budget-bar">
                    <div
                        class="budget-progress"
                        style="width: ${percentage}%"
                    ></div>
                </div>
            `;

            budgetContainer.appendChild(
                budgetItem
            );
        }
    );
}

// ==========================================
// EXPENSE BREAKDOWN
// ==========================================

function updateExpenseChart() {
    const chartContainer =
        document.getElementById("expenseChart");

    if (!chartContainer) {
        return;
    }

    chartContainer.innerHTML = "";

    Object.keys(categoryExpenses).forEach(
        function(category) {

            const amount =
                categoryExpenses[category];

            if (amount === 0) {
                return;
            }

            const percentage =
                totalExpenses > 0
                    ? (amount / totalExpenses) * 100
                    : 0;

            const chartItem =
                document.createElement("div");

            chartItem.className =
                "chart-item";

            chartItem.innerHTML = `
                <div class="chart-label">
                    <span>${category}</span>

                    <span>
                        ₹${amount.toLocaleString("en-IN")}
                    </span>
                </div>

                <div class="chart-bar">
                    <div
                        class="chart-progress"
                        style="width: ${percentage}%"
                    ></div>
                </div>
            `;

            chartContainer.appendChild(
                chartItem
            );
        }
    );

    if (totalExpenses === 0) {
        chartContainer.innerHTML =
            "<p>No expenses added yet.</p>";
    }
}

// ==========================================
// RECENT EXPENSES
// ==========================================

function updateRecentExpenses() {
    const recentExpenses =
        document.getElementById("recentExpenses");

    if (!recentExpenses) {
        return;
    }

    recentExpenses.innerHTML = "";

    if (expenseHistory.length === 0) {
        recentExpenses.innerHTML =
            "<p>No expenses recorded yet.</p>";

        return;
    }

    const recent =
        expenseHistory
            .slice(-5)
            .reverse();

    recent.forEach(
        function(expense) {

            const item =
                document.createElement("div");

            item.className =
                "recent-expense";

            item.innerHTML = `
                <div>
                    <strong>
                        ${expense.category}
                    </strong>

                    <small>
                        ${expense.date}
                    </small>
                </div>

                <strong>
                    ₹${expense.amount.toLocaleString("en-IN")}
                </strong>
            `;

            recentExpenses.appendChild(item);
        }
    );
}

// ==========================================
// FINANCIAL WARNINGS
// ==========================================

function updateFinancialWarnings() {
    const warningContainer =
        document.getElementById(
            "financialWarnings"
        );

    if (!warningContainer) {
        return;
    }

    warningContainer.innerHTML = "";

    const balance =
        totalIncome - totalExpenses;

    if (
        totalIncome === 0 &&
        totalExpenses === 0
    ) {
        warningContainer.innerHTML = `
            <div class="warning-card">
                💡 Start by adding your income and expenses.
            </div>
        `;

        return;
    }

    if (totalExpenses > totalIncome) {
        warningContainer.innerHTML += `
            <div class="warning-card danger">
                🚨 <strong>High Spending Alert:</strong>
                Your expenses are greater than your income.
            </div>
        `;
    }

    if (
        totalIncome > 0 &&
        totalExpenses >= totalIncome * 0.8 &&
        totalExpenses <= totalIncome
    ) {
        warningContainer.innerHTML += `
            <div class="warning-card warning">
                ⚠️ <strong>Spending Alert:</strong>
                You have used more than 80% of your income.
            </div>
        `;
    }

    Object.keys(budgets).forEach(
        function(category) {

            const spent =
                categoryExpenses[category];

            const budget =
                budgets[category];

            if (spent >= budget) {
                warningContainer.innerHTML += `
                    <div class="warning-card danger">
                        🚨 <strong>
                        ${category} Budget Alert:
                        </strong>

                        You have reached or exceeded
                        your ${category} budget of
                        ₹${budget.toLocaleString("en-IN")}.
                    </div>
                `;
            }
        }
    );

    if (
        totalIncome > 0 &&
        totalExpenses < totalIncome * 0.5
    ) {
        warningContainer.innerHTML += `
            <div class="warning-card success">
                🎉 <strong>Good Savings!</strong>
                You are spending less than 50%
                of your income.
            </div>
        `;
    }

    if (balance >= 0) {
        warningContainer.innerHTML += `
            <div class="warning-card">
                💰 Available Balance:
                <strong>
                    ₹${balance.toLocaleString("en-IN")}
                </strong>
            </div>
        `;
    }
}

// ==========================================
// AI QUICK QUESTIONS
// ==========================================

function useQuestion(question) {
    const aiInput =
        document.getElementById("aiQuestion");

    if (!aiInput) {
        return;
    }

    aiInput.value = question;

    askAI();
}

// ==========================================
// AI ASSISTANT
// ==========================================

function askAI() {
    const aiInput =
        document.getElementById("aiQuestion");

    const aiResponse =
        document.getElementById("aiResponse");

    if (!aiInput || !aiResponse) {
        return;
    }

    const question =
        aiInput.value.trim().toLowerCase();

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    let answer = "";

    if (
        question.includes("saving") ||
        question.includes("save")
    ) {
        answer = `
            💡 <strong>How to save more money:</strong>
            <br><br>

            Try the 50-30-20 rule:
            <br>
            • 50% for needs
            <br>
            • 30% for wants
            <br>
            • 20% for savings
            <br><br>

            Track your daily expenses and reduce
            unnecessary spending.
        `;
    }

    else if (
        question.includes("most") ||
        question.includes("highest") ||
        question.includes("where")
    ) {
        let highestCategory = "None";
        let highestAmount = 0;

        Object.keys(categoryExpenses).forEach(
            function(category) {

                if (
                    categoryExpenses[category] >
                    highestAmount
                ) {
                    highestAmount =
                        categoryExpenses[category];

                    highestCategory =
                        category;
                }
            }
        );

        if (highestAmount === 0) {
            answer =
                "You haven't added any expenses yet.";
        } else {
            answer = `
                📊 You are spending the most on
                <strong>${highestCategory}</strong>.

                <br><br>

                Amount spent:
                <strong>
                    ₹${highestAmount.toLocaleString("en-IN")}
                </strong>
            `;
        }
    }

    else if (
        question.includes("budget") ||
        question.includes("within")
    ) {
        const balance =
            totalIncome - totalExpenses;

        answer = `
            📋 <strong>Your current financial status:</strong>

            <br><br>

            Total Income:
            ₹${totalIncome.toLocaleString("en-IN")}

            <br>

            Total Expenses:
            ₹${totalExpenses.toLocaleString("en-IN")}

            <br>

            Remaining Balance:
            ₹${balance.toLocaleString("en-IN")}

            <br><br>

            Keep your expenses below your income
            to maintain a healthy budget.
        `;
    }

    else if (
        question.includes("expense") ||
        question.includes("expenses") ||
        question.includes("spending")
    ) {
        answer = `
            💰 Your total expenses are:

            <strong>
                ₹${totalExpenses.toLocaleString("en-IN")}
            </strong>
        `;
    }

    else if (
        question.includes("income") ||
        question.includes("salary")
    ) {
        answer = `
            💵 Your total income is:

            <strong>
                ₹${totalIncome.toLocaleString("en-IN")}
            </strong>
        `;
    }

    else if (
        question.includes("balance") ||
        question.includes("left") ||
        question.includes("remaining")
    ) {
        const balance =
            totalIncome - totalExpenses;

        answer = `
            💰 Your available balance is:

            <strong>
                ₹${balance.toLocaleString("en-IN")}
            </strong>
        `;
    }

    else {
        answer = `
            🤖 I can help you with questions like:

            <br><br>

            • How can I save more money?
            <br>
            • Where am I spending the most?
            <br>
            • What is my current budget?
            <br>
            • How much have I spent?
            <br>
            • What is my balance?
            <br>
            • What is my income?
        `;
    }

    aiResponse.innerHTML = answer;
}

// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        const token =
            localStorage.getItem(
                "fintrackToken"
            );

        const authPage =
            document.getElementById("authPage");

        const mainApp =
            document.getElementById("mainApp");

        if (token) {

            if (authPage) {
                authPage.classList.add("hidden");
            }

            if (mainApp) {
                mainApp.classList.remove("hidden");
            }

            const userName =
                localStorage.getItem(
                    "fintrackUserName"
                );

            const welcomeText =
                document.getElementById(
                    "welcomeText"
                );

            if (welcomeText && userName) {
                welcomeText.textContent =
                    `Welcome back, ${userName}!`;
            }

            // Load saved data
            await loadFinancialData();

        } else {

            if (authPage) {
                authPage.classList.remove("hidden");
            }

            if (mainApp) {
                mainApp.classList.add("hidden");
            }

            updateDashboard();
            updateBudget();
            updateExpenseChart();
            updateRecentExpenses();
            updateFinancialWarnings();
        }
    }
);