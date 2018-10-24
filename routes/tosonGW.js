var router = require('koa-router')();
var lunbo = require('../model/controller/lunbo.js');
const DB = require('../model/db.js');

router.use(async (ctx,next)=>{
    //模板引擎配置全局的变量
    ctx.state.__HOST__ = "http://"+ctx.request.header.host;
    await next();
})
/*router.use(async(ctx,next)=>{
    var data = await DB.find("navigation",{"using":true});
    var json = {"data":data};
    ctx.state.data = json;
    await next();
})*/


router.get('/',async(ctx)=>{
    var data = await DB.find("navigation",{"using":true});
    var json = {"data":data};
    await ctx.render('tosonGW/index',json);
}).get('/broadcast/lunbo',async (ctx)=>{
    await lunbo.getImages().then(function (data){
        ctx.body = data;
    })
}).get('/doTemplate',async (ctx)=>{         //target:每个导航项都进过这个路由，根据其naviName、fatherNode、contentPageType，到content集合中查询对应的页面数据，再跳转到对应的页面类型
    var data = await DB.find("navigation",{"using":true});
    console.log(ctx.query);
    var naviName = ctx.query.naviName;
    var fatherNode = ctx.query.fatherNode;
    var contentPageType = ctx.query.contentPageType;
    var content = await DB.find("content",{"naviName":naviName,"naviRoot":fatherNode});
    console.log(content);
    var json = {"content":content[0],"data":data};
    await ctx.render('tosonGW/contentTemplate_'+ctx.query.contentPageType,json);
    /*ctx.body = "准备跳转到对应的模板";*/
})

module.exports = router.routes();