'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const find = async ctx => {
    try {
        const {name} = ctx.request.query
        const categoryId = await strapi.query('category').findOne({name: name}, ['product'])
        const products = await categoryId.product.map( product => {
            return {name: product.name, pirce: product.price }
        })
        ctx.send({
            products : products
        }, 200)
    } catch(error) {
        console.log(error)
    }
}

module.exports = {find};
