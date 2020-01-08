const express = require('express');

const {getCourses, getCourse, addCourse, updateCourse, deleteCourse} = require('../controllers/courses');
const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth');

const Course = require('../models/Course');


const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }) , getCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);


module.exports = router;