const path = require('path');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Bootcamp = require('../models/Bootcamp');

const geocoder = require('../utils/geocoder');


module.exports = {
    /**
     * @desc    Get all bootcamps
     * @route   GET /api/v1/bootcamps
     * @access  Public
     */
    getBootcamps: asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults);
    }),
    /**
     * @desc    Get single bootcamp
     * @route   GET /api/v1/bootcamps/:id
     * @access  Public
     */
    getBootcamp: asyncHandler(async (req, res, next) => {       
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);
        };

        res.status(200).json({success: true, data: {bootcamp}});
    }),
    /**
     * @desc    Create new bootcamp
     * @route   POST /api/v1/bootcamps
     * @access  Private
     */
    createBootcamp: asyncHandler(async (req, res, next) => {
        // add user id to bootcamp stored in req.body
        req.body.user = req.user.id;

        // Check for published bootcamps
        const publishedBootcamp = await Bootcamp.findOne({user: req.user.id}, 'id');
        
        // If the user is not an admin, they can only add one bootcamp
        if(publishedBootcamp && req.user.role !== "admin"){
            throw new ErrorResponse(`User with ID ${req.user.id} has already published a bootcamp`, 400);
        }

        // create bootcamp
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({success: true, data: {bootcamp}});
    }),
    /**
     * @desc    Update bootcamp
     * @route   PUT /api/v1/bootcamps/:id
     * @access  Private
     */
    updateBootcamp: asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id, 'id user');

        if(!bootcamp) throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);

        // Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
            throw new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401);
        }

        const newBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

       res.status(200).json({success: true, data: {bootcamp: newBootcamp}});
    
    }),
    /**
     * @desc    delete bootcamp
     * @route   DELETE /api/v1/bootcamps/:id
     * @access  Private
     */
    deleteBootcamp: asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id, 'id user');

        if(!bootcamp) throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);

        // Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
            throw new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401);
        }

        bootcamp.remove();
        
        res.status(200).json({success: true, data: {}});
    }),
    /**
     * @desc    get bootcamps within a radius
     * @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
     * @access  Private
     */
    getBootcampsInRadius: asyncHandler(async (req, res, next) => {
        const { zipcode, distance } = req.params;
        
        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(zipcode);
        const {latitude, longitude} = loc[0];

        // Calc radius using radians
        // Divide dist by radius of Earth
        // Earth radius = 3,963 mi / 6,378 km

        const radius = distance / 3963;

        const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [ [longitude, latitude], radius ] } }
        });

        res.status(200).json({success: true, data: {
            count: bootcamps.length,
            bootcamps
        }})
    }),
    /**
     * @desc    Upload photo for bootcamp
     * @route   PUT /api/v1/bootcamps/:id/photo
     * @access  Private
     */
    bootcampPhotoUpload: asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id, '_id, user');

        if(!bootcamp) throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);

        // Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
            throw new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401);
        }

        if(!req.files) throw new ErrorResponse(`Please upload an image file`, 400);
        
        const {file} = req.files;

        // Make sure the file is a photo
        if(!file.mimetype.startsWith('image')){
            throw new ErrorResponse(`Please upload an image file`, 400);
        }

        // Check filesize
        if(file.size > process.env.MAX_FILE_UPLOAD) {
            throw new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400);
        }

        // Create custom filename
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
        
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                console.error(err);
                return next(new ErrorResponse(
                    `Problem with file upload`,
                    500
                ));
            }

            await Bootcamp.updateOne({_id: bootcamp.id}, {photo: file.name});

            res.status(200).json({
                success: true,
                data: {fileName: file.name}
            })
        });
    })
}