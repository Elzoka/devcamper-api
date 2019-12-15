const Bootcamp = require('../models/Bootcamps');

module.exports = {
    /**
     * @desc    Get all bootcamps
     * @route   GET /api/v1/bootcamps
     * @access  Public
     */
    async getBootcamps(req, res, next) {
        try {
            const bootcamps = await Bootcamp.find({});
            res.status(200).json({success: true, data: {bootcamps, count: bootcamps.length}});
        }catch(err) {
            res.status(400).json({success: false});
        }
    },
    /**
     * @desc    Get single bootcamp
     * @route   GET /api/v1/bootcamps/:id
     * @access  Public
     */
    async getBootcamp(req, res, next) {
        try {
            const bootcamp = await Bootcamp.findById(req.params.id);
            if(!bootcamp) throw new Error();

            res.status(200).json({success: true, data: {bootcamp}});

        }catch(err){
            res.status(400).json({success: false});
        }
    },
    /**
     * @desc    Create new bootcamp
     * @route   POST /api/v1/bootcamps
     * @access  Private
     */
    async createBootcamp(req, res, next) {
        try {
            const bootcamp = await Bootcamp.create(req.body)
            res.status(201).json({success: true, data: {bootcamp}});
        }catch(err){
            res.status(400).json({success: false})
        }

    },
    /**
     * @desc    Update bootcamp
     * @route   PUT /api/v1/bootcamps/:id
     * @access  Private
     */
    async updateBootcamp(req, res, next) {
        try{
            const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    
            if(!bootcamp) throw new Error();
    
            res.status(200).json({success: true, data: {bootcamp}});
        }catch(err){
            res.status(400).json({ success: false });
        }
    },
    /**
     * @desc    delete bootcamp
     * @route   DELETE /api/v1/bootcamps
     * @access  Private
     */
    async deleteBootcamp(req, res, next) {
        try{
            const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
            if(!bootcamp) throw new Error();
    
            res.status(200).json({success: true, data: {}});
        }catch(err){
            res.status(400).json({ success: false });
        }
    },
}