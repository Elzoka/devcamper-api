const ErrorResponse = require('../utils/ErrorResponse');

const User = require('../models/User');

module.exports = {
    /**
     * @desc   Register user
     * @route  POST /api/v1/auth/register
     * @access Public
     */

    async register(req, res, next){
        const {name, email, password, role} = req.body;

        // Create user
        const user = await User.create({name, email, password, role});

        const token = user.getAuthToken();
        res.status(201).json({success: true, data: {token}});
    },
      /**
     * @desc   login user
     * @route  POST /api/v1/auth/login
     * @access Public
     */

    async login(req, res, next){
        const {email, password} = req.body;

        // Validate email & password
        if(!email || !password){
            throw new ErrorResponse('Please Provide an email and password', 400);
        }

        // Check for user
        const user = await User.findOne({email}, 'email password');

        if(!user){
            throw new ErrorResponse('Invalid credentials', 401);
        }

        // check if password matches
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            throw new ErrorResponse('Invalid credentials', 401);
        }

        const token = user.getAuthToken();

        res.status(200).json({success: true, data: {token}});
    }
}