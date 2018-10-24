var router = require('koa-router')(),
    multer = require('koa-multer');
const DB = require('../../../model/db.js');

//配置koa-multer中间件,用于上传文件
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/admin/images/');
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

router.post("/",async (ctx)=>{

}).post("/doEdit1",async (ctx)=>{           //target:存储大标题及中心文本
    console.log("===========ctx.request.body============");
    console.log(ctx.request.body);
    console.log("===========ctx.request.body============");
    var naviName = ctx.request.body.naviName;
    var naviRoot = ctx.request.body.naviRoot;
    var title = ctx.request.body.title;
    var text = ctx.request.body.text;
    var contentPageType = ctx.request.body.contentPageType;
    var query = {"naviName":naviName,"naviRoot":naviRoot};
    var updator = {"content2.text":text,"content2.title":title};
    await DB.update_muti("content",query,updator);
    var data = await DB.find("content",{"naviName":naviName,"naviRoot":naviRoot});
    var json = {"content":data[0].content,"naviName":naviName,"naviRoot":naviRoot,"contentPageType":contentPageType,"content2":data[0].content2||""};
    await ctx.render("admin/content/contentTemplate_"+contentPageType,json);

}).post("/doEdit2",upload.single('file'),async(ctx)=>{
    var dSource = ctx.req.body;
    console.log("-----ctx.req.body111------");
    console.log(ctx.req.body);
    console.log("-----ctx.req.body222------");

    var naviName = dSource.naviName,naviRoot=dSource.naviRoot,contentPageType =dSource.contentPageType;
    var old_title = dSource.old_title,old_imgPath = dSource.old_imgPath,old_text =dSource.old_text;
    var title = dSource.title,text = dSource.subText;
    var imgPath = ctx.req.file == null?old_imgPath:(ctx.req.file.destination.match(/\/+\S+/)+ctx.req.file.originalname);
    console.log("==========imgPath=========");
    console.log(imgPath);
    console.log("==========imgPath=========");
    //有老数据则更新，没有则新增内嵌对象
    var oldData_exited = (old_title != 'undefined'&&old_title != undefined) || (old_imgPath != 'undefined'&&old_imgPath != undefined)||
        (old_text != 'undefined'&&old_text != undefined);
    if(oldData_exited){
        console.log("有老数据");
        var query = {};
        if(old_imgPath=="null")
            query = {"naviName":naviName,"naviRoot":naviRoot,"content.title":old_title};
        else
            query = {"naviName":naviName,"naviRoot":naviRoot,"content.title":old_title,"content.imgPath":old_imgPath};
        var updator = {"content.$.title":title,"content.$.imgPath":imgPath,"content.$.text":text};
        var result = await DB.update("content",query,updator);
        console.log("==========result==============");
        console.log(result);
        console.log("==========result==============");
    }else {
        console.log("没老数据");
        var query = {"naviName":naviName,"naviRoot":naviRoot};
        var insertor = {"content":{"title":title,"imgPath":imgPath,"text":text}};
        await DB.update_push("content",query,insertor);
    }

    var data = await DB.find("content",{"naviName":naviName,"naviRoot":naviRoot});
    var json = {"content":data[0].content,"naviName":naviName,"naviRoot":naviRoot,"contentPageType":contentPageType,"content2":data[0].content2||""};
    await ctx.render("admin/content/contentTemplate_"+contentPageType,json);
})

module.exports = router.routes();