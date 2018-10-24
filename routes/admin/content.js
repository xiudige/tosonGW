var router = require('koa-router')(),
    multer = require('koa-multer');

const DB = require('../../model/db.js');

var template_3 = require('./template/template_3.js');              //模板路由
var template_4 = require('./template/template_4.js');              //模板路由

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

router.get("/" ,async (ctx)=>{
    var data = await DB.find("navigation",{});
    var data_contentType = await DB.find("contentPageType",{});
    var contList = {};
    for(var i = 0;i<data_contentType.length;i++){
        contList[data_contentType[i].type] = data_contentType[i].name;
    }
    var json = {"data":data,"contentPageType":contList};
    await ctx.render("admin/content/list",json);
}).get("/doTemplate",async (ctx)=>{
    console.log(ctx.query);
    var naviName = ctx.query.naviName;
    var fatherNode = ctx.query.fatherNode;
    var contentPageType = ctx.query.contentPageType;
    var data = await DB.find("content",{"naviName":naviName,"naviRoot":fatherNode});
    console.log(data);
    console.log("length==="+data[0].content.length);
    var json = {"content":data[0].content||"","naviName":naviName,"naviRoot":fatherNode,"contentPageType":contentPageType,"content2":data[0].content2||""};
    await ctx.render("admin/content/contentTemplate_"+contentPageType,json);
}).post("/doEdit",upload.single('file'),async (ctx)=>{
    var dSource = ctx.req.body;
    console.log("-----ctx.req.body------");
    console.log(ctx.req.body);
    console.log("-----ctx.req.body------");
    var naviName = dSource.naviName,naviRoot=dSource.naviRoot,contentPageType =dSource.contentPageType;
    var old_mainTitle = dSource.old_mainTitle,old_sonTitle = dSource.old_sonTitle,old_imgPath = dSource.old_imgPath,old_text =dSource.old_text;
    var mainTitle = dSource.mainTitle,sonTitle = dSource.sonTitle,text = dSource.text;
    var imgPath = ctx.req.file == null?old_imgPath:(ctx.req.file.destination.match(/\/+\S+/)+ctx.req.file.originalname);
    //有老数据则更新，没有则新增内嵌对象
    var oldData_exited = (old_mainTitle != 'undefined'&&old_mainTitle != undefined) || (old_sonTitle != 'undefined'&& old_sonTitle != undefined)||
                         (old_imgPath != 'undefined'&&old_imgPath != undefined)|| (old_text != 'undefined'&&old_text != undefined);
    if(oldData_exited){
        console.log("有老数据");
        var query = {};
        if(old_imgPath=="null")
            query = {"naviName":naviName,"naviRoot":naviRoot,"content.mainTitle":old_mainTitle,"content.sonTitle":old_sonTitle};
        else
            query = {"naviName":naviName,"naviRoot":naviRoot,"content.mainTitle":old_mainTitle,"content.sonTitle":old_sonTitle,"content.imgPath":old_imgPath};
        var updator = {"content.$.mainTitle":mainTitle,"content.$.sonTitle":sonTitle,"content.$.imgPath":imgPath,"content.$.text":text};
        await DB.update("content",query,updator);
    }else {
        console.log("没老数据");
        var query = {"naviName":naviName,"naviRoot":naviRoot};
        var insertor = {"content":{"mainTitle":mainTitle,"sonTitle":sonTitle,"imgPath":imgPath,"text":text}};
        await DB.update_push("content",query,insertor);
    }
    var data = await DB.find("content",{"naviName":naviName,"naviRoot":naviRoot});
    var json = {"content":data[0].content,"naviName":naviName,"naviRoot":naviRoot,"contentPageType":contentPageType};
    await ctx.render("admin/content/contentTemplate_"+contentPageType,json);
}).get("/doDelete", async (ctx)=>{
    console.log("==============ctx.query============");
    console.log(ctx.query);
    console.log("==============ctx.query============");
    var naviName = ctx.query.naviName,naviRoot = ctx.query.naviRoot,contentPageType = ctx.query.contentPageType;
    var queryOut = {"naviName":naviName,"naviRoot":naviRoot};
    var queryIn = {"content":JSON.parse(ctx.query.data)};
    await DB.update_pull("content",queryOut,queryIn);

    var data = await DB.find("content",{"naviName":naviName,"naviRoot":naviRoot});
    var json = {"content":data[0].content,"naviName":naviName,"naviRoot":naviRoot,"contentPageType":contentPageType,"content2":data[0].content2||""};
    console.log("===========json============");
    console.log(json);
    console.log("===========json============");
    await ctx.render("admin/content/contentTemplate_"+contentPageType,json);
})


router.use('/contentTemplate_3',template_3);
router.use('/contentTemplate_4',template_4);
module.exports = router.routes();