const getStatusMessage = (statusCode: number): string => {
    switch (statusCode) {
        case 401: return "Unauthorized";
        case 404: return "Not Found";
        case 422: return "Unprocessable Entity";
        default: return "Internal Server Error";
    }
}

export const createServerError = <T>(statusCode: number, message?: string, errorObject?: T) => {
    const statusMessage = getStatusMessage(statusCode);
    return createError({
        statusCode,
        statusMessage,
        data: {
            message: message || "Internal Server Error",
            error: true,
            errorDetails: errorObject
        }
    });
}

export class AppError<T> extends Error {
    statusCode: number;
    statusMessage: string;
    errorObject?: T;

    constructor(statusCode: number, message: string, errorObject?: T) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        this.statusMessage = getStatusMessage(this.statusCode);
        this.errorObject = errorObject;
        Error.captureStackTrace(this);
    }
};