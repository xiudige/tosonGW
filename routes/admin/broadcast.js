var router = require('koa-router')(),
    multer = require('koa-multer'),
    path = require('path');
var lunbo = require('../../model/controller/lunbo.js');

//配置koa-multer中间件,用于上传文件
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/common/images/');
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    }
});
/*var fileFilter = (ctx, file ,cb)=>{
//过滤上传的后缀为png的文件
    if (file.originalname.split('.').splice(-1) == 'png'){
        cb(null, false);
    }else {
        cb(null, true);
    }
}*/
var upload = multer({ storage: storage });

router.get('/',async (ctx)=>{
    await ctx.render('admin/broadcast/list');
}).get('/lunbo',async (ctx)=>{
    await lunbo.getImages().then(function (data){
        console.log(data);
        ctx.body = data;
    })
}).get('/remove',async (ctx)=>{
    await lunbo.remove(ctx.query.imagePath).then(function (data) {
        console.log("data=="+data);
        ctx.body = data;
    });
    /*ctx.redirect(ctx.state.__HOST__+"/admin/broadcast/");*/
}).post('/upload', upload.single('file'), async (ctx,next) => {
    console.log("ctx.req.file==");
    console.log(JSON.stringify(ctx.req.file));
    if (ctx.req.file){
        /*ctx.body = 'upload success';*/
        await lunbo.addImages(ctx.req.file.destination.match(/\/+\S+/)+ctx.req.file.originalname).then(function (data){
            ctx.body = data;
        })
    } else {
        ctx.body = 'upload error';
    }
    await ctx.render('admin/broadcast/list');
});


router.get('/add',async(ctx)=>{
    await ctx.render('admin/broadcast/add');
})

module.exports = router.routes();