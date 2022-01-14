'use strict';

const findProducts = async name =>
    strapi.query('category').findOne({ name: name }, ['product']);

const findCategory = async () => strapi.query('category').find();

const getProduct = async productCode =>
    strapi.query('product').findOne({ product_code: productCode }, []);

module.exports = {
    findProducts,
    findCategory,
    getProduct,
};
