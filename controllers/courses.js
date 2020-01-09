const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

module.exports = {
    /**
     * @desc    Get all courses
     * @route   GET /api/v1/courses
     * @route   GET /api/v1/bootcamps/:bootcampId/courses
     * @access  Public
    */

    getCourses: asyncHandler(async (req, res, next) => {
        if(req.params.bootcampId){
            const courses = await Course.find({bootcamp: req.params.bootcampId}).populate('bootcamp', 'name description');
            
            return res.status(200).json({
                success: true,
                data: {
                    count: courses.length,
                    courses
                }
            })
        }

        res.status(200).json(res.advancedResults);
    }),

    /**
     * @desc    Get a single courses
     * @route   GET /api/v1/courses/:id
     * @access  Public
    */

    getCourse: asyncHandler(async (req, res, next) => {
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
    }),
    /**
     * @desc    Add a courses
     * @route   POST /api/v1/bootcamps/:bootcampId/courses
     * @access  Private
    */
    addCourse: asyncHandler(async (req, res, next) => {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId, 'user');

        if(!bootcamp){
            throw new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404);
        }

        // make sure user is bootcamp user
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            throw new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`);
        }

        const course = await Course.create(req.body);

        res.status(201).json({success: true, data: { course }});
    }),
    /**
     * @desc    Update a courses
     * @route   PUT /api/v1/courses/:id
     * @access  Private
    */
    updateCourse: asyncHandler(async (req, res, next) => {
        let course = await Course.findById(req.params.id, 'user');

        if(!course){
            throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
        }

        // make sure user is bootcamp user
        if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
            throw new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`);
        }

        course = await Course.findByIdAndUpdate(course.id, req.body, {
            runValidators: true,
            new: true
        });

        res.status(200).json({success: true, data: { course }});
    }),
    /**
     * @desc    Delete a courses
     * @route   DELETE /api/v1/courses/:id
     * @access  Private
    */
    deleteCourse: asyncHandler(async (req, res, next) => {
        const course = await Course.findById(req.params.id, 'user');

        if(!course){
            throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
        }

         // make sure user is bootcamp user
         if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
            throw new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`);
        }

        await course.remove();

        res.status(200).json({success: true, data: { }});
    }),
}