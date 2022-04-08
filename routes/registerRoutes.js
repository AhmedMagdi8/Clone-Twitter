const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.get('/' , authController.getRegister);

router.post('/' , authController.postRegister);

module.exports = router;
