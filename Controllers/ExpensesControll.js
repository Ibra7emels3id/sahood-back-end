const Expenses = require("../model/Expenses");
const { default: Safe } = require("../model/Safe");

// Add Expenses Controller
const AddExpensesController = async (req, res) => {
    try {
        const expenses = new Expenses(req.body);
        await expenses.save();

        // Get Safe
        let safe = await Safe.findOne({ uid: req.body.uid });

        // Get Expense Amount
        const expenseAmount = Number(req.body.totalExpenses) || 0;
        const isCash = req.body.PaymentType === "cash";
        const isBank = req.body.PaymentType === "bank";

        // Set Data Safe
        if (!safe) {
            safe = new Safe({
                name: req.body.OfficeName,
                uid: req.body.uid,
                balance: -expenseAmount,
                cash: isCash ? -expenseAmount : 0,
                bank: isBank ? -expenseAmount : 0,
                lastUpdated: new Date(),
                amount: expenseAmount,
                transactions: [
                    {
                        ProcessName: req.body.InvoiceName || "إضافة مصروفات",
                        type: "removes",
                        amount: expenseAmount,
                        description: "تم إضافة المصروف بنجاح",
                        OfficeName: req.body.OfficeName,
                        PaymentType: req.body.PaymentType,
                        createdAt: new Date(),
                        PaymentType: req.body.PaymentType
                    },
                ],
            });
            await safe.save();
        } else {
            // change balance
            safe.balance -= expenseAmount;
            if (isCash) safe.cash -= expenseAmount;
            if (isBank) safe.bank -= expenseAmount;
            safe.lastUpdated = new Date();
            safe.amount = expenseAmount;
            safe.transactions.push({
                ProcessName: req.body.InvoiceName || "إضافة مصروفات",
                type: "removes",
                amount: expenseAmount,
                description: "تم إضافة المصروف بنجاح",
                OfficeName: req.body.OfficeName,
                PaymentType: req.body.PaymentType,
                createdAt: new Date(),
                PaymentType: req.body.PaymentType
            });
            await safe.save();
        }
        res.status(201).json({ message: "تم إضافة المصروف بنجاح", expenses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Expenses Controller
const GetExpensesController = async (req, res) => {
    try {
        const expenses = await Expenses.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get By uid
const GetExpensesByUid = async (req, res) => {
    try {
        const expenses = await Expenses.find({ uid: req.params.uid });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Export the model
module.exports = {
    AddExpensesController,
    GetExpensesController,
    GetExpensesByUid,
};
