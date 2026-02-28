export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 400);
    }
}
