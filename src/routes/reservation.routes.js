const express = require('express');
const router = express.Router();
const RevervationController = require('../controllers/reservation.controller');
const AuthController = require('../controllers/authentication.controller')

//router.post('/', AuthController.validateToken, ReservationController.createReservation);
//router.get('/', ReservationController.getAllReservations);
//router.get('/:id', ReservationController.getReservationById);
//router.delete('/:id', AuthController.validateToken, ReservationController.deleteApartmentById);
//router.put('/:id', AuthController.validateToken, ReservationController.updateReservationById);

module.exports = router;