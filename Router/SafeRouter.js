const express = require('express');
const { GetDataSafe, GetDataSafeByUid, AddReceiptTheSafe, AddBillExchange } = require('../Controllers/SafeControll');
const SafeRouter = express.Router();

SafeRouter.get('/get-safe', GetDataSafe);
SafeRouter.get('/get-safe/:uid', GetDataSafeByUid);
SafeRouter.put('/receipt-voucher/:uid', AddReceiptTheSafe);
SafeRouter.put('/bill-exchange/:uid', AddBillExchange);

module.exports = SafeRouter;