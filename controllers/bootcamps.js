const ErrorResponse = require('../utils/ErrorResponse');
const Bootcamp = require('../models/Bootcamps');

const geocoder = require('../utils/geocoder');


module.exports = {
    /**
     * @desc    Get all bootcamps
     * @route   GET /api/v1/bootcamps
     * @access  Public
     */
    async getBootcamps(req, res, next) {   
        const bootcamps = await Bootcamp.find({});
        res.status(200).json({success: true, data: {bootcamps, count: bootcamps.length}});
    },
    /**
     * @desc    Get single bootcamp
     * @route   GET /api/v1/bootcamps/:id
     * @access  Public
     */
    async getBootcamp(req, res, next) {       
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);
        };

        res.status(200).json({success: true, data: {bootcamp}});
    },
    /**
     * @desc    Create new bootcamp
     * @route   POST /api/v1/bootcamps
     * @access  Private
     */
    async createBootcamp(req, res, next) {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({success: true, data: {bootcamp}});
    },
    /**
     * @desc    Update bootcamp
     * @route   PUT /api/v1/bootcamps/:id
     * @access  Private
     */
    async updateBootcamp(req, res, next) {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!bootcamp) throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);

        res.status(200).json({success: true, data: {bootcamp}});
    
    },
    /**
     * @desc    delete bootcamp
     * @route   DELETE /api/v1/bootcamps
     * @access  Private
     */
    async deleteBootcamp(req, res, next) {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp) throw new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404);
        
        res.status(200).json({success: true, data: {}});
    },
    /**
     * @desc    get bootcamps within a radius
     * @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
     * @access  Private
     */
    async getBootcampsInRadius(req, res, next) {
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
    },
}