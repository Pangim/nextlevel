'use strict';

const REQUEST_CATEGORY_ERROR = {
    NOT_FOUND_PRODUCTS: 'requestNamePageQueryNotFoundProductsData',
    NOT_FOUND_PRODUCT: 'requestParamsNotFoundProductCodeData',
};

const errorHandle = {
    [REQUEST_CATEGORY_ERROR.NOT_FOUND_PRODUCTS]: {
        id: 'request.data.products.name.page.query.not.found',
        message: '조건에 맞는 상품을 찾을 수 없습니다.',
    },
    [REQUEST_CATEGORY_ERROR.NOT_FOUND_PRODUCT]: {
        id: 'request.data.product.code.params.not.found',
        message: '존재하지 않는 상품입니다.',
    },
};

const errorHandler = key => {
    return strapi.services.common.errorHandlerV3('category', errorHandle, key);
};

module.exports = {
    errorHandler,
    REQUEST_CATEGORY_ERROR,
};
