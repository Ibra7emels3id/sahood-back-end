const { default: Safe } = require("../model/Safe");

// Add Transaction Controller Safe 
const AddReceiptTheSafe = async (req, res) => {
    try {
        let safe = await Safe.findOne({ uid: req.params.uid });
        if (!safe) {
            safe = new Safe({
                name: req.body.OfficeName,
                uid: req.body.uid,
                balance: Number(req.body.amount),
                cash: 0,
                bank: 0,
                lastUpdated: new Date(),
                amount: Number(req.body.amount),
                transactions: [
                    {
                        OfficeName: safe.name,
                        ProcessName: 'سند قبض',
                        type: 'deposit',
                        amount: Number(req.body.amount),
                        description: req.body.description,
                        createdAt: new Date(),
                        PersonName: req.body.name,
                        PaymentType: req.body?.PaymentType
                    },
                ],
            })
            if (req.body?.PaymentType === "cash") {
                safe.cash = Number(req.body.amount);
            } else if (req.body?.PaymentType === "bank") {
                safe.bank = Number(req.body.amount);
            }
            await safe.save();
        } else {
            safe.balance += Number(req.body.amount);
            if (req.body?.PaymentType === "cash") {
                safe.cash += Number(req.body.amount);
            } else if (req.body?.PaymentType === "bank") {
                safe.bank += Number(req.body.amount);
            }
            safe.lastUpdated = new Date();
            safe.amount = req.body.amount;
            safe.transactions.push({
                ProcessName: "سند قبض",
                type: 'deposit',
                amount: Number(req.body.amount),
                description: req.body.description,
                createdAt: new Date(),
                OfficeName: safe?.name,
                PersonName: req.body.name,
                PaymentType: req.body?.PaymentType
            });
            await safe.save();
        }
        res.status(200).json({ message: "تم اضافة سند القبض بنجاح", safe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Bill Exchange 
const AddBillExchange = async (req, res) => {
    try {
        let safe = await Safe.findOne({ uid: req.params.uid });
        if (!safe) {
            safe = new Safe({
                name: req.body.OfficeName,
                uid: req.body.uid,
                balance: -Number(req.body.amount),
                cash: req.body?.PaymentType === "cash" ? -Number(req.body.amount) : 0,
                bank: req.body?.PaymentType === "bank" ? -Number(req.body.amount) : 0,
                lastUpdated: new Date(),
                amount: Number(req.body.amount),
                transactions: [
                    {
                        OfficeName: safe.name,
                        ProcessName: 'سند صرف',
                        type: "removes",
                        amount: Number(req.body.amount),
                        description: req.body.description,
                        createdAt: new Date(),
                        PersonName: req.body.name,
                        PaymentType: req.body?.PaymentType
                    },
                ],
            })
            await safe.save();
        } else {
            safe.balance -= Number(req.body.amount);
            if (req.body?.PaymentType === "cash") {
                safe.cash -= Number(req.body.amount);
            } else if (req.body?.PaymentType === "bank") {
                safe.bank -= Number(req.body.amount);
            }
            safe.lastUpdated = new Date();
            safe.amount = req.body.amount;
            safe.transactions.push({
                ProcessName: "سند صرف",
                type: "removes",
                amount: Number(req.body.amount),
                description: req.body.description,
                createdAt: new Date(),
                OfficeName: safe?.name,
                PersonName: req.body.name,
                PaymentType: req.body?.PaymentType
            });
            await safe.save();
        }
        res.status(200).json({ message: "تم اضافة سند الصرف بنجاح", safe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Data
const GetDataSafe = async (req, res) => {
    try {
        const data = await Safe.find();
        if (!data) {
            return res.status(404).json({ message: "لم يتم العثور على الخزنة" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get Data Safe By Uid
const GetDataSafeByUid = async (req, res) => {
    try {
        const data = await Safe.findOne({ uid: req.params.uid });
        if (!data) {
            return res.status(404).json({ message: "لم يتم العثور على الخزنة" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update Transaction Controller Safe
const UpdateTransactionController = async (req, res) => {
    try {
        const safe = await Safe.findById(req.params.id);
        if (!safe) {
            return res.status(404).json({ message: "Safe not found" });
        }
        safe.name = req.body.name || safe.name;
        safe.balance = req.body.balance || safe.balance;
        await safe.save();
        res.status(200).json({ message: "تم تحديث المصروف بنجاح", safe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    AddReceiptTheSafe,
    UpdateTransactionController,
    GetDataSafe,
    GetDataSafeByUid,
    AddBillExchange
};