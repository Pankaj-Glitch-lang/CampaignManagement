const express = require('express');
const { loginAdmin, registerAdmin } = require('../controllers/admin.conroller');
const router = express.Router();


router.post('/register', registerAdmin);
router.post('/login',loginAdmin);

module.exports = router;
