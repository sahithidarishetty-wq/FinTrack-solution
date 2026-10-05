// Starting values

let totalIncome = 0;

let totalExpenses = 0;


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


    updateBalance();


    // Clear input

    document.getElementById(
        "incomeName"
    ).value = "";


    document.getElementById(
        "incomeAmount"
    ).value = "";


    alert("Income added successfully!");

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


    // Update dashboard

    document.getElementById(
        "totalExpenses"
    ).textContent =
        "₹" +
        totalExpenses.toLocaleString("en-IN");


    updateBalance();


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


// Calculate Balance

function updateBalance() {

    const balance =
        totalIncome - totalExpenses;


    document.getElementById(
        "savings"
    ).textContent =
        "₹" +
        balance.toLocaleString("en-IN");

}