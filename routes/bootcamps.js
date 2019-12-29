const express = require('express');

const {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius} = require('../controllers/bootcamps');
const asyncHandler = require('../middleware/asyncHandler');

// Include other resourse routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(asyncHandler(getBootcampsInRadius));

router
    .route('/')
    .get(asyncHandler(getBootcamps))
    .post(asyncHandler(createBootcamp));

router
    .route('/:id')
    .get(asyncHandler(getBootcamp))
    .put(asyncHandler(updateBootcamp))
    .delete(asyncHandler(deleteBootcamp));

module.exports = router;