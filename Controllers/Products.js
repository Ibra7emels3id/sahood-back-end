const { sendTicketDetails, sendWhatsAppMessage } = require("../Config/Twilio");
const { default: Product } = require("../model/Product");
const { default: Safe } = require("../model/Safe");
const { AddTransactionController } = require("./SafeControll");

// Create Bus Model
const AddToProductController = async (req, res) => {
    try {
        // Create a new product
        const product = new Product({
            name: req.body.name,
            name2: req.body.name2,
            OfficeName: req.body.OfficeName,
            busNumber: req.body.busNumber,
            track: req.body.track,
            date: new Date(req.body.date),
            time: req.body.time,
            seats: Number(req.body.seats),
            status: req.body.status || "متاح",
            createdAt: new Date(),
            uid: req.body.uid,
        });

        // Save the product
        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Products (Buses) Controller
const GetProductsController = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit Trip By id
const EditTripController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTrip = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "تم تعديل الرحلة بنجاح", updatedTrip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Trip By id
const DeleteTripController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTrip = await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "تم خذف الرحلة بنجاح", deletedTrip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get For Filter 
const GetForFilterOfficeName = async (req, res) => {
    try {
        const trips = await Product.find({ uid: req.params.id });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Filter Data By Date month and year
const FilterDate = async (req, res) => {
    try {

        const currentMonth = new Date().getMonth() + 1;

        const results = await Product.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                    data: "$$ROOT"
                }
            },
            { $match: { month: currentMonth } }
        ]);

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all reservations without grouping by bus
const GetAllReservations = async (req, res) => {
    try {
        const results = await Product.find().select("passengerSchemas");

        // Set allReservations
        const allReservations = results.flatMap(bus => bus.passengerSchemas);

        res.status(200).json(allReservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Filter reservations without grouping by bus
const GetFilterReservations = async (req, res) => {
    try {
        const uid = req.params.id; //  /reservations/123

        const results = await Product.find({
            "passengerSchemas.uid": uid
        }).select("passengerSchemas");

        // Set allReservations
        const matchedPassengers = results.flatMap(product =>
            product.passengerSchemas.filter(p => p.uid === uid)
        );

        res.status(200).json(matchedPassengers);
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get Product by ID Controller
const GetProductByIdController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// push Reserve a seat
const ReserveSeatController = async (req, res) => {
    const { seat } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if the seat is already booked
        const isBooked = product.passengerSchemas.some(p => p.seat === seat);
        if (isBooked) return res.status(400).json({ message: "Seat already booked" });

        // Generate a random ticket number
        const ticketNumber = Math.floor(1000 + Math.random() * 9000);
        // Add Pass 
        product.passengerSchemas.push({ ...req.body, ticketNumber, PaymentType: req.body?.PaymentType });
        // Save
        await product.save();
        let safe = await Safe.findOne({ uid: req.body.uid });
        if (!safe) {
            safe = new Safe({
                name: req.body.OfficeName,
                uid: req.body.uid,
                balance: Number(req.body?.NetTicketPrice),
                cash: 0,
                bank: 0,
                lastUpdated: new Date(),
                amount: Number(req.body?.NetTicketPrice),
                transactions: [
                    {
                        name: 'حجز مقعد',
                        ProcessName: 'حجز مقعد',
                        type: "deposit",
                        amount: Number(req.body?.NetTicketPrice),
                        description: "تم حجز المقعد بنجاح",
                        uid: req.body.uid,
                        OfficeName: req.body.OfficeName,
                        createdAt: new Date(),
                        date: product.date,
                        PaymentType: req.body?.PaymentType
                    }
                ]
            });
            if (req.body?.PaymentType === "cash") {
                safe.cash += Number(req.body?.NetTicketPrice);
            } else {
                safe.bank += Number(req.body?.NetTicketPrice);
            }
            await safe.save();
        } else {
            safe.balance += Number(req.body?.NetTicketPrice);
            safe.lastUpdated = new Date();
            safe.amount = Number(req.body?.NetTicketPrice);
            safe.transactions.push({
                name: 'حجز مقعد',
                ProcessName: 'حجز مقعد',
                type: "deposit",
                amount: Number(req.body?.NetTicketPrice),
                description: "تم حجز المقعد بنجاح",
                uid: req.body.uid,
                OfficeName: product.OfficeName,
                createdAt: new Date(),
                date: product.date,
                PaymentType: req.body?.PaymentType
            });
            if (req.body?.PaymentType === "cash") {
                safe.cash += Number(req.body?.NetTicketPrice);
            } else {
                safe.bank += Number(req.body?.NetTicketPrice);
            }
            await safe.save();
        }

        // Send WhatsApp with Ticket Details
        await sendWhatsAppMessage(req.body.phone, req.body, ticketNumber);

        res.status(200).json({ message: "تم حجز المقعد بنجاح", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Chair Controller
const DeleteChairController = async (req, res) => {
    try {
        const { id, seat, uid } = req.params;
        const seatNumber = Number(seat);

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const passenger = product.passengerSchemas.find(p => Number(p.seat) === seatNumber);
        if (!passenger) return res.status(404).json({ message: "Chair not found" });

        // Chack if the seat is already canceled
        if (passenger.status === "canceled") {
            return res.status(400).json({ message: "المقعد ملغي مسبقاً" });
        }

        // Update chare
        passenger.status = "canceled";
        passenger.seat = "";

        await product.save();

        // update Safe
        const safe = await Safe.findOne({ uid });
        if (safe) {
            const amount = Number(passenger?.NetTicketPrice) || 0;
            safe.balance -= amount;
            safe.lastUpdated = new Date();
            safe.amount = amount;
            safe.bank -= passenger?.PaymentType === "bank" ? Number(passenger?.NetTicketPrice) : 0;
            safe.cash -= passenger?.PaymentType === "cash" ? Number(passenger?.NetTicketPrice) : 0;
            safe.transactions.push({
                name: "حذف مقعد",
                ProcessName: "حذف مقعد",
                type: "removes",
                amount,
                description: "تم حذف المقعد بنجاح",
                uid,
                OfficeName: product.OfficeName,
                createdAt: new Date(),
                date: product.date,
                PaymentType: passenger?.PaymentType,
            });
            await safe.save();
        }

        // Send WhatsApp with Ticket Details
        if (passenger.phone) {
            await sendWhatsAppMessage(passenger.phone, passenger, passenger.ticketNumber);
        }

        res.status(200).json({ message: "تم حذف المقعد بنجاح", product });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reserve a Secretariat 
const ReserveSecretariatController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Create a unique ticket number
        const ticketNumber = Math.floor(1000 + Math.random() * 9000);

        // Add Pass
        product.deposits.push({
            ...req.body,
            ticketNumber,
            PaymentType: req.body?.PaymentType,
        });

        // Save Date
        await product.save(product);

        // Set Data Safe
        let safe = await Safe.findOne({ uid: req.body.uid });
        if (!safe) {
            safe = new Safe({
                name: req.body.OfficeName,
                uid: req.body.uid,
                balance: Number(req.body?.NetTicketPrice),
                cash: 0,
                bank: 0,
                lastUpdated: new Date(),
                amount: Number(req.body?.NetTicketPrice),
                transactions: [
                    {
                        name: 'حجز مقعد',
                        ProcessName: 'حجز مقعد',
                        type: "deposit",
                        amount: Number(req.body?.NetTicketPrice),
                        description: "تم حجز المقعد بنجاح",
                        uid: req.body.uid,
                        OfficeName: req.body.OfficeName,
                        createdAt: new Date(),
                        date: product.date,
                        PaymentType: req.body?.PaymentType
                    }
                ]
            });
            if (req.body?.PaymentType === "cash") {
                safe.cash += Number(req.body?.NetTicketPrice);
            } else {
                safe.bank += Number(req.body?.NetTicketPrice);
            }
            await safe.save();
        } else {
            safe.balance += Number(req.body?.NetTicketPrice);
            if (req.body?.PaymentType === "cash") {
                safe.cash += Number(req.body?.NetTicketPrice);
            } else {
                safe.bank += Number(req.body?.NetTicketPrice);
            }
            safe.lastUpdated = new Date();
            safe.amount = Number(req.body?.NetTicketPrice);
            safe.transactions.push({
                ProcessName: 'حجز مقعد',
                type: "deposit",
                amount: Number(req.body?.NetTicketPrice),
                description: "تم حجز الامانة بنجاح",
                uid: req.body.uid,
                OfficeName: req.body.OfficeName,
                createdAt: new Date(),
                date: product.date,
                PaymentType: req.body?.PaymentType
            });
            await safe.save();
        }

        // Send WhatsApp with Ticket Details
        await sendWhatsAppMessage(req.body.phone, req.body, ticketNumber);

        res.status(200).json({ message: "تم حجز الامانة بنجاح", product });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel Secretariat
const CancelSecretariatController = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const passenger = product.deposits.find(p => p._id.equals(req.params.amenity));
        if (!passenger) return res.status(404).json({ message: "Chair not found" });

        // Check
        if (passenger.status === "canceled") {
            return res.status(400).json({ message: "الامانة ملغية مسبقاً" });
        }

        // Cancel
        passenger.status = "canceled";
        await product.save();

        // shortage of the treasury
        let safe = await Safe.findOne({ uid: req.params.uid });
        if (safe) {
            safe.balance -= Number(passenger.NetTicketPrice);
            safe.bank -= passenger.PaymentType === "bank" ? Number(passenger.NetTicketPrice) : 0;
            safe.cash -= passenger.PaymentType === "cash" ? Number(passenger.NetTicketPrice) : 0;
            safe.lastUpdated = new Date();
            safe.amount = Number(passenger?.NetTicketPrice);
            safe.transactions.push({
                ProcessName: 'حذف مقعد',
                type: "removes",
                amount: Number(passenger?.NetTicketPrice),
                description: "تم حذف الامانة بنجاح",
                uid: passenger.uid,
                OfficeName: product.OfficeName,
                createdAt: new Date(),
                date: product.date,
                PaymentType: passenger?.PaymentType
            });
            await safe.save();
        }

        // Send WhatsApp with Ticket Details
        await sendWhatsAppMessage(passenger.phone, passenger, passenger.ticketNumber);

        res.status(200).json({ message: "تم حذف المقعد بنجاح", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Amenities Controller
const GetAmenitiesController = async (req, res) => {
    try {
        const results = await Product.find().select("deposits");

        // 
        const allReservations = results.flatMap(bus => bus.deposits);

        res.status(200).json(allReservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Filter reservations without grouping by bus
const GetFilterAmenities = async (req, res) => {
    try {
        const uid = req.params.id;

        const results = await Product.find({
            "deposits.uid": uid
        }).select("deposits");


        const matchedDeposits = results.flatMap(product =>
            product.deposits.filter(p => p.uid === uid)
        );

        res.status(200).json(matchedDeposits);
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ message: err.message });
    }
};



// Export the model
module.exports = {
    AddToProductController,
    GetProductsController,
    GetProductByIdController,
    ReserveSeatController,
    FilterDate,
    GetAllReservations,
    GetForFilterOfficeName,
    GetFilterReservations,
    ReserveSecretariatController,
    GetAmenitiesController,
    GetFilterAmenities,
    DeleteChairController,
    CancelSecretariatController,
    EditTripController,
    DeleteTripController,
}