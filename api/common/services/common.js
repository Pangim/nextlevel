const responseParser = (data, status) => {
    return {
        statusCode: status,
        data: data
    }
}

const errorHandlerV3 = (api, errorHandle, message) => {
    const error = errorHandle[message]
    if (!error) {
        return {
            id: `Out.of.control.error`,
            message,
            api
        }
    }

    return error
}

module.exports = { errorHandlerV3, responseParser }