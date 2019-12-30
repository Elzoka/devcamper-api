const express = require('express');

const {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload} = require('../controllers/bootcamps');
const asyncHandler = require('../middleware/asyncHandler');
const advancedResults = require('../middleware/advancedResults');

const Bootcamp = require('../models/Bootcamp');

// Include other resourse routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(asyncHandler(getBootcampsInRadius));

router
    .route('/:id/photo')
    .put(asyncHandler(bootcampPhotoUpload));

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses') , asyncHandler(getBootcamps))
    .post(asyncHandler(createBootcamp));

router
    .route('/:id')
    .get(asyncHandler(getBootcamp))
    .put(asyncHandler(updateBootcamp))
    .delete(asyncHandler(deleteBootcamp));

module.exports = router;