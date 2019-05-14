const express = require('express');
const router = express.Router();
const ApartmentController = require('../controllers/apartment.controller');
const AuthController = require('../controllers/authentication.controller')

router.post('/', AuthController.validateToken, ApartmentController.createApartment);
router.get('/', ApartmentController.getAllApartments);
router.get('/:id', ApartmentController.getApartmentById);
router.delete('/:id', AuthController.validateToken, ApartmentController.deleteApartmentById);
//router.put('/:id', AuthController.validateToken. ApartmentController.updateApartmentById);

module.exports = router;