'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */
const checkAccount = async account => {
    const user = await strapi.query('people').findOne({account: account})
    return user
}

const compareAccount = async account => {
    const user = await strapi.query("people").findOne({ account: account });
    return user
}

const comparePassword = async (password, user) => {
    const comparePassword = await bcrypt.compare(password, user.password);
    return comparePassword
}

const hash = async password => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash
}

const checkEmail = async email => {
    const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const checkedEmail = emailRegex.test(email)
    return checkedEmail
}

const checkPassword = async email => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const checkedPassword = passwordRegex.test(email)
    return checkedPassword
}

module.exports = { checkAccount, hash, checkEmail, checkPassword, compareAccount, comparePassword };
