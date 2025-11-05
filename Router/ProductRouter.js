const express = require('express');
const { AddToProductController, GetProductsController, GetProductByIdController, ReserveSeatController, FilterDate, GetAllReservations, GetForFilterOfficeName, GetFilterReservations, ReserveSecretariatController, GetAmenitiesController, GetFilterAmenities, DeleteChairController, CancelSecretariatController, EditTripController, DeleteTripController } = require('../Controllers/Products');
const AllProducts = express.Router();


// Import Controllers
AllProducts.post('/trips', AddToProductController);
AllProducts.get('/trips', GetProductsController);
AllProducts.get('/trips/:id', GetProductByIdController);
AllProducts.put('/trips/edit/:id', EditTripController);
AllProducts.delete('/trips/delete/:id', DeleteTripController);
AllProducts.put('/trips/:id/reserve', ReserveSeatController);
AllProducts.get('/filter-by-current-month', FilterDate);
AllProducts.get('/all-reservations', GetAllReservations);
AllProducts.get("/account/trips/:id", GetForFilterOfficeName);
AllProducts.get("/account/reservations/:id", GetFilterReservations);
AllProducts.put("/account/reservations/secretariat/:id", ReserveSecretariatController);
AllProducts.get("/all-amenities", GetAmenitiesController);
AllProducts.get("/account/amenities/:id", GetFilterAmenities);
AllProducts.delete("/trips/:id/bus-seat/:seat/:uid", DeleteChairController);
AllProducts.delete("/trips/:id/amenities/:amenity/:uid", CancelSecretariatController);




// Export
module.exports = AllProducts;