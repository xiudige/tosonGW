var router = require('koa-router')();
const DB = require('../../../model/db.js');

router.post("/",async (ctx)=>{



}).post("/doEdit",async (ctx)=>{
    console.log("ctx.request.body============================");
    console.log(ctx.request.body);
    var naviName = ctx.request.body.naviName;
    var naviRoot = ctx.request.body.naviRoot;
    var contentPageType = ctx.request.body.contentPageType;
    var oldTitle = ctx.request.body.oldTitle;
    var oldText = ctx.request.body.oldText;
    var title = ctx.request.body.title;
    var text = ctx.request.body.text;
    var query = {"naviName":naviName,"naviRoot":naviRoot};
    var query2 = {"naviName":naviName,"naviRoot":naviRoot,"content.title":oldTitle,"content.text":oldText};
    var insert = {"content.$.title":title,"content.$.text":text};
    if(oldTitle =="" && oldText == ""){
        console.log("herhe");
        var insert2 = {"content":{"title":title,"text":text}};
        await DB.update_pull("content",query,{"content":{}});
        await DB.update_push("content",query,insert2);
    }else {
        await DB.update("content",query2,insert);
    }

    var data = await DB.find("content",query);
    console.log("content=========================");
    console.log(data);
    var json ={"content":data[0].content,"naviName":naviName,"naviRoot":naviRoot,"contentPageType":contentPageType};
    console.log("json=================");
    console.log(json);
    await ctx.render("admin/content/contentTemplate_"+contentPageType,json);
})
module.exports = router.routes();