const express = require('express');
const router = express.Router();
const ApartmentController = require('../controllers/apartment.controller');
//const AuthController = require('../controllers/authentication.controller')

//router.post('/', AuthController.validateToken, ApartmentController.CreateApartment);
router.get('/', ApartmentController.getAllApartments);
router.get('/:id', ApartmentController.getApartmentById);
//router.delete('/:id', AuthController.validateToken, ApartmentController.deleteApartmentById);

module.exports = router;