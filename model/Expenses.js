const mongoose = require('mongoose');


const ExpensesSchema = new mongoose.Schema({
    InvoiceName: {
        type: String,
        required: true
    },
    totalExpenses: {
        type: Number,
        required: true
    },
    invoiceValue: {
        type: Number,
        required: true
    },
    invoiceDate: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    OfficeName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    PaymentType: {
        type: String,
        required: true,
        default: "cash",
        enum: ["cash", "bank"]
    },
    nots: {
        type: String,
        default: "",
        required: false
    }
});

const Expenses = mongoose.model('Expenses', ExpensesSchema);
module.exports = Expenses;