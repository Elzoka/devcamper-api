const express = require('express');
const router = express.Router();

const bootcampsRoutes = require('./bootcamps');
const coursesRoutes = require('./courses');
const authRoutes = require('./auth');

router.use('/bootcamps', bootcampsRoutes);
router.use('/courses', coursesRoutes);
router.use('/auth', authRoutes);

module.exports = router;