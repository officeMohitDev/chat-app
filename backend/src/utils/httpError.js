function createHttpError(status, message) {
    let error = new Error();
    error.statusCode = status
    error.message = message
    return error
}

export default createHttpError;
