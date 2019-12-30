const ErrorResponse = require('../utils/ErrorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

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
    },

    /**
     * @desc    Get a single courses
     * @route   GET /api/v1/courses/:id
     * @access  Public
    */

    async getCourse(req, res, next){
        const course = await Course.findById(req.params.id).populate('bootcamp', 'name description');

        if(!course){
            throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
        }

        res.status(200).json({
            success: true,
            data: {
                course
            }
        })
    },
    /**
     * @desc    Add a courses
     * @route   POST /api/v1/bootcamps/:bootcampId/courses
     * @access  Private
    */
    async addCourse(req, res, next){
        req.body.bootcamp = req.params.bootcampId;

        const bootcamp = Bootcamp.findById(req.params.bootcampId, '');

        if(!bootcamp){
            throw new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404);
        }

        const course = await Course.create(req.body);

        res.status(201).json({success: true, data: { course }});
    },
    /**
     * @desc    Update a courses
     * @route   PUT /api/v1/courses/:id
     * @access  Private
    */
    async updateCourse(req, res, next){
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        });

        if(!course){
            throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
        }

        res.status(200).json({success: true, data: { course }});
    },
    /**
     * @desc    Delete a courses
     * @route   DELETE /api/v1/courses/:id
     * @access  Private
    */
    async deleteCourse(req, res, next){
        const course = await Course.findById(req.params.id, '');

        console.log(course);
        if(!course){
            throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
        }

        await course.remove();

        res.status(200).json({success: true, data: { }});
    },
}