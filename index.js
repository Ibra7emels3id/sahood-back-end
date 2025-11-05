const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Dotenv
dotenv.config();

// Connect DB
const connectDB = require('./db/ConnectDB.js');
connectDB();

// Routers
const AllProducts = require('./Router/ProductRouter.js');
const RouterExpenses = require('./Router/ExpensesRouter.js');
const SafeRouter = require('./Router/SafeRouter.js');
const { default: OutBookingRouter } = require('./Router/OutBookingRouter.js');

// Middlewares
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', AllProducts);
app.use('/api', RouterExpenses);
app.use('/api', SafeRouter);
app.use('/api', OutBookingRouter);

// Route to check if the server is running
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>Application is running</h1>');
});

// Listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});