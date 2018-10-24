$(function () {

    //管理员列表模板
    var userTable = new Vue({
        el:'#user',
        data:{
            trItems:getUsers(),

        },
        components:{
            'tr-item': {
                    props:['todo'],
                    template:'<tr class="">'+
                                '<td class="center">'+
                                    '<label>'+
                                        '<input type="checkbox" class="ace">'+
                                        '<span class="lbl"></span>'+
                                    '</label>'+
                                '</td>'+
                                '<td>{{todo.account}}</td>'+
                                '<td>{{todo.userName}}</td>'+
                                '<td class="hidden-480">{{todo.createTime}}</td>'+
                                '<td>{{todo.sex}}</td>'+
                                '<td class="hidden-480">{{todo.age}}</td>'+
                                '<td class="hidden-480">' +
                                    '<form method="post" action="/admin/user/edit">'+
                                        '<span class="weui-switch" name="using" v-bind:class="{\'weui-switch-on\':todo.using}"  v-on:click="toggle($event)"></span>'+
                                        '<input type="hidden" name="account" :value=todo.account >'+
                                        '<input type="hidden" name="using" :value=!todo.using >'+
                                        '<input type="submit" style="display: none" class="uuui">'+
                                    '</form>'+
                                '<td>'+
                                    '<form method="post" action="/admin/user/delete">'+
                                        '<div class="visible-md visible-lg hidden-sm hidden-xs btn-group center">'+
                                            '<input type="hidden" name="account" v-bind:value=todo.account>'+
                                            '<button  class="btn btn-xs btn-danger" v-on:click="remove($event)" >'+
                                                '<i class="icon-trash bigger-120"></i>'+
                                            '</button>'+
                                            '<input type="submit" style="display: none">'+
                                        '</div>'+
                                    '</form>'+
                                '</td>'+
                                '</tr>',
                    methods: {
                        toggle:function(event) {
                            var el = event.currentTarget;
                            if(!($(el).nextAll("input[name='account']").val() == $("#sessionAccount").val())){
                                this.todo.using = !this.todo.using;
                                $(el).nextAll("input[type='submit']").click();
                            }
                        },
                        remove:(event)=>{
                            var el = event.currentTarget;
                            $(el).nextAll("input[type='submit']").click();
                        }
                    }
            }
        },
        mounted:function(){
        },
        methods:{
        }
    })
})

function  getUsers(){
    var result = publicUtil.ajaxGet("/admin/user/","getUsers",null,false);
    return result;
}



