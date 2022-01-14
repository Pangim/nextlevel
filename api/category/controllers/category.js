'use strict';

const { responseParser } = require('../../common/services/common');
const { errorHandler, REQUEST_CATEGORY_ERROR } = require('../services/error');
const {
    findCategory,
    findProducts,
    getProduct,
} = require('../services/category');

const getCategory = async () => {
    const categories = await findCategory();

    try {
        const categoryData = await categories.map(category => {
            return {
                name: category.name,
            };
        });

        return responseParser({
            categoryData,
        });
    } catch (error) {
        console.log(error);
        return ctx.badRequest(errorHandler(error.message));
    }
};

const getProducts = async ctx => {
    const { name, page } = ctx.request.query;
    const { NOT_FOUND_PRODUCTS } = REQUEST_CATEGORY_ERROR;
    const limit = 5;
    const offset = limit * page;
    const products = await findProducts(name);
    const productData = await products.product
        .slice(offset - limit, offset)
        .map(product => {
            return {
                name: product.name,
                pirce: product.price + 'Point',
            };
        });

    try {
        if (productData.length === 0) throw Error(NOT_FOUND_PRODUCTS);

        return responseParser({
            productData,
        });
    } catch (error) {
        console.log(error);
        return ctx.badRequest(errorHandler(error.message));
    }
};

const getProductOne = async ctx => {
    const productCode = ctx.params.product_code;
    const { NOT_FOUND_PRODUCT } = REQUEST_CATEGORY_ERROR;
    const product = await getProduct(productCode);

    try {
        if (product === null) throw Error(NOT_FOUND_PRODUCT);
        const productInfo = {
            '상품 이름': product.name,
            '상품 정보': product.information,
            '상품 가격': product.price,
            '상품 개수': product.quantity,
        };

        return responseParser({
            productInfo,
        });
    } catch (error) {
        console.log(error);
        ctx.badRequest(errorHandler(error.message));
    }
};

module.exports = {
    getProducts,
    getCategory,
    getProductOne,
};
