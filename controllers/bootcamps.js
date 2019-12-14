module.exports = {
    /**
     * @desc    Get all bootcamps
     * @route   GET /api/v1/bootcamps
     * @access  Public
     */
    getBootcamps(req, res, next) {
        res.status(200).json({success: true, msg: 'Show all bootcamps'});
    },
    /**
     * @desc    Get single bootcamp
     * @route   GET /api/v1/bootcamps/:id
     * @access  Public
     */
    getBootcamp(req, res, next) {
        res.status(200).json({success: true, msg: `bootcamp with id ${req.params.id}`});
    },
    /**
     * @desc    Create new bootcamp
     * @route   POST /api/v1/bootcamps
     * @access  Private
     */
    createBootcamp(req, res, next) {
        res.status(200).json({success: true, msg: `created`});
    },
    /**
     * @desc    Update bootcamp
     * @route   PUT /api/v1/bootcamps/:id
     * @access  Private
     */
    updateBootcamp(req, res, next) {
        res.status(200).json({success: true, msg: `updated`});
    },
    /**
     * @desc    delete bootcamp
     * @route   DELETE /api/v1/bootcamps
     * @access  Private
     */
    deleteBootcamp(req, res, next) {
        res.status(200).json({success: true, msg: `deleted`});
    },
}