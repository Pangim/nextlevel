const jwt = require("jsonwebtoken")

module.exports = async (ctx, next) => {
    const { errorHandler } = strapi.services.tokenerror
    try {
        const token = await ctx.request.header.token
        jwt.verify(token,process.env.secretkey,(err,encode)=>{
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