'use strict';

const orderLog = async (
    user_id,
    type,
    product_code,
    order_code,
    product_point,
    user_point,
    balance,
    product_quantity,
    error_log,
    product_name,
    refund,
) => {
    const createOrderLog = strapi.query('orderlog').create({
        user_id,
        type,
        product_code,
        order_code,
        product_point,
        user_point,
        balance,
        product_quantity,
        error_log,
        product_name,
        refund,
    });
    return createOrderLog;
};

const findUserPoint = async userId => {
    const user = await strapi.query('people').findOne({ id: userId });
    return user.point;
};

const findUser = async userId => strapi.query('people').findOne({ id: userId });

const findProduct = async productCode =>
    strapi.query('product').findOne({ product_code: productCode });

const updateUserPoint = async (userId, updatePoint) =>
    strapi.query('people').update(
        {
            id: userId,
        },
        {
            point: updatePoint,
        },
    );

const updateProductQuantity = async (productId, productQuantity) =>
    strapi.query('product').update(
        {
            id: productId,
        },
        {
            quantity: productQuantity,
        },
    );

const createOrderUser = async (userId, address, receiverName, receiverPhone) =>
    strapi.query('orderuser').create({
        people_id: userId,
        address: address,
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
    });

const createOrderDetail = async (
    productId,
    userOrderId,
    status,
    orderNumber,
    productQuantity,
) =>
    strapi.query('orderdetail').create({
        product_id: productId,
        orderuser_id: userOrderId,
        order_status: status,
        order_number: orderNumber,
        product_quantity: productQuantity,
    });

module.exports = {
    orderLog,
    findUserPoint,
    findUser,
    findProduct,
    updateUserPoint,
    updateProductQuantity,
    createOrderUser,
    createOrderDetail,
};
