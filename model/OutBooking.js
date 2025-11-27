const mongoose = require("mongoose");


const OutBookingSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    RecipientName: { type: String, default: "", required: false },
    typeSix: { type: String, default: "", required: false },
    phone: { type: String, default: "" },
    ticketNumber: { type: Number, default: () => Math.floor(1000 + Math.random() * 9000) },
    price: { type: Number, default: 0 },
    status: { type: String, default: "booked" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: "cash" },
    passport: { type: String, default: "" , required: false},
    numberBags: { type: Number, default: 0 },
    notes: { type: String, default: "", required: false },
    ticketOfficeInvitedFees: { type: Number, default: 0, required: false },
    NetTicketPrice: { type: Number, default: 0 },
    date: { type: String, default: "" },
    time: { type: String, default: "", required: false },
    track: { type: String, default: "" ,required: false},
    OfficeName: { type: String, default: "" },
    uid: { type: String, default: "" },
    gender: { type: String, default: "" },
    BirthDate: { type: Date, default: null },
    description: { type: String, default: "", required: false },
    destination: { type: String, default: "", required: false },
    type: { type: String, default: "", required: false },
    PaymentType: {
        type: String,
        required: true,
        default: "cash",
        enum: ["cash", "bank"]
    },
});

const OutBooking = mongoose.model("OutBooking", OutBookingSchema);

module.exports = OutBooking;