const jwt = require('jsonwebtoken');

const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect routes
module.exports = {
    protect: asyncHandler(async (req, res, next) => {
        let token;
        const headerToken = req.headers.authorization;
        const cookieToken = req.cookies.token;

        if(headerToken && headerToken.startsWith('Bearer')){
            token = headerToken.split(' ')[1];
        }else if(cookieToken){
            token = cookieToken;
        }

        // Make sure token exists
        if(!token){
            throw new ErrorResponse('Not authorized to access this route', 401);
        }

        try {
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id, 'role');

            if(!user){
                throw new Error();
            }

            req.user = user;

            next();
        }catch (err) {
            throw new ErrorResponse('Not authorized to access this route', 401);
        }

    }),

    // Grant access to specific roles
    authorize(...roles){
        return (req, res, next) => {
            if(!roles.includes(req.user.role)){
                throw new ErrorResponse(`User role (${req.user.role}) is not authorized to access this route`, 403);
            }

            next();
        }
    }
}