const router = require('koa-router')();

const tools = require('../../model/tools.js');
const DB = require('../../model/db.js');

router.get('/',async(ctx)=>{
    /*ctx.body = "登陆";*/
    ctx.session.userinfo = "";
    await ctx.render('admin/login');
})

router.post('/doLogin',async(ctx)=>{
    /*console.log(ctx.request.body);*/
    /*console.log(ctx);*/
    const password = ctx.request.body.password;
    const userName = ctx.request.body.userName;
    var result =await DB.find('user',{'account':userName,'password':password,'using':true});
    if(result.length > 0){
        ctx.session.userinfo = result[0];
        console.log("success-");
        ctx.redirect(ctx.state.__HOST__+"/admin");
    }else {
        ctx.body = "查无此人";
    }
})

module.exports = router.routes();