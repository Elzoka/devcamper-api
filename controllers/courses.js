const ErrorResponse = require('../utils/ErrorResponse');
const Course = require('../models/Course');

module.exports = {
    /**
     * @desc    Get all courses
     * @route   GET /api/v1/courses
     * @route   GET /api/v1/bootcamps/:bootcampId/courses
     * @access  Public
    */

    async getCourses(req, res, next){
        let query = {};

        if(req.params.bootcampId){
            query.bootcamp = req.params.bootcampId;
        }

        const courses = await Course.find(query).populate('bootcamp', 'name description');

        res.status(200).json({
            success: true,
            data: {
                courses,
                count: courses.length
            }
        })
    }
}