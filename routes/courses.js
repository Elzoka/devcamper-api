const express = require('express');

const {getCourses, getCourse, addCourse, updateCourse, deleteCourse} = require('../controllers/courses');
const asyncHandler = require('../middleware/asyncHandler');
const advancedResults = require('../middleware/advancedResults');

const Course = require('../models/Course');


const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }) , asyncHandler(getCourses))
    .post(asyncHandler(addCourse));

router
    .route('/:id')
    .get(asyncHandler(getCourse))
    .put(asyncHandler(updateCourse))
    .delete(asyncHandler(deleteCourse));


module.exports = router;