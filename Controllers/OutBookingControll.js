const Safe = require("../model/Safe");
const OutBooking = require("../model/OutBooking");
const { sendWhatsAppMessage } = require("../Config/Twilio");

const AddOutBooking = async (req, res) => {
    try {
        const outBook = new OutBooking(req.body);
        await outBook.save();

        // Set Data Safe
        let safe = await Safe.findOne({ uid: req.body.uid });
        const amount = Number(req.body?.NetTicketPrice) || 0;
        const paymentType = req.body?.PaymentType
        if (!safe) {
            safe = new Safe({
                name: req.body.OfficeName,
                uid: req.body.uid,
                balance: amount,
                cash: paymentType === "cash" ? amount : 0,
                bank: paymentType === "bank" ? amount : 0,
                lastUpdated: new Date(),
                amount,
                transactions: [
                    {
                        name: "حجز مقعد",
                        ProcessName: "حجز مقعد",
                        type: "deposit",
                        amount,
                        description: "تم حجز المقعد بنجاح",
                        uid: req.body.uid,
                        OfficeName: req.body.OfficeName,
                        PaymentType: paymentType,
                        createdAt: new Date(),
                        date: req.body.date,
                    },
                ],
            });
            await safe.save();
        } else {
            safe.balance += amount;
            if (paymentType === "cash") {
                safe.cash += amount;
            } else if (paymentType === "bank") {
                safe.bank += amount;
            }
            safe.lastUpdated = new Date();
            safe.amount = amount;
            safe.transactions.push({
                name: "حجز مقعد",
                ProcessName: "حجز مقعد",
                type: "deposit",
                amount,
                description: "تم حجز المقعد بنجاح",
                uid: req.body.uid,
                OfficeName: req.body.OfficeName,
                PaymentType: paymentType,
                createdAt: new Date(),
                date: req.body.date,
            });
            await safe.save();
        }

        // Send WhatsApp with Ticket Details
        await sendWhatsAppMessage(outBook.phone, outBook, outBook.ticketNumber);


        res.status(201).json({ message: "تم اضافة الحجز بنجاح", outBook });
    } catch (error) {
        console.error("❌ Error in AddOutBooking:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// Canceled OutBooking
const CancelOutBooking = async (req, res) => {
    try {
        const outBook = await OutBooking.findById(req.params.id);
        if (!outBook) return res.status(404).json({ message: "OutBooking not found" });

        if (outBook.status === "canceled") {
            return res.status(400).json({ message: "الحجز ملغي مسبقاً" });
        }
        outBook.status = "canceled";
        await outBook.save();

        // shortage of the treasury
        let safe = await Safe.findOne({ uid: outBook.uid });
        if (safe) {
            safe.balance -= Number(outBook.NetTicketPrice);
            safe.bank -= outBook.PaymentType === "bank" ? Number(outBook.NetTicketPrice) : 0;
            safe.cash -= outBook.PaymentType === "cash" ? Number(outBook.NetTicketPrice) : 0;
            safe.lastUpdated = new Date();
            safe.amount = Number(outBook?.NetTicketPrice);
            safe.transactions.push({
                ProcessName: 'حذف حجز',
                type: "removes",
                amount: Number(outBook?.NetTicketPrice),
                description: "تم حذف الحجز بنجاح",
                uid: outBook.uid,
                OfficeName: outBook.OfficeName,
                createdAt: new Date(),
                date: outBook.date,
                PaymentType: outBook.PaymentType
            });
            await safe.save();
        }
        res.status(200).json({ message: "تم الغاء الحجز بنجاح", outBook });
    } catch (error) {
        console.error("❌ Error in CancelOutBooking:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// Delete OutBooking
const DeleteOutBooking = async (req, res) => {
    try {
        const outBook = await OutBooking.findById(req.params.id);
        if (!outBook) return res.status(404).json({ message: "OutBooking not found" });

        // Check if canceled
        if (outBook.status === "canceled") {
            await OutBooking.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "تم حذف الحجز الملغي مسبقاً", outBook });
        }

        // shortage of the treasury
        let safe = await Safe.findOne({ uid: outBook.uid });
        if (safe) {
            safe.balance -= Number(outBook.NetTicketPrice);
            safe.bank -= outBook.PaymentType === "bank" ? Number(outBook.NetTicketPrice) : 0;
            safe.cash -= outBook.PaymentType === "cash" ? Number(outBook.NetTicketPrice) : 0;
            safe.lastUpdated = new Date();
            safe.amount = Number(outBook.NetTicketPrice);
            safe.transactions.push({
                ProcessName: 'حذف حجز',
                type: "removes",
                amount: Number(outBook.NetTicketPrice),
                description: "تم حذف الحجز بنجاح",
                uid: outBook.uid,
                OfficeName: outBook.OfficeName,
                createdAt: new Date(),
                date: outBook.date,
            });
            await safe.save();
        }

        // Remove
        await OutBooking.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "تم حذف الحجز بنجاح", outBook });
    } catch (error) {
        console.error("❌ Error in DeleteOutBooking:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};


const GetOutBookings = async (req, res) => {
    try {
        const outBookings = await OutBooking.find().sort({ createdAt: -1 });
        res.status(200).json({ outBookings });
    } catch (error) {
        console.error("❌ Error in GetOutBookings:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

const GetByUid = async (req, res) => {
    try {
        const outBookings = await OutBooking.find({ uid: req.params.uid }).sort({ createdAt: -1 });
        res.status(200).json({ outBookings });
    } catch (error) {
        console.error("❌ Error in GetByUid:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};



// Export
module.exports = { AddOutBooking, GetOutBookings, GetByUid, CancelOutBooking, DeleteOutBooking };