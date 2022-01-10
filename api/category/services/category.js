'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */
 const findProduct = async (name, offset, limit)=> {
        const categoryId = await strapi.query('category').findOne({name: name}, ['product'])
        const products = await categoryId.product.slice(offset-limit, offset).map( product => {
            return {name: product.name, pirce: product.price + "원" }
        })
        return products
    }
module.exports = {findProduct};
