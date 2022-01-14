'use strict';

const errorHandle = {};

const errorHandler = key => {
    return strapi.services.common.errorHandlerV3('token', errorHandle, key);
};
module.exports = { errorHandler };
