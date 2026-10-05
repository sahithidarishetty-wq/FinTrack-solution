// Starting values

let totalIncome = 0;

let totalExpenses = 0;



// Monthly budgets

const budgets = {

    Food: 2000,

    Transport: 1500,

    Shopping: 3000,

    Bills: 2500,

    Other: 2000

};



// Current spending by category

const categoryExpenses = {

    Food: 0,

    Transport: 0,

    Shopping: 0,

    Bills: 0,

    Other: 0

};



// Start Tracking

function startTracking() {

    alert(
        "Welcome to FinTrack! Let's start tracking your finances."
    );

}



// Add Income

function addIncome() {

    const incomeName =
        document.getElementById("incomeName").value;

    const incomeAmount =
        Number(
            document.getElementById("incomeAmount").value
        );


    // Validate input

    if (
        incomeName === "" ||
        incomeAmount <= 0
    ) {

        alert(
            "Please enter a valid income source and amount."
        );

        return;
    }


    // Add income

    totalIncome =
        totalIncome + incomeAmount;


    // Update dashboard

    document.getElementById(
        "totalIncome"
    ).textContent =
        "₹" +
        totalIncome.toLocaleString("en-IN");


    // Update balance

    updateBalance();


    // Clear inputs

    document.getElementById(
        "incomeName"
    ).value = "";


    document.getElementById(
        "incomeAmount"
    ).value = "";


    alert(
        "Income added successfully!"
    );

}



// Add Expense

function addExpense() {

    const expenseName =
        document.getElementById("expenseName").value;

    const expenseAmount =
        Number(
            document.getElementById("expenseAmount").value
        );

    const expenseCategory =
        document.getElementById("expenseCategory").value;


    // Validate input

    if (
        expenseName === "" ||
        expenseAmount <= 0
    ) {

        alert(
            "Please enter a valid expense name and amount."
        );

        return;
    }


    // Add expense

    totalExpenses =
        totalExpenses + expenseAmount;


    // Update category spending

    categoryExpenses[expenseCategory] =
        categoryExpenses[expenseCategory] +
        expenseAmount;


    // Update dashboard

    document.getElementById(
        "totalExpenses"
    ).textContent =
        "₹" +
        totalExpenses.toLocaleString("en-IN");


    // Update balance

    updateBalance();


    // Update budget

    updateBudget(
        expenseCategory
    );


    // Update chart

    updateExpenseChart();


    // Get expense list

    const expenseList =
        document.getElementById(
            "expenseList"
        );


    // Remove empty message

    const emptyMessage =
        document.querySelector(
            ".empty-message"
        );


    if (emptyMessage) {

        emptyMessage.remove();

    }


    // Create expense item

    const expenseItem =
        document.createElement("div");


    expenseItem.className =
        "expense-item";


    expenseItem.innerHTML = `

        <div>

            <h3>
                ${expenseName}
            </h3>

            <p>
                ${expenseCategory}
            </p>

        </div>


        <div class="expense-amount">

            ₹${expenseAmount.toLocaleString("en-IN")}

        </div>

    `;


    // Add to list

    expenseList.appendChild(
        expenseItem
    );


    // Clear inputs

    document.getElementById(
        "expenseName"
    ).value = "";


    document.getElementById(
        "expenseAmount"
    ).value = "";


    document.getElementById(
        "expenseCategory"
    ).value = "Food";

}



// Update Balance

function updateBalance() {

    const balance =
        totalIncome - totalExpenses;


    document.getElementById(
        "savings"
    ).textContent =
        "₹" +
        balance.toLocaleString("en-IN");

}



// Update Budget

function updateBudget(category) {

    const spent =
        categoryExpenses[category];

    const budget =
        budgets[category];


    const percentage =
        Math.min(
            (spent / budget) * 100,
            100
        );


    // Create IDs

    const categoryId =
        category.toLowerCase();


    const textElement =
        document.getElementById(
            categoryId + "BudgetText"
        );


    const progressElement =
        document.getElementById(
            categoryId + "Progress"
        );


    // Update text

    textElement.textContent =
        "₹" +
        spent.toLocaleString("en-IN") +
        " / ₹" +
        budget.toLocaleString("en-IN");


    // Update progress bar

    progressElement.style.width =
        percentage + "%";


    // Budget warning

    if (spent >= budget) {

        progressElement.style.background =
            "#d9534f";

    }

    else {

        progressElement.style.background =
            "#1f4e79";

    }

}



// Update Expense Chart

function updateExpenseChart() {

    const categories = [

        "Food",

        "Transport",

        "Shopping",

        "Bills",

        "Other"

    ];


    // Find the highest expense

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


    // Update every category

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
                    categoryId + "ChartAmount"
                );


            // Update amount

            amountElement.textContent =
                "₹" +
                amount.toLocaleString("en-IN");


            // Calculate chart percentage

            let percentage = 0;


            if (highestExpense > 0) {

                percentage =
                    (amount / highestExpense) * 100;

            }


            // Update chart

            chartElement.style.width =
                percentage + "%";

        }
    );


    // Update chart message

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



// Initialize chart

updateExpenseChart();