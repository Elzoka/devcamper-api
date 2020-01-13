const router = require('express').Router();
const {register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

// Public
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Private
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;