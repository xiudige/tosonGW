var router = require('koa-router')();
const DB = require('../../model/db.js');



router.get("/" ,async (ctx)=>{
    await ctx.render("admin/navigation/list");
}).get("/add",async (ctx)=>{
    var json_contentTypes = {};
    var json_fatherNodes = {"fatherNode":"根"};
    let contentTypes = await DB.find("contentPageType",json_contentTypes);
    let fatherNodes = await DB.find("navigation",json_fatherNodes);
    var data = {
        "contentTypes":contentTypes,
        "fatherNodes":fatherNodes
    }
    await ctx.render("admin/navigation/add",data);
}).post("/doadd",async (ctx)=>{
    var json = {
        "naviName":ctx.request.body.naviName,
        "contentPageType":ctx.request.body.contentPageType,
        "fatherNode":ctx.request.body.fatherNode,
        "using":true
    }
    if(ctx.request.body.fatherNode == "根"){
        var result =  await DB.insert("navigation",json);
    }else {
        var json_father = {"naviName":ctx.request.body.fatherNode};
        var json_update = {"children":json}
        DB.update_push("navigation",json_father,json_update);
    }
    //添加content集合
    var result = await DB.find("contentPageType",{"type":ctx.request.body.contentPageType});
    var type = result[0].name;
    var json2 = {
        "naviName":ctx.request.body.naviName,
        "type":type,
        "naviRoot":ctx.request.body.fatherNode,
        "content":[]
    }
    await DB.insert("content",json2);
    ctx.redirect(ctx.state.__HOST__+"/admin/navigation/add");
})
router.get("/getNavigation",async (ctx)=>{
    var json = {};
    var mongoResult = await DB.find("navigation",json);
    var result = {"data":mongoResult};
    ctx.body = result;
}).post("/editNavigation",async(ctx)=>{
        var fatherNode = ctx.request.body.fatherNode;
        var naviName = ctx.request.body.naviName;
        var updateName = ctx.request.body.updateName;
        if(fatherNode == "根"){
            await DB.update("navigation",{"naviName":naviName},{"naviName":updateName});
        }else{
            await DB.update("navigation",{"children.naviName":naviName},{"children.$.naviName":updateName});
        }
}).post("/removeNavigation",async (ctx)=>{
    var fatherNode = ctx.request.body.fatherNode;
    var naviName = ctx.request.body.naviName;
    if(fatherNode == "根"){
        await DB.remove("navigation",{"fatherNode":fatherNode,"naviName":naviName});
        await DB.remove("content",{"naviRoot":fatherNode,"naviName":naviName});
    }else{
        var jsonOut = {"naviName":fatherNode};
        var jsonIn  = {"children":{"naviName":naviName}};
        await DB.update_pull("navigation",jsonOut,jsonIn);
        await DB.remove("content",{"naviRoot":fatherNode,"naviName":naviName});
    }
}).post("/editNavigation2",async (ctx)=>{
    var fatherNode = ctx.request.body.fatherNode;
    var naviName = ctx.request.body.naviName;
    var using = ctx.request.body.using;
    console.log("naviName=="+naviName+"---fatherNode=="+fatherNode);
    if(fatherNode == "根"){
        await DB.update("navigation",{"naviName":naviName},{"using":using});
        if(!using){
            var obj = await DB.find("navigation",{"naviName":naviName});
            for(var i =0;i< obj[0].children.length;i++){
                await DB.update("navigation",{"children.fatherNode":naviName,"children.naviName":obj[0].children[i].naviName},{"children.$.using":false});
            }
        }
    }else{
        await DB.update("navigation",{"children.naviName":naviName},{"children.$.using":using});
    }
}).get("/goEdit",async (ctx)=>{
    var json_contentTypes = {};
    console.log(ctx.query);
    //总导航数据查询
    var json_fatherNodes = {"fatherNode":"根"};
    let contentTypes = await DB.find("contentPageType",json_contentTypes);
    let fatherNodes = await DB.find("navigation",json_fatherNodes);

    //待编辑导航数据查询
    var query= {"naviName":ctx.query.naviName,"naviRoot":ctx.query.fatherNode};
    let edit_data = await DB.find("content",query);

    console.log("============"+edit_data+"===============");
    console.log(edit_data);
    var data = {
        "contentTypes":contentTypes,
        "fatherNodes":fatherNodes,
        "edit_data":edit_data[0]
    }
    await ctx.render("admin/navigation/edit",data);
}).post("/doEdit",async (ctx)=>{

    //target:该项目条老数据
    var oldData = JSON.parse(ctx.request.body.oldData);

    //target:修改navigation集合
    if(oldData.naviRoot =="根"){
        var query = {"naviName":oldData.naviName,"fatherNode":oldData.naviRoot};
        var updator= {"naviName":ctx.request.body.naviName,"contentPageType":ctx.request.body.contentPageType};
        await DB.update("navigation",query,updator);
    }else {
        var query = {"naviName":oldData.naviRoot,"children.fatherNode":oldData.naviRoot,"children.naviName":oldData.naviName};
        var updator= {"children.$.naviName":ctx.request.body.naviName,"children.$.contentPageType":ctx.request.body.contentPageType};
        var result  = await DB.update("navigation",query,updator);
    }


    //target:修改content集合
    var result = await DB.find("contentPageType",{"type":ctx.request.body.contentPageType});
    var newType = result[0].name;
    var query2 = {"naviName":oldData.naviName,"naviRoot":oldData.naviRoot};
    if(newType != oldData.type) {
        var updataor2 = {"type": newType, "naviName": ctx.request.body.naviName, "content":[{}]};
        DB.update("content",query2,updataor2);
    }else {
        var updataor2 = {"type": newType, "naviName": ctx.request.body.naviName};
        DB.update("content",query2,updataor2);
    }

    await ctx.render("admin/navigation/list");
})

module.exports = router.routes();