const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const User = require('../models/User');

module.exports = {
    /**
     * @desc   Register user
     * @route  POST /api/v1/auth/register
     * @access Public
     */

    register: asyncHandler(async (req, res, next) => {
        const {name, email, password, role} = req.body;

        // Create user
        const user = await User.create({name, email, password, role});

        sentTokenResponse(user, 201, res);
    }),
      /**
     * @desc   login user
     * @route  POST /api/v1/auth/login
     * @access Public
     */

    login: asyncHandler(async (req, res, next) => {
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

        sentTokenResponse(user, 200, res);
    }),

     /**
     * @desc   get current logged in user
     * @route  POST /api/v1/auth/me
     * @access Private
     */
    getMe: asyncHandler(async (req, res, any) => {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    })
}

// Get token form model, create cookie and send response
const sentTokenResponse = (user, statusCode, res) => {
    const token = user.getAuthToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({success: true, data: {token}});
}