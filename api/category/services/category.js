'use strict';

 const findProduct = async name => {
        const getPorduct = await strapi.query('category').findOne({name: name}, ['product'])
        return getPorduct
    }

const findCategory = async => {
    const categoryName = strapi.query('category').find()
    return categoryName
}

const getProduct = async productCode => {
    const product = await strapi.query('product').findOne({product_code: productCode},[])
    return product
}
module.exports = { findProduct, findCategory, getProduct };
