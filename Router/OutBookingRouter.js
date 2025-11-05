import express from "express";
import { AddOutBooking, CancelOutBooking, DeleteOutBooking, GetByUid, GetOutBookings } from "../Controllers/OutBookingControll.js";
const OutBookingRouter = express.Router();


OutBookingRouter.post("/out-booking", AddOutBooking);
OutBookingRouter.get("/out-bookings", GetOutBookings);
OutBookingRouter.get("/account/out-bookings/:uid", GetByUid);
OutBookingRouter.put("/out-booking-cancel/:uid/:id", CancelOutBooking);
OutBookingRouter.delete("/out-booking-delete/:id/:uid", DeleteOutBooking);

export default OutBookingRouter;
