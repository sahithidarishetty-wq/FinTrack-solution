/* ================= AUTHENTICATION ================= */

function showSignup() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");

    document
        .getElementById("signupForm")
        .classList.remove("hidden");

}


function showLogin() {

    document
        .getElementById("signupForm")
        .classList.add("hidden");

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

}


/* DEMO LOGIN */

function demoLogin() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    if (email === "" || password === "") {

        alert(
            "Please enter your email and password."
        );

        return;

    }


    document
        .getElementById("authPage")
        .classList.add("hidden");

    document
        .getElementById("mainApp")
        .classList.remove("hidden");

}


/* DEMO SIGN UP */

function demoSignup() {

    const name =
        document
            .getElementById("signupName")
            .value
            .trim();

    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("signupPassword")
            .value;

    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        alert(
            "Please fill in all fields."
        );

        return;

    }


    if (password !== confirmPassword) {

        alert(
            "Passwords do not match."
        );

        return;

    }


    if (password.length < 6) {

        alert(
            "Password should contain at least 6 characters."
        );

        return;

    }


    alert(
        "Account created successfully! You can now continue to FinTrack."
    );


    showLogin();

}


/* SHOW / HIDE PASSWORD */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);


    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    }

    else {

        input.type = "password";

        button.textContent = "👁️";

    }

}


/* LOGOUT */

function logout() {

    document
        .getElementById("mainApp")
        .classList.add("hidden");

    document
        .getElementById("authPage")
        .classList.remove("hidden");

}


/* ================= FINTRACK ================= */

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


/* START TRACKING */

function startTracking() {

    document
        .getElementById("dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ADD INCOME */

function addIncome() {

    const input =
        document.getElementById("incomeAmount");

    const amount =
        Number(input.value);


    if (amount <= 0) {

        alert(
            "Please enter a valid income amount."
        );

        return;

    }


    totalIncome += amount;


    input.value = "";


    updateDashboard();

    updateFinancialWarnings();

}


/* ADD EXPENSE */

function addExpense() {

    const amountInput =
        document.getElementById(
            "expenseAmount"
        );

    const categoryInput =
        document.getElementById(
            "expenseCategory"
        );


    const amount =
        Number(amountInput.value);

    const category =
        categoryInput.value;


    if (amount <= 0) {

        alert(
            "Please enter a valid expense amount."
        );

        return;

    }


    totalExpenses += amount;


    categoryExpenses[category] += amount;


    expenseHistory.push({

        amount: amount,

        category: category,

        date: new Date()
            .toLocaleDateString()

    });


    amountInput.value = "";


    updateDashboard();

    updateBudget();

    updateExpenseChart();

    updateRecentExpenses();

    updateFinancialWarnings();

}


/* DASHBOARD */

function updateDashboard() {

    document
        .getElementById("totalIncome")
        .textContent =
        "₹" +
        totalIncome.toLocaleString("en-IN");


    document
        .getElementById("totalExpenses")
        .textContent =
        "₹" +
        totalExpenses.toLocaleString("en-IN");


    const balance =
        totalIncome - totalExpenses;


    document
        .getElementById("balance")
        .textContent =
        "₹" +
        balance.toLocaleString("en-IN");

}


/* BUDGET */

function updateBudget() {

    updateSingleBudget(
        "Food",
        "foodBudgetText",
        "foodProgress"
    );


    updateSingleBudget(
        "Transport",
        "transportBudgetText",
        "transportProgress"
    );


    updateSingleBudget(
        "Shopping",
        "shoppingBudgetText",
        "shoppingProgress"
    );


    updateSingleBudget(
        "Bills",
        "billsBudgetText",
        "billsProgress"
    );


    updateSingleBudget(
        "Other",
        "otherBudgetText",
        "otherProgress"
    );

}


function updateSingleBudget(
    category,
    textId,
    progressId
) {

    const spent =
        categoryExpenses[category];

    const budget =
        budgets[category];


    const percentage =
        Math.min(
            (spent / budget) * 100,
            100
        );


    document
        .getElementById(textId)
        .textContent =
        "₹" +
        spent.toLocaleString("en-IN") +
        " / ₹" +
        budget.toLocaleString("en-IN");


    const progress =
        document.getElementById(
            progressId
        );


    progress.style.width =
        percentage + "%";


    if (spent > budget) {

        progress.style.background =
            "red";

    }

    else if (spent >= budget * 0.8) {

        progress.style.background =
            "#f0a500";

    }

    else {

        progress.style.background =
            "#1f4e79";

    }

}


/* EXPENSE BREAKDOWN */

function updateExpenseChart() {

    const categories = [

        "Food",

        "Transport",

        "Shopping",

        "Bills",

        "Other"

    ];


    let maxExpense = 0;


    categories.forEach(
        function(category) {

            if (
                categoryExpenses[category]
                > maxExpense
            ) {

                maxExpense =
                    categoryExpenses[category];

            }

        }
    );


    categories.forEach(
        function(category) {

            const amount =
                categoryExpenses[category];


            const percentage =
                maxExpense === 0
                    ? 0
                    : (
                        amount /
                        maxExpense
                    ) * 100;


            const id =
                category.toLowerCase()
                + "Chart";


            const expenseId =
                category.toLowerCase()
                + "Expense";


            document
                .getElementById(id)
                .style.width =
                percentage + "%";


            document
                .getElementById(expenseId)
                .textContent =
                "₹" +
                amount.toLocaleString("en-IN");

        }
    );

}


/* RECENT EXPENSES */

function updateRecentExpenses() {

    const container =
        document.getElementById(
            "recentExpenses"
        );


    if (
        expenseHistory.length === 0
    ) {

        container.innerHTML = `

            <p class="empty-message">
                No expenses added yet.
            </p>

        `;

        return;

    }


    const recent =
        expenseHistory
            .slice(-5)
            .reverse();


    container.innerHTML = "";


    recent.forEach(
        function(expense) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "expense-row";


            row.innerHTML = `

                <span>

                    <strong>
                        ${expense.category}
                    </strong>

                    <br>

                    ${expense.date}

                </span>


                <strong>

                    ₹${expense.amount
                        .toLocaleString("en-IN")}

                </strong>

            `;


            container.appendChild(row);

        }
    );

}


/* SMART WARNINGS */

function updateFinancialWarnings() {

    const container =
        document.getElementById(
            "financialWarnings"
        );


    const warnings = [];


    if (
        totalIncome === 0 &&
        totalExpenses === 0
    ) {

        warnings.push({

            type: "success",

            title:
                "💚 You're doing well!",

            message:
                "Add your income and expenses to receive personalized financial warnings."

        });

    }


    if (
        totalExpenses > totalIncome &&
        totalExpenses > 0
    ) {

        warnings.push({

            type: "danger",

            title:
                "🚨 Spending Alert",

            message:
                "Your expenses are currently higher than your income. Try reducing non-essential spending."

        });

    }


    if (
        totalIncome > 0 &&
        totalExpenses > 0 &&
        totalExpenses >=
        totalIncome * 0.8 &&
        totalExpenses <= totalIncome
    ) {

        warnings.push({

            type: "warning-box",

            title:
                "⚠️ High Spending",

            message:
                "You have already used more than 80% of your income. Be careful with additional spending."

        });

    }


    Object.keys(budgets).forEach(
        function(category) {

            const spent =
                categoryExpenses[category];

            const budget =
                budgets[category];


            if (spent > budget) {

                warnings.push({

                    type: "danger",

                    title:
                        "🚨 " +
                        category +
                        " Budget Exceeded",

                    message:
                        "You have exceeded your " +
                        category +
                        " budget by ₹" +
                        (
                            spent - budget
                        ).toLocaleString("en-IN") +
                        "."

                });

            }

            else if (
                spent >= budget * 0.8 &&
                spent > 0
            ) {

                warnings.push({

                    type: "warning-box",

                    title:
                        "⚠️ " +
                        category +
                        " Budget Alert",

                    message:
                        "You have used " +
                        Math.round(
                            (spent / budget) * 100
                        ) +
                        "% of your " +
                        category +
                        " budget."

                });

            }

        }
    );


    if (
        totalIncome > 0 &&
        totalExpenses > 0 &&
        totalExpenses <
        totalIncome * 0.5
    ) {

        warnings.push({

            type: "success",

            title:
                "💰 Good Savings",

            message:
                "Your current expenses are less than 50% of your income."

        });

    }


    if (
        totalIncome > totalExpenses &&
        totalIncome > 0
    ) {

        const remaining =
            totalIncome -
            totalExpenses;


        warnings.push({

            type: "info",

            title:
                "💡 Available Balance",

            message:
                "You currently have ₹" +
                remaining.toLocaleString("en-IN") +
                " remaining after your recorded expenses."

        });

    }


    container.innerHTML = "";


    warnings.forEach(
        function(warning) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "warning " +
                warning.type;


            div.innerHTML = `

                <strong>
                    ${warning.title}
                </strong>

                <p>
                    ${warning.message}
                </p>

            `;


            container.appendChild(div);

        }
    );

}


/* ================= AI ================= */

function useQuestion(question) {

    document
        .getElementById("aiQuestion")
        .value = question;


    askAI();

}


function askAI() {

    const input =
        document.getElementById(
            "aiQuestion"
        );


    const response =
        document.getElementById(
            "aiResponse"
        );


    const question =
        input.value
            .trim()
            .toLowerCase();


    if (question === "") {

        response.innerHTML = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                Please enter a question first.
            </p>

        `;

        return;

    }


    if (
        question.includes("save") ||
        question.includes("saving")
    ) {

        response.innerHTML = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                A simple strategy is the 50-30-20 rule:
                use around 50% for needs, 30% for wants,
                and try to save 20% of your income.
            </p>

            <p>
                Focus on reducing unnecessary spending
                in your highest-spending category.
            </p>

        `;

        return;

    }


    if (
        question.includes("most") ||
        question.includes("spending")
    ) {

        let highestCategory = "";

        let highestAmount = 0;


        Object.keys(categoryExpenses)
            .forEach(
                function(category) {

                    if (
                        categoryExpenses[category]
                        > highestAmount
                    ) {

                        highestAmount =
                            categoryExpenses[
                                category
                            ];

                        highestCategory =
                            category;

                    }

                }
            );


        if (highestAmount === 0) {

            response.innerHTML = `

                <strong>
                    AI Assistant:
                </strong>

                <p>
                    You haven't added any expenses yet.
                </p>

            `;

            return;

        }


        response.innerHTML = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                Your highest spending category is
                <strong>
                    ${highestCategory}
                </strong>
                with ₹${highestAmount
                    .toLocaleString("en-IN")}.
            </p>

            <p>
                Consider checking whether you can
                reduce unnecessary spending in this category.
            </p>

        `;

        return;

    }


    if (
        question.includes("budget") ||
        question.includes("within")
    ) {

        const balance =
            totalIncome -
            totalExpenses;


        response.innerHTML = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                Your total recorded expenses are
                <strong>
                    ₹${totalExpenses
                        .toLocaleString("en-IN")}
                </strong>.
            </p>

            <p>
                Your current balance is
                <strong>
                    ₹${balance
                        .toLocaleString("en-IN")}
                </strong>.
            </p>

        `;

        return;

    }


    if (
        question.includes("expense") ||
        question.includes("expenses")
    ) {

        response.innerHTML = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                Your total recorded expenses are
                <strong>
                    ₹${totalExpenses
                        .toLocaleString("en-IN")}
                </strong>.
            </p>

        `;

        return;

    }


    response.innerHTML = `

        <strong>
            AI Assistant:
        </strong>

        <p>
            I can currently help you with:
        </p>

        <ul>

            <li>
                How can I save more money?
            </li>

            <li>
                Where am I spending the most?
            </li>

            <li>
                Am I staying within my budget?
            </li>

            <li>
                How much are my expenses?
            </li>

        </ul>

    `;

}


/* ================= INITIALIZATION ================= */

updateDashboard();

updateBudget();

updateExpenseChart();

updateFinancialWarnings();