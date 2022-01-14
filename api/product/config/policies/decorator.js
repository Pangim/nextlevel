const jwt = require("jsonwebtoken")
const { errorHandler } = require("../../../common/services/tokenerror")
module.exports = async (ctx, next) => {
    const token = await ctx.request.header.token
    try {
        jwt.verify(token,process.env.secretkey,(err, encode)=>{
            if(err){
                throw Error(err)
            } else {
                ctx.request.user = encode
            }
        });
        return await next();
    } catch(error) {
        console.log(error)
        return ctx.badRequest(errorHandler(error.message))
    }
}