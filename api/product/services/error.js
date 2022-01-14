'use strict';

const ORDER_REQUEST_ERROR = {
    PRODUCT_NOT_FOUND: 'requestProductNotFound',
    MONEY_NOT_ENOUGH: 'requsetUserPointNotEnough',
    ORDER_NOT_FOUND: 'requestOrderNotFound',
    PRODUCT_QUANTITY_EXCEED: 'requestQuantitiyExceedProductQuantitiy',
    PRODUCT_QUANTITY_SELECT_ZERO: 'reuqestQuantitySelectZero',
    ORDER_DETAIL_GET_ZERO_DATA: 'reqeustOrderDetailZeroData',
};

const errorHandle = {
    [ORDER_REQUEST_ERROR.PRODUCT_NOT_FOUND]: {
        id: 'request.product.data.not.found',
        message: '상품을 찾을 수 없습니다.',
    },
    [ORDER_REQUEST_ERROR.MONEY_NOT_ENOUGH]: {
        id: 'request.user.point.not.enough',
        message: '포인트가 부족합니다.',
    },
    [ORDER_REQUEST_ERROR.ORDER_NOT_FOUND]: {
        id: 'request.order.data.not.found',
        message: '주문을 찾을 수 없습니다.',
    },
    [ORDER_REQUEST_ERROR.PRODUCT_QUANTITY_EXCEED]: {
        id: 'request.order.data.quantity.exceed',
        message: '잔여 재고보다 많은 수량을 선택하셨습니다.',
    },
    [ORDER_REQUEST_ERROR.PRODUCT_QUANTITY_SELECT_ZERO]: {
        id: 'request.order.data.quantity.select.zero',
        message: '1개 이상의 상품을 구매해주세요.',
    },
    [ORDER_REQUEST_ERROR.ORDER_DETAIL_GET_ZERO_DATA]: {
        id: 'request.order.detail.data.zero',
        message: '주문 내역이 없습니다.',
    },
};

const errorHandler = key => {
    return strapi.services.common.errorHandlerV3('product', errorHandle, key);
};
module.exports = {
    ORDER_REQUEST_ERROR,
    errorHandler,
};
