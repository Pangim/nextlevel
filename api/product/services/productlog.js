'use strict';

const orderLog = async (user_id, type, product_code, order_code, product_point, user_point, balance, product_quantity, errorlog, product_name, refund) => {
    const createOrderLog = strapi.query('orderlog').create({
        user_id: user_id,
        type: type,
        product_code: product_code,
        order_code: order_code,
        product_point: product_point,
        user_point: user_point,
        balance: balance,
        product_quantity: product_quantity,
        error_log: errorlog,
        product_name: product_name,
        refund
    })
    return createOrderLog
}
module.exports = {orderLog};