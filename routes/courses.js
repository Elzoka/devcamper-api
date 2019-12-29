const express = require('express');

const {getCourses} = require('../controllers/courses');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router({mergeParams: true});

router.route('/').get(asyncHandler(getCourses));


module.exports = router;