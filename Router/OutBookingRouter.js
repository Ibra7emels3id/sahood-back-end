const express = require("express");
const { AddOutBooking, GetOutBookings, GetByUid, CancelOutBooking, DeleteOutBooking } = require("../Controllers/OutBookingControll");
const OutBookingRouter = express.Router();


OutBookingRouter.post("/out-booking", AddOutBooking);
OutBookingRouter.get("/out-bookings", GetOutBookings);
OutBookingRouter.get("/account/out-bookings/:uid", GetByUid);
OutBookingRouter.put("/out-booking-cancel/:uid/:id", CancelOutBooking);
OutBookingRouter.delete("/out-booking-delete/:id/:uid", DeleteOutBooking);

module.exports = OutBookingRouter;