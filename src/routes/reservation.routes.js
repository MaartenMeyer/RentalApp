const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservation.controller');
const AuthController = require('../controllers/authentication.controller')

//router.post('/', AuthController.validateToken, ReservationController.createReservation);
//router.get('/', ReservationController.getAllReservations);
//router.get('/:reservationId', ReservationController.getReservationById);
//router.delete('/:reservationId', AuthController.validateToken, ReservationController.deleteApartmentById);
//router.put('/:reservationId', AuthController.validateToken, ReservationController.updateReservationById);

module.exports = router;