let expenses = [];
let totalAmount = 0;
const username = localStorage.getItem('username');
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const chartContext = document.getElementById('monthly-expense-chart').getContext('2d');

let monthlyExpenseData = {};

const expenseChart = new Chart(chartContext, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Expenses',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            maxBarThickness: 70 // Explicitly set the maximum bar width (adjust this value)
        }]
    },
    options: {
        scales: {
            x: {
                barPercentage: 200, // Adjust the bar width within each category
                categoryPercentage: -0.5 // Adjust spacing between categories
            },
            y: {
                beginAtZero: true
            }
        }
    }
});


// Load existing expenses from localStorage
function loadExpenses() {
    const storedExpenses = localStorage.getItem(`expenses_${username}`);
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        expenses.forEach(expense => {
            totalAmount += expense.amount;
            addExpenseToTable(expense);
            updateMonthlyExpenseData(expense.date, expense.amount);
        });
        totalAmountCell.textContent = totalAmount;
        updateMonthlyExpensesChart();
    }
}

// Function to add expense to the table
function addExpenseToTable(expense) {
    const newRow = expensesTableBody.insertRow();
    newRow.insertCell().textContent = expense.category;
    newRow.insertCell().textContent = expense.amount;
    newRow.insertCell().textContent = expense.date;
    
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        deleteExpense(expense, newRow);
    });
    deleteCell.appendChild(deleteBtn);
}

// Function to delete expense
function deleteExpense(expense, row) {
    expenses.splice(expenses.indexOf(expense), 1);
    totalAmount -= expense.amount;
    totalAmountCell.textContent = totalAmount;
    expensesTableBody.removeChild(row);
    updateMonthlyExpensesChart();
    saveExpenses();
}

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem(`expenses_${username}`, JSON.stringify(expenses));
}

// Function to update monthly expense data
function updateMonthlyExpenseData(date, amount) {
    const month = date.slice(0, 7); // Extracting "YYYY-MM" format
    if (monthlyExpenseData[month]) {
        monthlyExpenseData[month] += amount;
    } else {
        monthlyExpenseData[month] = amount;
    }
}

// Function to update the monthly expenses chart
function updateMonthlyExpensesChart() {
    const months = Object.keys(monthlyExpenseData);
    const expenses = Object.values(monthlyExpenseData);
    expenseChart.data.labels = months;
    expenseChart.data.datasets[0].data = expenses;
    expenseChart.update();
}

// Add event listener for the add button
addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const expense = { category, amount, date };
    expenses.push(expense);
    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;
    addExpenseToTable(expense);
    updateMonthlyExpenseData(date, amount);
    updateMonthlyExpensesChart();
    saveExpenses(); // Save to localStorage
});

// Load existing expenses when the page loads
loadExpenses();

// Logout button functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('username'); // Remove username
    localStorage.removeItem(`expenses_${username}`); // Clear expenses associated with the user
    window.location.href = 'login.html'; // Redirect to login page
});
