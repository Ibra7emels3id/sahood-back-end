const express = require('express');
const { AddExpensesController, GetExpensesController, GetExpensesByUid } = require('../Controllers/ExpensesControll');
const RouterExpenses = express.Router();

// Routes for Expenses
RouterExpenses.post('/add-expenses', AddExpensesController);
RouterExpenses.get('/get-expenses', GetExpensesController);
RouterExpenses.get('/get-expenses/:uid', GetExpensesByUid);


// Export the router
module.exports = RouterExpenses;
