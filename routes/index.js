const express = require('express');
const router = express.Router();

const bootcampsRoutes = require('./bootcamps');
const coursesRoutes = require('./courses');

router.use('/bootcamps', bootcampsRoutes);
router.use('/courses', coursesRoutes);

module.exports = router;