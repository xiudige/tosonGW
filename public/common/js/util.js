var publicUtil = {
    isNotEmpty: function(val) {
        return !this.isEmpty(val);
    },
    isEmpty: function(val) {
        if((val == null || typeof(val) == "undefined") || (typeof(val) == "string" && val == "" && val != "undefined")) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * target:ajax封装
     * @param middleUrl
     * @param controller
     * @param queryData
     * @param async
     * @param postData          post请求时的数据，此时，queryData为null
     * @returns {string}
     */
    ajaxGet :(middleUrl,controller,queryData,async,type,postData) =>{
        var ip="localhost:3000";
        var result = "";
        for(var objkey in queryData){
            var iteratorIndex = 0;
            $.each(queryData[objkey],function(key,value){
                controller += iteratorIndex++=="0"?"?"+key+"="+value:"&"+key+"="+value;
            })
        }
        console.log("ip+url=="+ip+middleUrl+controller);
        $.ajax({
            type:type||'get',//请求方式
            url:middleUrl+controller,
            dataType:'json',//请求类型为json, 更多见jquery doc文档
            data:postData||null,
            contentType: "application/json",
            jsonp:"jsoncallback",
            async:async,
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                console.log("ajax success");
                result =  data;
            },
            error:function(){
                console.log("fail");
            }
        })
        return result;
    },
    /**
     * target:读取图片
     * selfId：input元素id
     * previewDom:图片预览元素id
     */
    readFile : function (selfId,previewDom){
        var file =document.querySelector('#'+selfId).files[0];	//二进制元数据
        var reader = new FileReader();
        var imgFile;
        reader.onload =  function(e){							            //读取成功时
            imgFile = e.target.result;								        //转码后文件元数据
            $("#"+previewDom).attr("src",imgFile);					        //在前端图片预览区展现
            console.log("imgFile=="+imgFile);
            var imgStr = imgFile.split(",")[1];						        //获取图片的base64code編碼
            var imgType = imgFile.split(",")[0].split(":")[1].split(";")[0].split("/")[1];		//获取图片格式后缀
            /*$("#imgStr").val(imgStr);
            $("#imgType").val(imgType);*/
            /*var storeData = publicUtil.ajaxGet("/admin/broadcast/","upload",[{"file":file}],false);
            console.log("storeData=="+storeData);*/
        }
       reader.readAsDataURL(file);
    }
}