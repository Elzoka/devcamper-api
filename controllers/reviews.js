const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

module.exports = {
    /**
     * @desc    Get reviews
     * @route   GET /api/v1/reviews
     * @route   GET /api/v1/bootcamps/:bootcampId/reviews
     * @access  Public
    */

   getReviews: asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp: req.params.bootcampId}).populate('bootcamp', 'name description');
        
        return res.status(200).json({
            success: true,
            data: {
                count: reviews.length,
                reviews
            }
        })
    }

        res.status(200).json(res.advancedResults);
    }),
    /**
     * @desc    Get single review
     * @route   GET /api/v1/reviews/:id
     * @access  Public
    */

   getReview: asyncHandler(async (req, res, next) => {
        const review = await Review.findById(req.params.id).populate('bootcamp', 'name description');

        if(!review){
            throw new ErrorResponse(`No review found with the id of ${req.params.id}`, 404);
        }

        res.status(200).json({
            success: true, 
            data: {
                review
            }
        });
    }),
    /**
     * @desc    Add review
     * @route   POST /api/v1/bootcamps/:bootcampId/reviews
     * @access  Private
    */

   addReview: asyncHandler(async (req, res, next) => {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId, 'id');

        if(!bootcamp){
            throw new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404);
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: {
                review
            }
        });
    }),

    /**
     * @desc    Update review
     * @route   PUT /api/v1/reviews/:id
     * @access  Private
    */

   updateReview: asyncHandler(async (req, res, next) => {
        let review = await Review.findById(req.params.id, 'id user');

        if(!review){
            throw new ErrorResponse(`No review with the id of ${req.params.id}`, 404);
        }
        
        // make sure review belongs to user or user is admin
        if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
            throw new ErrorResponse(`Not authorized to update review`, 401);
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        await Review.getAverageRating(review.bootcamp);

        res.status(200).json({
            success: true,
            data: {
                review
            }
        });
    }),
    /**
     * @desc    delete review
     * @route   DELETE /api/v1/reviews/:id
     * @access  Private
    */

   deleteReview: asyncHandler(async (req, res, next) => {
        const review = await Review.findById(req.params.id, 'id user bootcamp');

        if(!review){
            throw new ErrorResponse(`No review with the id of ${req.params.id}`, 404);
        }
        
        // make sure review belongs to user or user is admin
        if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
            throw new ErrorResponse(`Not authorized to update review`, 401);
        }

        await review.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    }),
}