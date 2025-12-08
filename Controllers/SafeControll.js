const Safe = require("../model/Safe");

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
                        BondType: "inbound",
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
                BondType: "inbound",
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
        const amount = Number(req.body.amount);
        const paymentType = req.body?.PaymentType;
        let safe = await Safe.findOne({ uid: req.params.uid });
        // Check if enough balance
        if (!safe) {
            // not enough balance
            return res.status(400).json({
                message: "لا يوجد رصيد كافي في الخزنة أو البنك للخصم"
            });
        }
        if (paymentType === "cash" && safe.cash < amount) {
            return res.status(400).json({
                message: "لا يوجد رصيد كافي في الخزنة (كاش)"
            });
        }
        if (paymentType === "bank" && safe.bank < amount) {
            return res.status(400).json({
                message: "لا يوجد رصيد كافي في البنك"
            });
        }
        safe.balance -= amount;
        if (paymentType === "cash") {
            safe.cash -= amount;
        } else if (paymentType === "bank") {
            safe.bank -= amount;
        }
        safe.lastUpdated = new Date();
        safe.amount = amount;
        safe.transactions.push({
            ProcessName: "سند صرف",
            type: "removes",
            amount: amount,
            description: req.body.description,
            createdAt: new Date(),
            OfficeName: safe?.name,
            PersonName: req.body.name,
            BondType: "outbound",
            PaymentType: paymentType,
        });
        await safe.save();
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