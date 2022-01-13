'use strict'

const SIGN_REQUEST_ERROR = {
    DUPLICATED_ACCOUNT: "requestCheckDuplicatedAccount",
    INVALID_EMAIL: "requestCheckAccountInvalid",
    INVALID_PASSWORD: "requestCheckPasswordInvalid",
    DOES_NOT_EXIST_ACCOUNT: "requestCheckAccountDoesNotExist",
    INCORRECT_PASSWORD: "requestCheckPasswordIncorrect"
    
}

const errorHandle = {
    [SIGN_REQUEST_ERROR.DUPLICATED_ACCOUNT]: {
        id: "request.data.account.id.duplicated",
        message: "중복된 아이디입니다."
    },
    [SIGN_REQUEST_ERROR.INVALID_EMAIL]: {
        id: "request.data.account.email.invalid",
        message: "이메일 형식이 아닙니다."
    },
    [SIGN_REQUEST_ERROR.INVALID_PASSWORD]: {
        id: "request.data.password.invalid",
        message: "패스워드는 영어 대소문자, 비밀번호 8자리 이상, 숫자 포함, 특수문자가 모두 포함되어야합니다."
    },
    [SIGN_REQUEST_ERROR.DOES_NOT_EXIST_ACCOUNT]: {
        id: "request.data.account.does.not.exist",
        message: "존재하지 않는 계정입니다."
    },
    [SIGN_REQUEST_ERROR.INCORRECT_PASSWORD]: {
        id: "request.data.passwordt.incorrect",
        message: "비밀번호가 맞지 않습니다."
    }
}

const errorHandler = key => {
    return strapi.services.common.errorHandlerV3('people', errorHandle, key)
}
module.exports = { errorHandler, SIGN_REQUEST_ERROR }