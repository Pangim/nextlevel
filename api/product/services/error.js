'use strict'

const ORDER_REQUEST_ERROR = {
    PRODUCT_NOT_FOUND: 'requestProductNotFound',
    MONEY_NOT_ENOUGH: 'requsetUserPointNotEnough',
    ORDER_NOT_FOUND: 'requestOrderNotFound'
}

const errorHandle = {
    [ORDER_REQUEST_ERROR.PRODUCT_NOT_FOUND]: {
        id: 'request.product.data.not.found',
        message: '상품을 찾을 수 없습니다.'
    },
    [ORDER_REQUEST_ERROR.MONEY_NOT_ENOUGH]: {
        id: 'request.user.point.not.enough',
        message: '포인트가 부족합니다.'
    },
    [ORDER_REQUEST_ERROR.ORDER_NOT_FOUND]: {
        id: 'request.order.data.not.found',
        message: '주문을 찾을 수 없습니다..'
    }
}

const errorHandler = key => {
    return strapi.services.common.errorHandlerV3('product', errorHandle, key)
}
module.exports = { ORDER_REQUEST_ERROR, errorHandler }
