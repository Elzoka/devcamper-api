const express = require('express');

const {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload} = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');

const Bootcamp = require('../models/Bootcamp');

// Include other resourse routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses') , getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;