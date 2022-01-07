'use strict';
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const saltRounds = 10;
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const signup = async ctx => {
    try {
        const { name, password, account } = ctx.request.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        await strapi.query('people').create({
            name: name,
            password: hash,
            account: account,
            point : 0
        });
        ctx.send({
            message: "Created!"
        }, 201)
    } catch(error) {
        console.log(error)
    }
}

const signin = async ctx => {
    try {
        const { account, password } = ctx.request.body;
        const user = await strapi.query("people").findOne({ account: account });
        if (user) {
            const pass = await bcrypt.compare(password, user.password);
            if(pass) {
                const accessToken = jwt.sign({ id : user.id }, process.env.secretkey, {
                        expiresIn: 60*60
                    });
                ctx.send({
                    message: accessToken
                }, 200)
            } else {
                ctx.send({
                    message: "wrong password"
                }, 400)
            }
        } else if(!user) {
            ctx.send({
                message: "wrond account"
            }, 400)
        }
    } catch(error) {
        console.log(error)
        ctx.send({
            message: "Key Error!"
        }, 400)
    }
}

const passToken = async ctx => {
    try {
        const token = await ctx.request.header.token
        jwt.verify(token,process.env.secretkey,(err,encode)=>{
            if(err){
                console.log(err)
                ctx.send({
                    message: "invalid token"
                }, 400)
            } else {
                console.log(encode);
                ctx.request.user = encode
                ctx.send({
                    message: "ok"
                }, 200)
            }
        });
    } catch(error) {
        console.log(error)
    }
}

module.exports = { passToken, signup, signin };
