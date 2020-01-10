const crypto = require('crypto');

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');

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

        sendTokenResponse(user, 201, res);
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

        sendTokenResponse(user, 200, res);
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
    }),
     /**
     * @desc   Forget password
     * @route  POST /api/v1/auth/forgotpassword
     * @access Public
     */
    forgotPassword: asyncHandler(async (req, res, any) => {
        const user = await User.findOne({email: req.body.email}, 'email resetPasswordToken resetPasswordExpire');

        if(!user){
            throw new ErrorResponse(`There is no user with that email`, 404);
        }

        // get reset token
        const resetToken = user.getResetPasswordToken();
        
        await user.save({validateBeforeSave: false});

        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
        const message = `You are recieving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message
            });

            res.status(200).json({
                success: true,
                data: {
                    message: 'Email Sent'
                }
            });

        } catch (err){
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({validateBeforeSave: false});

            throw new ErrorResponse(`Email could not be sent`, 500);
        }
    }),
    /**
     * @desc   Reset password
     * @route  POST /api/v1/resetpassword/:resetToken
     * @access Public
     */
    resetPassword: asyncHandler(async (req, res, any) => {
        // Get hased token
        const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
        const user = await User.findOne({resetPasswordToken: resetToken, resetPasswordExpire: { $gt: Date.now() }});

        if(!user){
            throw new ErrorResponse(`Invalid Token`, 400);
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        
        sendTokenResponse(user, 200, res);
    }),
}

// Get token form model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
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