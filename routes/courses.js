const express = require('express');

const {getCourses, getCourse, addCourse} = require('../controllers/courses');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(asyncHandler(getCourses))
    .post(asyncHandler(addCourse));
    
router
    .route('/:id')
    .get(asyncHandler(getCourse));


module.exports = router;