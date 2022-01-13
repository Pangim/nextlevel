'use strict';

const limit = 5

const getCategory = async ctx => {
    const { findCategory } = strapi.services.category
    const { responseParser } = strapi.services.common 
    const categories = await findCategory()
    try {
        const categoryName = await categories.map( category => { 
            return { name : category.name }
        })
        
        return responseParser({
            categoryName
        })
    } catch(error) {
        console.log(error)
    }
}

const getProduct = async ctx => {
    const { name, page } = ctx.request.query
    const { findProduct }  = strapi.services.category
    const { responseParser } = strapi.services.common
    const { errorHandler, REQUEST_CATEGORY_ERROR } = require('../services/error')
    const { NOT_FOUND_PRODUCTS } = REQUEST_CATEGORY_ERROR
    const offset = limit * page
    const getProduct = await findProduct(name)
    const products = await getProduct.product.slice(offset-limit, offset).map( product => {
        return {name: product.name, pirce: product.price + "원" }
    })

    try {
        if (products.length === 0) throw Error(NOT_FOUND_PRODUCTS)

        return responseParser({
            products
        })
    } catch(error) {
        console.log(error)
        return ctx.badRequest(errorHandler(error.message))
    }
}

const getProductOne = async ctx => {
    const productCode = ctx.params.product_code
    const { getProduct } = strapi.services.category
    const { responseParser } = strapi.services.common
    const { errorHandler, REQUEST_CATEGORY_ERROR } = require('../services/error')
    const { NOT_FOUND_PRODUCT } = REQUEST_CATEGORY_ERROR
    const product = await getProduct(productCode)

    try{
        if (product === null) throw Error(NOT_FOUND_PRODUCT)
        const productInfo = {
            "상품 이름": product.name,
            "상품 정보": product.information,
            "상품 가격": product.price,
            "상품 개수": product.quantitiy
        }

        return responseParser({
            productInfo
        })
    } catch(error) {
        console.log(error)
        ctx.badRequest(errorHandler(error.message))
    }
}


module.exports = { getProduct, getCategory, getProductOne };
