

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}


const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err?.message;



    if (err.name === 'ValidationError') {
        const message = `${err.message}`;
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = `${err.message}`;
        error = new ErrorResponse(message, 403);
    }

    if (err.name === 'AuthorizationError') {
        const message = `${err.message}`;
        error = new ErrorResponse(message, 401);
    }

    return res.status(error.statusCode || 500).json({
        code: error.statusCode || 500,
        error: err.name || 'Server Error',
        data: null,
        message: error.message
    });
};

module.exports = errorHandler;
