//editor3:   大标题下文本主题
//editor4:   子项目富文本
jQuery(function($){
    $('#editor3,#editor2').css({'height':'200px'}).ace_wysiwyg({
        toolbar_place: function(toolbar) {
            return $(this).closest('.widget-box').find('.widget-header').prepend(toolbar).children(0).addClass('inline');
        },
        toolbar:
            [
                'bold',
                {name:'italic' , title:'Change Title!', icon: 'icon-leaf'},
                'strikethrough',
                null,
                'insertunorderedlist',
                'insertorderedlist',
                null,
                'justifyleft',
                'justifycenter',
                'justifyright'
            ],
        speech_button:false
    });


    $('[data-toggle="buttons"] .btn').on('click', function(e){
        var target = $(this).find('input[type=radio]');
        var which = parseInt(target.val());
        var toolbar = $('#editor1').prev().get(0);
        if(which == 1 || which == 2 || which == 3) {
            toolbar.className = toolbar.className.replace(/wysiwyg\-style(1|2)/g , '');
            if(which == 1) $(toolbar).addClass('wysiwyg-style1');
            else if(which == 2) $(toolbar).addClass('wysiwyg-style2');
        }
    });

    //Add Image Resize Functionality to Chrome and Safari
    //webkit browsers don't have image resize functionality when content is editable
    //so let's add something using jQuery UI resizable
    //another option would be opening a dialog for user to enter dimensions.
    if ( typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase()) ) {
        var lastResizableImg = null;
        function destroyResizable() {
            if(lastResizableImg == null) return;
            lastResizableImg.resizable( "destroy" );
            lastResizableImg.removeData('resizable');
            lastResizableImg = null;
        }
        var enableImageResize = function() {
            $('.wysiwyg-editor')
                .on('mousedown', function(e) {
                    var target = $(e.target);
                    if( e.target instanceof HTMLImageElement ) {
                        if( !target.data('resizable') ) {
                            target.resizable({
                                aspectRatio: e.target.width / e.target.height,
                            });
                            target.data('resizable', true);

                            if( lastResizableImg != null ) {//disable previous resizable image
                                lastResizableImg.resizable( "destroy" );
                                lastResizableImg.removeData('resizable');
                            }
                            lastResizableImg = target;
                        }
                    }
                })
                .on('click', function(e) {
                    if( lastResizableImg != null && !(e.target instanceof HTMLImageElement) ) {
                        destroyResizable();
                    }
                })

        }
        enableImageResize();
    }


    //dynamically change allowed formats by changing before_change callback function
    $('#id-file-format').removeAttr('checked').on('change', function() {
        var before_change
        var btn_choose
        var no_icon
        if(this.checked) {
            btn_choose = "Drop images here or click to choose";
            no_icon = "icon-picture";
            before_change = function(files, dropped) {
                var allowed_files = [];
                for(var i = 0 ; i < files.length; i++) {
                    var file = files[i];
                    if(typeof file === "string") {
                        //IE8 and browsers that don't support File Object
                        if(! (/\.(jpe?g|png|gif|bmp)$/i).test(file) ) return false;
                    }
                    else {
                        var type = $.trim(file.type);
                        if( ( type.length > 0 && ! (/^image\/(jpe?g|png|gif|bmp)$/i).test(type) )
                            || ( type.length == 0 && ! (/\.(jpe?g|png|gif|bmp)$/i).test(file.name) )//for android's default browser which gives an empty string for file.type
                        ) continue;//not an image so don't keep this file
                    }

                    allowed_files.push(file);
                }
                if(allowed_files.length == 0) return false;

                return allowed_files;
            }
        }
        else {
            btn_choose = "Drop files here or click to choose";
            no_icon = "icon-cloud-upload";
            before_change = function(files, dropped) {
                return files;
            }
        }
        var file_input = $('#id-input-file-3');
        file_input.ace_file_input('update_settings', {'before_change':before_change, 'btn_choose': btn_choose, 'no_icon':no_icon})
        file_input.ace_file_input('reset_input');
    });

    $('#id-input-file-3').ace_file_input({
        style:'well',
        btn_choose:'Drop files here or click to choose',
        btn_change:null,
        no_icon:'icon-cloud-upload',
        droppable:true,
        thumbnail:'small'//large | fit
        //,icon_remove:null//set null, to hide remove/reset button
        /**,before_change:function(files, dropped) {
						//Check an example below
						//or examples/file-upload.html
						return true;
					}*/
        /**,before_remove : function() {
						return true;
					}*/
        ,
        preview_error : function(filename, error_code) {
            //name of the file that failed
            //error_code values
            //1 = 'FILE_LOAD_FAILED',
            //2 = 'IMAGE_LOAD_FAILED',
            //3 = 'THUMBNAIL_FAILED'
            //alert(error_code);
        }
    }).on('change', function(){
    });

    //target:富文本编辑框的内容，数据库中存储的是html文本，须解析
    $("#editor3").html($("#editorInput").val());



});

/**
 * target:单击编辑按钮
 * @param data
 */
function  render(data) {
    console.log(data);
    $("#form-field-1").val(data.title);
    $("#editor2").html(data.text);
    $("#contentText").val(data.text);

    //删除之前可能存入的可能的旧数据
    var oldD_List = $("input[name ^='old']");
    for(var i=0;i<oldD_List.length;i++){
        oldD_List.eq(i).remove();
    }
    //添加旧数据，给mongoDB查询
    var html = "<input type='hidden' name='old_title' value='"+data.title+"'>"+
                "<input type='hidden' name='old_imgPath' value='"+data.imgPath+"'>"+
                "<input type='hidden' name='old_text' value='"+data.text+"'>";
    $("#form1").append(html);

    $('#id-input-file-3').nextAll("label").eq(0).attr("data-title","");
    $('#id-input-file-3').nextAll("label").eq(0).addClass("hide-placeholder selected");
    $('#id-input-file-3').nextAll("label").eq(0).find("i").hide();
    $('#id-input-file-3').nextAll("label").eq(0).find("span:first").attr("data-title",'当前图片.pic');
    $('#id-input-file-3').nextAll("label").eq(0).find("span:first").find("img").remove();
    $('#id-input-file-3').nextAll("label").eq(0).find("span:first").append("<img class='middle' style='width:50px;height: 50px' src='"+data.imgPath+"'>");
}


function cancel() {
    $("#editor3").text("");
    $("#editorInput").val("");
}

//target:主标题与中心文本提交
function save1() {
    console.log("here");
    $("#editorInput").val($("#editor3").html());
    $("#form2").submit();
}

//target:子项目数据提交
function save() {
    /*console.log("innerHTML=="+$("#editor2").innerHTML());*/
    console.log("=============================================================");
    console.log("html=="+$("#editor2").html());
    $("#contentText").val($("#editor2").html());
    $("#form1").submit();
}