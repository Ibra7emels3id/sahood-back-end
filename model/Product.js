const mongoose = require("mongoose");

// Passenger Schema
const passengerSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    RecipientName: { type: String, default: "", required: false, },
    typeSix: { type: String, default: "", required: false, },
    phone: { type: Number, default: 0 },
    seat: { type: Number, default: 0 },
    ticketNumber: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    status: { type: String, default: "booked" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    passport: { type: String, default: "" },
    numberBags: { type: Number, default: 0 },
    ticketOfficeFees: { type: Number, default: 0 },
    notes: { type: String, default: "", required: false, },
    ticketOfficeInvitedFees: { type: Number, default: 0 },
    NetTicketPrice: { type: Number, default: 0 },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    track: { type: String, default: "" },
    busNumber: { type: String, default: '' },
    OfficeName: { type: String, default: "" },
    uid: { type: String, default: "" },
    email: { type: String, default: "" },
    gender: { type: String, default: "" },
    BirthDate: { type: String, default: "", },
    description: { type: String, default: "", required: false, },
    destination: { type: String, default: "", required: false, },
    PaymentType: {
        type: String,
        required: true,
        default: "cash",
        enum: ["cash", "bank"]
    }
});

// Product (Bus) Schema
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    name2: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
        default: 0,
    },
    NetTicketPrice: {
        type: Number,
        required: false,
        default: 0,
    },
    officePrice: {
        type: Number,
        required: false,
    },
    busNumber: {
        type: String,
        required: true,
    },
    passengerSchemas: [passengerSchema],
    deposits: [passengerSchema],
    track: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    uid: {
        type: String,
        required: true,
    },
    OfficeName: {
        type: String,
        required: true,
    },
});


// Export the model
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
