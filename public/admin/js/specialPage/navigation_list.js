$(function () {
    var data = getNavigation();
    $.fn.zTree.init($("#tree"), setting, getNavigation());
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var sNodes = treeObj.getNodes();


})


var setting = {
    view: {
        showLine:true,
        dblClickExpand:true,
        expandSpeed:"fast",
        showIcon:true,
        addHoverDom: addHoverDom,
        removeHoverDom:removeHoverDom
    },
    data: {
        simpleData: {
            enable: true,
            idKey:"id",
            pIdKey:"pid",
            rootPId:0

        },
        key:{
            isParent:"parent"

        }
    },
    callback: {
        /*beforeClick: null,*/
        onClick: onClick,
        onRename: zTreeOnRename,
        onRemove:zTreeOnRemove
    },
    edit:{
        enable: true,
        showRemoveBtn :true,
        showRenameBtn :true,
        removeTitle :"删除",
        renameTitle :"修改"

    }
};

/**
 * target:获取所有导航
 */
function getNavigation() {
    var resultData = publicUtil.ajaxGet("/admin/navigation/","getNavigation",null,false);
    var zNodes = [];
    zNodes = dealProductTypeData(zNodes,null,resultData.data);
    return zNodes;
}

function dealProductTypeData(Array,pid,data){
    for(var index in data){
        console.log(data[index]);
        var map = {};
        var naviName = data[index].naviName;
        var children = data[index].children;
        var fatherNode = data[index].fatherNode;
        var contentPageType = data[index].contentPageType;
        var using = data[index].using;
        var partId = (Number(index)+1).toString();
        var id = publicUtil.isEmpty(pid)?partId:pid+partId;
        map.id = id;
        map.pid = pid||0;
        map.name = naviName;
        map.open = false;
        map.fatherNode = fatherNode;
        map.naviName = naviName;
        map.contentPageType = contentPageType;
        map.using = using;
        if(using == false) {
            map.icon = "/admin/css/zTreeStyle/img/lock2.png";
        }
        Array.push(map);
        if(publicUtil.isNotEmpty(children)){
            dealProductTypeData(Array,id,children);
        }
    }
    return Array;
}

function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("tree"),
        nodes = zTree.getSelectedNodes(),
        v = "";
    nodes.sort(function compare(a,b){return a.id-b.id;});
    for (var i=0, l=nodes.length; i<l; i++) {
        v += nodes[i].naviName + ",";
    }
    if (v.length > 0 ) v = v.substring(0, v.length-1);
    /*var cityObj = $("#typeName");
    $("#typeId").val(treeNode.typeId);
    cityObj.attr("value", v);*/
}

function  zTreeOnRemove(event, treeId, treeNode) {
    var json = {"fatherNode":treeNode.fatherNode,"naviName":treeNode.naviName};
    var resultData = publicUtil.ajaxGet("/admin/navigation/","removeNavigation",null,false,"post",JSON.stringify(json));
}

/**
 * target:           树项更名后回调函数
 * @param event     标准的 js event 对象
 * @param treeId    对应 zTree 的 treeId，便于用户操控
 * @param treeNode  被修改名称的节点 JSON 数据对象
 * @param isCancel  是否取消操作
 */
function zTreeOnRename(event, treeId, treeNode, isCancel) {
    console.log("treeNode.name=="+treeNode.name);
    console.log("treeNode=="+JSON.stringify(treeNode));
    var json = {"fatherNode":treeNode.fatherNode,"naviName":treeNode.naviName,"updateName":treeNode.name};
    var resultData = publicUtil.ajaxGet("/admin/navigation/","editNavigation",null,false,"post",JSON.stringify(json) );
}

/**
 * target:添加按钮
 * @param treeId
 * @param treeNode
 */
function addHoverDom(treeId, treeNode) {

    var aObj = $("#" + treeNode.tId + "_a");
    if ($("#diyBtn_space_"+treeNode.id+"1").length>0) return;
    var class1 = treeNode.using?"button ico_lock":"button ico_unlock";
    var title =  treeNode.using?"屏蔽":"开放";
    console.log("======================treeNode==========");
    console.log(treeNode);
    var editStr = "<span id='diyBtn_space_" +treeNode.id+ "1' class='"+class1+"' title='"+title+"'> </span>";
    var editStr2 = "<a href='/admin/navigation/goEdit?naviName="+treeNode.naviName+"&fatherNode="+treeNode.fatherNode+"&contentPageType="+treeNode.contentPageType+"'><span id='diyBtn_space_" +treeNode.id+ "2' class='button ico_edit' title='编辑'> </span></a>";
    aObj.append(editStr);
    aObj.append(editStr2);
    var btn1 = $("#diyBtn_space_"+treeNode.id+"1");
    var btn2 = $("#diyBtn_space_"+treeNode.id+"2");
    if (btn1) btn1.bind("click", function(){
        var json = {"fatherNode":treeNode.fatherNode,"naviName":treeNode.naviName,"using":!treeNode.using};
        publicUtil.ajaxGet("/admin/navigation/","editNavigation2",null,false,"post",JSON.stringify(json));
    });

};

function removeHoverDom(treeId, treeNode) {
    $("#diyBtn_"+treeNode.id).unbind().remove();
    $("#diyBtn_space_" +treeNode.id+"1").unbind().remove();
    $("#diyBtn_space_" +treeNode.id+"2").unbind().remove();
};