'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async (name, password, account) =>
    strapi.query('people').create({
        name,
        password,
        account,
        point: 0,
    });

const checkAccount = async account =>
    strapi.query('people').findOne({ account: account });

const comparePassword = async (password, user) =>
    bcrypt.compare(password, user.password);

const hash = async password => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const checkEmail = async email => {
    const emailRegex =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return emailRegex.test(email);
};

const checkPassword = async email => {
    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(email);
};

module.exports = {
    checkAccount,
    hash,
    checkEmail,
    checkPassword,
    comparePassword,
    createUser,
};
