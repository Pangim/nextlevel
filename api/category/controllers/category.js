'use strict';
const limit = 5

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const getCategory = async ctx => {
    try {
        const categoryName = await strapi.query('category').find()
        const data = await categoryName.map( category => { 
            return { name : category.name }
        })
        ctx.send({
            data : data
        }, 200)
    } catch(error) {
        console.log(error)
    }
}

const getProduct = async ctx => {
    try {
        const { name, page } = await ctx.request.query
        const { findProduct }  = await strapi.services.category
        const offset = limit * page
        const data = await findProduct(name, offset, limit)
        if (data.length === 0){
            ctx.send({
                message: "does not exist page"
            }, 404)
        }
        else {
            ctx.send({
                data: data
            }, 200)
        }
    } catch(error) {
        console.log(error)
    }
}

const getProductOne = async ctx => {
    try{
        const productCode = await ctx.params.product_code
        const data = await strapi.query('product').findOne({product_code: productCode},[])
        if (data === null){
            ctx.send({
                message : 'does not exist product code!'
            }, 404)
        }
        else {
            ctx.send({
            data : data
        }, 200)
    }
    } catch(error) {
        console.log(error)
    }
}


module.exports = { getProduct, getCategory, getProductOne };
