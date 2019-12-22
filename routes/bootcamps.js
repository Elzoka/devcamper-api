const express = require('express');

const {getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius} = require('../controllers/bootcamps');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

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