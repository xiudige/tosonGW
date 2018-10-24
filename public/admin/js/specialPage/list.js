$(function () {
    //轮播图模板及实例
    var queryDataAreaDiv = new Vue({
        el:'#lunboImages',
        data:{
            lunboImagesList:getImageInfo()
        },
        components:{
            'lunboImage-item':{
                props:['todo'],
                template:'<li>'+
                                '<a v-bind:href="todo.imagePath" data-rel="colorbox">'+
                                    '<img alt="150x150" class="list_lunboImage" v-bind:src="todo.imagePath" />'+
                                    '<div class="text">'+
                                        '<div class="inner">Sample Caption on Hover</div>'+
                                    '</div>'+
                                '</a>'+
                                '<div class="tools tools-bottom">'+
                                    '<a href="#">'+
                                        '<i class="icon-link"></i>'+
                                    '</a>'+
                                    '<a href="#">'+
                                        '<i class="icon-paper-clip"></i>'+
                                    '</a>'+
                                    '<a href="#">'+
                                        '<i class="icon-pencil"></i>'+
                                    '</a>'+
                                    '<a href="/admin/broadcast">'+
                                        '<i class="icon-remove red" v-on:click="remove(todo.imagePath)"></i>'+
                                    '</a>'+
                                '</div>'+
                        '</li>',
                methods: {
                    remove: function (imagePath) {
                        var data = publicUtil.ajaxGet("/admin/broadcast/","remove",[{"imagePath":imagePath}],false);
                        console.log("result=="+JSON.stringify(data));
                    }
                }
            }
        },
        mounted:function(){
           console.log("begin");
        },
        methods:{
            add:function () {
                console.log("增加轮播图");
                var fileInput = $("#addImageInput");
                fileInput.click();
                fileInput.on("change",function () {
                    publicUtil.readFile($(this).attr("id"),"previewImage");
                })
            }
        }
    })
})



/**
 * target:获取图片数据
 */
function getImageInfo(){
    return publicUtil.ajaxGet("/admin/broadcast/","lunbo",null,false);          //url连同controller名指向路由，前端也借用了一些后台的控制器，不重复写了
}

