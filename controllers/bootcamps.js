const ErrorResponse = require('../utils/ErrorResponse');
const Bootcamp = require('../models/Bootcamp');

const geocoder = require('../utils/geocoder');


module.exports = {
    /**
     * @desc    Get all bootcamps
     * @route   GET /api/v1/bootcamps
     * @access  Public
     */
    async getBootcamps(req, res, next) {
        // remove the select query
        const reqQuery = {...req.query};
        const fieldsToRemove = ['select', 'sort', 'page', 'limit'];
        fieldsToRemove.forEach(param => delete reqQuery[param]);
        
        // create operators ($gte, $gt, etc...)
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);


        const query = Bootcamp.find(JSON.parse(queryStr));

        // select query
        if(req.query.select){
            const selectedFields = req.query.select.replace(/[, ]/g, match => match === ',' ? ' ': '');
            query.select(selectedFields);
        }

        // Sorting
        const sortBy = !req.query.sort ? '-createdAt' : req.query.sort.replace(/[, ]/g, match => match === ',' ? ' ': '');
        query.sort(sortBy);
        

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query.skip(startIndex).limit(limit);

        // execute query
        const bootcamps = await query;

        // Pagination result
        const pagination = {
            next: endIndex < total ? page + 1 : null,
            prev: startIndex > 0 ? page - 1 : null,
            limit
        };

        res.status(200).json({success: true, data: {bootcamps, count: bootcamps.length, pagination}});
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