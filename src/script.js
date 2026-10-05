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


/* Start Tracking */

function startTracking() {

    document
        .querySelector(".dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* Add Income */

function addIncome() {

    const source =
        document
            .getElementById("incomeSource")
            .value
            .trim();

    const amount =
        Number(
            document
                .getElementById("incomeAmount")
                .value
        );


    if (source === "") {

        alert("Please enter the income source.");

        return;

    }


    if (amount <= 0) {

        alert("Please enter a valid income amount.");

        return;

    }


    totalIncome += amount;


    document
        .getElementById("incomeSource")
        .value = "";


    document
        .getElementById("incomeAmount")
        .value = "";


    updateBalance();

}


/* Add Expense */

function addExpense() {

    const name =
        document
            .getElementById("expenseName")
            .value
            .trim();


    const amount =
        Number(
            document
                .getElementById("expenseAmount")
                .value
        );


    const category =
        document
            .getElementById("expenseCategory")
            .value;


    if (name === "") {

        alert("Please enter the expense name.");

        return;

    }


    if (amount <= 0) {

        alert("Please enter a valid expense amount.");

        return;

    }


    totalExpenses += amount;


    categoryExpenses[category] += amount;


    const expenseList =
        document.getElementById(
            "expenseList"
        );


    const emptyMessage =
        expenseList.querySelector(
            ".empty-message"
        );


    if (emptyMessage) {

        emptyMessage.remove();

    }


    const expenseItem =
        document.createElement("div");


    expenseItem.className =
        "expense-item";


    expenseItem.innerHTML = `

        <div>

            <div class="expense-name">
                ${name}
            </div>

            <div class="expense-category">
                ${category}
            </div>

        </div>

        <div class="expense-amount">
            -₹${amount.toLocaleString("en-IN")}
        </div>

    `;


    expenseList.prepend(
        expenseItem
    );


    document
        .getElementById("expenseName")
        .value = "";


    document
        .getElementById("expenseAmount")
        .value = "";


    updateBalance();

    updateBudget();

    updateExpenseChart();

}


/* Update Dashboard */

function updateBalance() {

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


/* Update Budget */

function updateBudget() {

    const categories = [

        "Food",

        "Transport",

        "Shopping",

        "Bills",

        "Other"

    ];


    categories.forEach(
        function(category) {

            const amount =
                categoryExpenses[category];


            const budget =
                budgets[category];


            let percentage =
                (amount / budget) * 100;


            if (percentage > 100) {

                percentage = 100;

            }


            const elementId =
                category.toLowerCase() +
                "Budget";


            const progress =
                document.getElementById(
                    elementId
                );


            progress.style.width =
                percentage + "%";

        }
    );

}


/* Update Expense Chart */

function updateExpenseChart() {

    const categories = [

        "Food",

        "Transport",

        "Shopping",

        "Bills",

        "Other"

    ];


    let highestExpense = 0;


    categories.forEach(
        function(category) {

            if (
                categoryExpenses[category] >
                highestExpense
            ) {

                highestExpense =
                    categoryExpenses[category];

            }

        }
    );


    categories.forEach(
        function(category) {

            const amount =
                categoryExpenses[category];


            const categoryId =
                category.toLowerCase();


            const chartElement =
                document.getElementById(
                    categoryId + "Chart"
                );


            const amountElement =
                document.getElementById(
                    categoryId +
                    "ChartAmount"
                );


            amountElement.textContent =
                "₹" +
                amount.toLocaleString("en-IN");


            let percentage = 0;


            if (highestExpense > 0) {

                percentage =
                    (amount / highestExpense) *
                    100;

            }


            chartElement.style.width =
                percentage + "%";

        }
    );


    const chartMessage =
        document.getElementById(
            "chartMessage"
        );


    if (totalExpenses === 0) {

        chartMessage.textContent =
            "Add some expenses to see your spending breakdown.";

    }
    else {

        chartMessage.textContent =
            "Your spending breakdown is updated automatically.";

    }

}


/* AI Finance Assistant */

function useQuestion(question) {

    const input =
        document.getElementById(
            "aiQuestion"
        );


    input.value =
        question;


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


    let answer = "";


    /* Saving Question */

    if (

        question.includes("save") ||

        question.includes("saving")

    ) {

        answer = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                Try following the 50-30-20 rule:
                use 50% for needs, 30% for wants,
                and try to save 20% of your income.
            </p>

            <p>
                You can also review your Expense
                Breakdown and reduce unnecessary spending.
            </p>

        `;

    }


    /* Highest Spending Question */

    else if (

        question.includes("most") ||

        question.includes("spending")

    ) {

        let highestCategory =
            "None";


        let highestAmount = 0;


        for (
            const category in categoryExpenses
        ) {

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


        if (highestAmount === 0) {

            answer = `

                <strong>
                    AI Assistant:
                </strong>

                <p>
                    You haven't added any expenses yet.
                    Add some expenses and I'll help
                    you understand your spending.
                </p>

            `;

        }
        else {

            answer = `

                <strong>
                    AI Assistant:
                </strong>

                <p>
                    Your highest spending category is
                    <strong>
                        ${highestCategory}
                    </strong>
                    with
                    <strong>
                        ₹${highestAmount.toLocaleString("en-IN")}
                    </strong>.
                </p>

                <p>
                    Consider checking this category
                    to see where you can reduce spending.
                </p>

            `;

        }

    }


    /* Budget Question */

    else if (

        question.includes("budget") ||

        question.includes("within")

    ) {

        if (totalExpenses === 0) {

            answer = `

                <strong>
                    AI Assistant:
                </strong>

                <p>
                    You haven't recorded any expenses yet.
                    Add your expenses to see how you're
                    doing against your budget.
                </p>

            `;

        }
        else {

            answer = `

                <strong>
                    AI Assistant:
                </strong>

                <p>
                    Your current total expenses are
                    <strong>
                        ₹${totalExpenses.toLocaleString("en-IN")}
                    </strong>.
                </p>

                <p>
                    Keep checking your category budgets
                    regularly so you don't overspend.
                </p>

            `;

        }

    }


    /* Expense Question */

    else if (

        question.includes("expense") ||

        question.includes("expenses")

    ) {

        answer = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                Your total expenses are
                <strong>
                    ₹${totalExpenses.toLocaleString("en-IN")}
                </strong>.
            </p>

            <p>
                Review your Expense Breakdown above
                to see which categories are using
                most of your money.
            </p>

        `;

    }


    /* General Question */

    else {

        answer = `

            <strong>
                AI Assistant:
            </strong>

            <p>
                I can help you understand your
                spending, budget, expenses, and savings.
            </p>

            <p>
                Try asking:
                <strong>
                    "How can I save more money?"
                </strong>
            </p>

        `;

    }


    response.innerHTML =
        answer;

}


/* Initial Page Setup */

updateBalance();

updateBudget();

updateExpenseChart();