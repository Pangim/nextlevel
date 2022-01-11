'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const postOrder = async ctx =>{
    const { address, receiver_name, receiver_phone, product_code, product_quantity } = ctx.request.body
    const { responseParser } = strapi.services.common
    const { ORDER_REQUEST_ERROR, errorHandler } = strapi.services.error
    const { PRODUCT_NOT_FOUND, MONEY_NOT_ENOUGH } = ORDER_REQUEST_ERROR
    const { orderLog } = strapi.services.productlog
    const userId = ctx.request.user.id
    const user = await strapi.query('people').findOne({id : userId})
    const product = await strapi.query('product').findOne({product_code: product_code})
    const refund = '환불 미정'

    try{
        if ( product === null ) throw Error(PRODUCT_NOT_FOUND)
        if (user.point < product_quantity * product.price) throw Error(MONEY_NOT_ENOUGH)
        
        const userPoint = user.point
        const totalPrice = product_quantity * product.price

        if (totalPrice <= user.point){
            const balance = await userPoint - totalPrice
            const type = '주문'

            await strapi.query('people').update({
                id: user.id
            },
            {
                point: balance
            })
            await strapi.query('orderuser').create(
            {
                people_id: user.id,
                address: address,
                receiver_name: receiver_name,
                receiver_phone: receiver_phone
            })
            await strapi.query('product').update({
                id: product.id
            },
            {
                quantity: product.quantity - product_quantity
            })

            const userOrder = await strapi.query('people').findOne({id: user.id})
            const userOrder_id = await userOrder.orderuser_id[userOrder.orderuser_id.length - 1].id
            const order_number = `${product_code}${userOrder_id}`

            await strapi.query('orderdetail').create({
                product_id: product.id,
                orderuser_id: userOrder_id,
                order_status: '주문 완료',
                order_number: `${product_code}${userOrder_id}`,
                product_quantity: product_quantity,
            })

            await orderLog(userId, type, product_code, order_number, product.price, userPoint, balance, product_quantity, null, product.name, refund)
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
        orderLog(userId, errorType, product_code, order_number, product, userPoint, balance, product_quantity, error.message)
        return ctx.badRequest(errorHandler(error.message))
    }
}

const getOrderDetail = async ctx => {
    const userId = ctx.request.user.id
    const { responseParser } = strapi.services.common
    console.log(userId)
    const userLogs = await strapi.query('orderlog').find({user_id: userId, type: '주문'})
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
}

const patchRefund = async ctx => {
    const userId = ctx.request.user.id
    const orderCodeParam = ctx.params.order_code
    const { orderLog } = strapi.services.productlog
    const { responseParser } = strapi.services.common
    const { ORDER_REQUEST_ERROR, errorHandler } = strapi.services.error
    const { ORDER_NOT_FOUND } = ORDER_REQUEST_ERROR
    const orderCode = await strapi.query('orderlog').findOne({user_id: userId, order_code: orderCodeParam, refund: '환불 미정'})
    const user = await strapi.query('people').findOne({id: userId})
    const type = '환불'
    const refund = '환불 완료'

    try {
        if(orderCode === null) {
            throw Error(ORDER_NOT_FOUND)
        }
        const product = await strapi.query('product').findOne({product_code: orderCode.product_code})
        const userPoint = product.price + user.point
        const productQuantity = orderCode.product_quantity + product.quantity

        await strapi.query('people').update({
            id: userId
        },
        {
            point: userPoint
        })
        await strapi.query('product').update({
            product_code: product.product_code
        },
        {
            quantity: productQuantity
        })
        await strapi.query('orderlog').update({
            id: orderCode.id
        },
        {
            refund
        })
        orderLog(userId, type, product.product_code, orderCode.order_code, product.price, user.point, userPoint, orderCode.product_quantity, null, product.name, refund)
        return responseParser({
            message: 'success'
        },200)

    } catch(error) {
        const type = '환불 실패'
        console.log(error)
        orderLog(userId, type, orderCodeParam , null, null, null, null, null, error.message, null, null)
        return ctx.badRequest(errorHandler(error.message))
    }
}

const getMyLog = async ctx => {
    const userId = ctx.request.user.id
    const { responseParser } = strapi.services.common
    const data = await strapi.query('orderlog').find({user_id: userId})

    return responseParser({data})
}
module.exports = { postOrder, getOrderDetail, patchRefund, getMyLog};
