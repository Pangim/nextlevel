'use strict';

const jwt = require("jsonwebtoken");

const signup = async ctx => {
    const { name, password, account } = ctx.request.body;
    const { responseParser } = strapi.services.common
    const { errorHandler, SIGN_REQUEST_ERROR } = require("../services/error")
    const { checkAccount, checkEmail, checkPassword, hash } = strapi.services.people
    const { DUPLICATED_ACCOUNT, INVALID_EMAIL, INVALID_PASSWORD } = SIGN_REQUEST_ERROR
    const checkedEmail = await checkEmail(account)
    const checkedPassword = await checkPassword(password)
    const checkedAccount = await checkAccount(account)
    const hashPassword = await hash(password)
    

    try {
        if (!checkedEmail) throw Error(INVALID_EMAIL)
        if (!checkedPassword) throw Error(INVALID_PASSWORD)
        if (checkedAccount) throw Error(DUPLICATED_ACCOUNT)
        await strapi.query('people').create({
            name: name,
            password: hashPassword,
            account: account,
            point : 0
        });
        return responseParser({
            message: "Created account!"
        }, 201)
    } catch(error) {
        console.log(error)
        return ctx.badRequest(errorHandler(error.message))
    }
}

const signin = async ctx => {
    const { account, password } = ctx.request.body;
    const { responseParser } = strapi.services.common
    const { errorHandler, SIGN_REQUEST_ERROR } = require("../services/error")
    const { compareAccount, comparePassword } = strapi.services.people
    const { DOES_NOT_EXIST_ACCOUNT, INCORRECT_PASSWORD } = SIGN_REQUEST_ERROR
    const user = await compareAccount(account)

    try {
        if (user === null) throw Error(DOES_NOT_EXIST_ACCOUNT)
        const CheckedPassword = await comparePassword(password, user)

        if (!CheckedPassword) throw Error(INCORRECT_PASSWORD)
        const accessToken = jwt.sign({ id : user.id }, process.env.secretkey, {
                expiresIn: 60*60
        })
        return responseParser({ 
            accessToken 
        })
    } catch(error) {
        console.log(error)
        ctx.badRequest(errorHandler(error.message))
    }
}

module.exports = { signup, signin };
