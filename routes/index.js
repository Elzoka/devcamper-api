const express = require('express');
const router = express.Router();

const bootcampsRoutes = require('./bootcamps');
router.use('/api/v1/bootcamps', bootcampsRoutes);

module.exports = router;