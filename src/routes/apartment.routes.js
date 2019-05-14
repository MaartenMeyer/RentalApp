const express = require('express');
const router = express.Router();
const ApartmentController = require('../controllers/apartment.controller');
const ReservationController = require('../controllers/reservation.controller');
const AuthController = require('../controllers/authentication.controller')

router.post('/', AuthController.validateToken, ApartmentController.createApartment);
router.get('/', ApartmentController.getAllApartments);
router.get('/:apartmentId', ApartmentController.getApartmentById);
router.delete('/:apartmentId', AuthController.validateToken, ApartmentController.deleteApartmentById);
//router.put('/:apartmentId', AuthController.validateToken. ApartmentController.updateApartmentById);

router.post('/:apartmentId/reservations/', AuthController.validateToken, ReservationController.createReservation);
router.get('/:apartmentId/reservations/', ReservationController.getAllReservations);
//router.get('/:reservationId', ReservationController.getReservationById);
//router.delete('/:reservationId', AuthController.validateToken, ReservationController.deleteApartmentById);
//router.put('/:reservationId', AuthController.validateToken, ReservationController.updateReservationById);

module.exports = router;