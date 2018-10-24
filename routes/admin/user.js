var router = require('koa-router')();
const DB = require('../../model/db.js');

router.use(async (ctx,next)=>{
    ctx.state.__account__ = ctx.session.userinfo.account;
    await next();
})

router.get('/',async(ctx)=>{
    /*ctx.body = "用户管理";*/
    await ctx.render('admin/user/list');
})

router.get('/add',async(ctx)=>{
    /*ctx.body = "增加用户";*/
    await ctx.render('admin/user/add');
})
router.post('/delete',async(ctx)=>{
    var result =  await DB.remove("user",{"account":ctx.request.body.account});
    ctx.render('admin/user/list');
})
router.post('/edit',async (ctx)=>{
    var json1 = {"account":ctx.request.body.account};
    var json2 = {};
    if(ctx.request.body.using == "true"){
        json2 = {"using":true};
    }else {
        json2 = {"using":false};
    }
    var result = await  DB.update("user",json1,json2);
    await ctx.render('admin/user/list');
})
router.get('/getUsers',async (ctx)=>{
    let queryJson = {};
    var data =  await DB.find('user',queryJson);
    ctx.body = data;
})
router.post('/doAdd',async (ctx)=>{
    console.log("===============ctx.request.body===============");
    console.log(ctx.request.body);
    console.log("===============ctx.request.body===============");

    var data = ctx.request.body;
    var result =  await DB.find("user",{"account":data.account});
    console.log(result.length);

    if(result.length == 0){
        var insertor = {"account":data.account,"password":data.password,"userName":data.userName,"sex":data.sex,"age":data.age,"createTime":new Date(),"using":true};
        DB.insert("user",insertor);
        await ctx.redirect(ctx.state.__HOST__+"/admin/user");
    }else {
        console.log("here");
        var json = {"errMsg":"账号已经存在","data":ctx.request.body};
        await ctx.render("admin/user/add",json);
    }

})



module.exports = router.routes();