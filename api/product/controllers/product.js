'use strict';

const { responseParser } = require('../../common/services/common')
const { ORDER_REQUEST_ERROR, errorHandler } = require('../services/error')
const {
    orderLog,
    findUserPoint,
    findUser,
    findProduct,
    updateUserPoint,
    updateProductQuantity,
    createOrderUser,
    createOrderDetail
} = require('../services/product')

const postOrder = async ctx =>{
    const {
        address,
        receiver_name,
        receiver_phone,
        product_code,
        product_quantity
    } = ctx.request.body
    const {
        PRODUCT_NOT_FOUND,
        MONEY_NOT_ENOUGH,
        PRODUCT_QUANTITY_EXCEED,
        PRODUCT_QUANTITY_SELECT_ZERO
    } = ORDER_REQUEST_ERROR
    const userId = ctx.request.user.id
    const userPoint = await findUserPoint(userId)
    const product = await findProduct(product_code)
    const refund = '환불 미정'

    try{
        if (product === null) throw Error(PRODUCT_NOT_FOUND)
        if (product_quantity <= 0) throw Error(PRODUCT_QUANTITY_SELECT_ZERO)
        if (product.quantity < product_quantity) throw Error(PRODUCT_QUANTITY_EXCEED)
        if (userPoint < product_quantity * product.price) throw Error(MONEY_NOT_ENOUGH)
        
        const productTotalPrice = product_quantity * product.price
        const ProductTotalQuantity = product.quantity - product_quantity

        if (productTotalPrice <= userPoint){
            const userBalancePoint = await userPoint - productTotalPrice
            const orderType = '주문'

            await updateUserPoint(userId, userBalancePoint)
            await createOrderUser(userId, address, receiver_name, receiver_phone)
            await updateProductQuantity(product.id, ProductTotalQuantity)

            const orderUser = await findUser(userId)
            const userLastArrayLength = await orderUser.orderuser_id.length - 1
            const orderUser_id = await orderUser.orderuser_id[userLastArrayLength].id
            const orderNumber = `${product_code}${orderUser_id}`
            const orderStatus = '주문 완료'

            await createOrderDetail(product.id, orderUser.id, orderStatus, orderNumber, product_quantity)
            await orderLog(
                userId,
                orderType,
                product_code,
                orderNumber,
                product.price,
                userPoint,
                userBalancePoint,
                product_quantity,
                null,
                product.name,
                refund
            )
            return responseParser({
                message: '주문 성공'  
            }, 200)
        }
     }catch (error) {
        const userPoint = null
        const errorType = '주문 실패'
        const order_number = null
        const balance = null
        const product = null

        console.log(error)
        orderLog(
            userId,
            errorType,
            product_code,
            order_number,
            product,
            userPoint,
            balance,
            product_quantity,
            error.message
        )
        return ctx.badRequest(errorHandler(error.message))
    }
}

const getOrderDetail = async ctx => {
    const userId = ctx.request.user.id
    const { ORDER_DETAIL_GET_ZERO_DATA } = ORDER_REQUEST_ERROR
    const orderType = '주문'
    const refund = '환불 미정'
    const userLogs = await strapi.query('orderlog').find({user_id: userId, type: orderType, refund: refund})

    try {
        if (userLogs.length === 0) throw Error(ORDER_DETAIL_GET_ZERO_DATA)

        const orderDetials = userLogs.map( userLog => {
                return { 
                    "주문 상태": userLog.type,
                    "주문 번호": userLog.order_code,
                    "상품 이름": userLog.product_name,
                    "상품 가격": userLog.product_point,
                    "상품 개수": userLog.product_quantity,
                    "총 가격": userLog.product_point * userLog.product_quantity
                }
            })
        return responseParser({orderDetials}, 200)
    } catch(error) {
        console.log(error)
        return ctx.badRequest(errorHandler(error.message))
    }
}

const patchRefund = async ctx => {
    const userId = ctx.request.user.id
    const orderCodeParam = ctx.params.order_code
    const { ORDER_NOT_FOUND } = ORDER_REQUEST_ERROR
    const orderCode = await strapi.query('orderlog').findOne({user_id: userId, order_code: orderCodeParam, refund: '환불 미정'})
    const userPoint = await findUserPoint(userId)
    const orderType = '환불'
    const refund = '환불 완료'

    try {
        if(orderCode === null) throw Error(ORDER_NOT_FOUND)
        const product = await strapi.query('product').findOne({product_code: orderCode.product_code})
        const productTotalPrice = product.price * orderCode.product_quantity
        const userBalancePoint = productTotalPrice + userPoint
        const productTotalQuantity = orderCode.product_quantity + product.quantity

        await updateUserPoint(userId, userBalancePoint)
        await updateProductQuantity(product.id, productTotalQuantity)
        await strapi.query('orderlog').update({
            id: orderCode.id
        },
        {
            refund
        })
        orderLog(
            userId,
            orderType,
            product.product_code,
            orderCode.order_code,
            product.price,
            userPoint,
            userBalancePoint,
            orderCode.product_quantity,
            null,
            product.name,
            refund
        )
        return responseParser({
            message: '환불 되었습니다.',
            '주문 번호': orderCode.order_code,
            '상품 이름': product.name,
            '상품 가격': product.price,
            '구매한 개수': orderCode.product_quantity,
            '총 가격': productTotalPrice,
            '기존 포인트': userPoint,
            '환불 후 포인트': userBalancePoint
        }, 200)

    } catch(error) {
        const refundType = '환불 실패'

        console.log(error)
        orderLog(
            userId,
            refundType,
            orderCodeParam,
            null,
            null,
            null,
            null,
            null,
            error.message,
            null,
            null
        )
        return ctx.badRequest(errorHandler(error.message))
    }
}

const getMyLog = async ctx => {
    const userId = ctx.request.user.id
    const orderLogData = await strapi.query('orderlog').find({user_id: userId})

    return responseParser({orderLogData},200)
}

module.exports = {
    postOrder,
    getOrderDetail,
    patchRefund,
    getMyLog
};
