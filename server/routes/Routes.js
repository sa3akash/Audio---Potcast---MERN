const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/authController")
const ActivateController = require("../controllers/activateController")
const AuthMiddlewares = require("../middlewares/authMiddlewares");
const roomsControllser = require('../controllers/roomsControllser');


// authController routes is here
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/activate', AuthMiddlewares, ActivateController.activate);
router.get('/refresh', AuthController.refresh);
router.post('/logout', AuthMiddlewares, AuthController.logout);
router.post('/rooms', AuthMiddlewares, roomsControllser.create);
router.get('/rooms', AuthMiddlewares, roomsControllser.getAllRooms);
router.get('/room/:roomId', AuthMiddlewares, roomsControllser.getRoom);




module.exports = router;