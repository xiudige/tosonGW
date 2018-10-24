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
                template:'<div class="item">'+
                                '<img v-bind:src="todo.imagePath">'+
                          '</div>',
                methods: {
                }
            },
            'lunboImage-target':{
                props:['todo'],
                template:'<li data-target="#myCarousel" data-slide-to="2"></li>',
                methods:{

                }
            }
        },
        mounted:function(){
            console.log("begin");
        },
        methods:{
        }
    })
})

/**
 * target:获取图片数据
 */
function getImageInfo(){
    return publicUtil.ajaxGet("/broadcast/","lunbo",null,false);      //url连同controller名指向路由，前端也借用了一些后台的控制器，不重复写了
}