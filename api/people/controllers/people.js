'use strict';

const jwt = require("jsonwebtoken");
const { errorHandler, SIGN_REQUEST_ERROR } = require("../services/error")
const { responseParser } = require("../../common/services/common")
const {
    createUser,
    checkAccount,
    checkEmail,
    checkPassword,
    hash,
    comparePassword
} = require("../services//people")

const signup = async ctx => {
    const {
        name,
        password,
        account
    } = ctx.request.body;
    const {
        DUPLICATED_ACCOUNT,
        INVALID_EMAIL,
        INVALID_PASSWORD
    } = SIGN_REQUEST_ERROR

    try {
        if (!await checkEmail(account)) throw Error(INVALID_EMAIL)
        if (!await checkPassword(password)) throw Error(INVALID_PASSWORD)
        if (await checkAccount(account)) throw Error(DUPLICATED_ACCOUNT)

        const hashPassword = await hash(password)
        await createUser(name, hashPassword, account)
        
        return responseParser({
            message: "Created account!"
        }, 201)
    } catch(error) {
        console.log(error)
        return ctx.badRequest(errorHandler(error.message))
    }
}

const signin = async ctx => {
    const {
        account,
        password
    } = ctx.request.body;
    const {
        DOES_NOT_EXIST_ACCOUNT,
        INCORRECT_PASSWORD
    } = SIGN_REQUEST_ERROR
    const user = await checkAccount(account)

    try {
        if (user === null) throw Error(DOES_NOT_EXIST_ACCOUNT)
        if (!await comparePassword(password, user)) throw Error(INCORRECT_PASSWORD)

        const accessToken = jwt.sign({ id: user.id }, process.env.secretkey, {
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
