const router = require('express').Router();

const asyncHandler = require('../middleware/asyncHandler');

const {register, login} = require('../controllers/auth');

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));


module.exports = router;