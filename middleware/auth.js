const jwt = require('jsonwebtoken');

const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect routes
module.exports = {
    protect: asyncHandler(async (req, res, next) => {
        let token;
        const headerToken = req.headers.authorization;
        // const cookieToken = req.cookies.token;

        if(headerToken && headerToken.startsWith('Bearer')){
            token = headerToken.split(' ')[1];
        }
        // else if(cookieToken){
        //     token = cookieToken;
        // }

        // Make sure token exists
        if(!token){
            throw new ErrorResponse('Not authorized to access this route', 401);
        }

        try {
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id, 'id');

            if(!user){
                throw new Error();
            }

            req.user = user;

            next();
        }catch (err) {
            throw new ErrorResponse('Not authorized to access this route', 401);
        }

    })
}