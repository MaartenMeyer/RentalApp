const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authentication.controller');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/users', AuthController.getAll);

module.exports = router;