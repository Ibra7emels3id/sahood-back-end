const mongoose = require("mongoose");

const SafeSchema = new mongoose.Schema({
    name: { type: String, default: "Safe" },
    uid: { type: String, required: true },
    balance: { type: Number, default: 0 },
    cash: { type: Number, default: 0 , required: false},
    bank: { type: Number, default: 0 , required: false},
    lastUpdated: { type: Date, default: Date.now },
    amount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    transactions: [
        {
            type: {
                type: String,
                enum: ["deposit", "withdrawal", "transfer" , "removes"],
                required: true,
                default: "deposit"
            },
            BondType:{
                type: String,
                required: false,
                enum: ["inbound" , "outbound"], 
            },
            amount: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: false
            },
            date: {
                type: Date,
                default: Date.now,
                required: false
            },
            relatedSafe: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Safe",
                default: null
            },
            ProcessName:{
                type: String,
                required: false,
                default: "حجز مقعد"
            },
            PersonName: {
                type: String,
                required: false
            },
            uid:{
                type: String,
                required: false
            },
            OfficeName: {
                type: String,
                required: false
            },
            ticketNumber: {
                type: Number,
                required: false,
                default: 0
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            },
            PaymentType:{
                type: String,
                required: true,
                default: "cash",
                enum: ["cash" , "bank"]
            }
        },
    ],
});

const Safe = mongoose.model("Safe", SafeSchema);

module.exports = Safe;
