const Expenses = require("../model/Expenses");
const Safe = require("../model/Safe");

// Add Expenses Controller
const AddExpensesController = async (req, res) => {
    try {
        const expenseAmount = Number(req.body.totalExpenses) || 0;
        const isCash = req.body.PaymentType === "cash";
        const isBank = req.body.PaymentType === "bank";

        // Get Safe
        let safe = await Safe.findOne({ uid: req.body.uid });

        // CHECK BALANCE BEFORE ADDING EXPENSES
        if (safe) {
            if (safe.balance - expenseAmount < 0) {
                return res.status(400).json({ message: "الرصيد الإجمالي في الخزنة غير كافي" });
            }
            if (isCash && safe.cash - expenseAmount < 0) {
                return res.status(400).json({ message: "الرصيد في الكاش غير كافي" });
            }
            if (isBank && safe.bank - expenseAmount < 0) {
                return res.status(400).json({ message: "الرصيد في البنك غير كافي" });
            }
        } else {
            if (expenseAmount > 0) {
                return res.status(400).json({ message: "لا يوجد خزنة لهذا المكتب، الرصيد غير كافي" });
            }
        }

        // Create Expenses
        const expenses = new Expenses(req.body);
        await expenses.save();

        if (!safe) {
            // CREATE NEW Safe IF NOT EXISTS
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
                        createdAt: new Date()
                    },
                ],
            });
        } else {
            // UPDATE EXISTING Safe
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
                createdAt: new Date()
            });
        }

        await safe.save();
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
