const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    // log to console for dev
    console.log(err.stack.red);

    let error = {...err};
    error.message = err.message;

    if(err.name === 'CastError'){
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }
    // Mongoose duplicate key
    if(error.code === 11000) {
        const message = 'Duplidate field value entered';
        error = new ErrorResponse(message, 400); 
    }

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res
    .status(error.statusCode || 500)
    .json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;  