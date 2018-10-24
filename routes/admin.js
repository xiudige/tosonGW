var router = require('koa-router')();


//引入模块

var login = require('./admin/login.js');
var user = require('./admin/user.js');
var broadcast = require('./admin/broadcast.js');        //轮播图模块
var navigation =require('./admin/navigation.js');       //导航模块
var content = require('./admin/content.js')              //内容模块


//配置中间件，获取url地址
router.use(async(ctx,next)=>{
    /*console.log(ctx.request.header.host);*/
    /*console.log("URL=="+ctx);*/

    //模板引擎配置全局的变量
    /*console.log("Host=="+ctx.request.header.host);*/
    ctx.state.__HOST__ = "http://"+ctx.request.header.host;

    /*console.log("session==" + ctx.session.userinfo);*/
    if(ctx.session.userinfo){              //有session
        ctx.state.__userName__ = ctx.session.userinfo.userName;
        await next();
    }else{
        if(ctx.url != "/admin/login" && ctx.url != "/admin/login/doLogin"){
            await ctx.render('admin/login');
        }else {
            await next();
        }
    }
})

router.get('/',async(ctx)=>{
    /*ctx.body = "后台管理";*/
    await ctx.render('admin/index')
})


router.use('/login',login);
router.use('/user',user);
router.use('/broadcast',broadcast);
router.use('/navigation',navigation);
router.use('/content',content);

module.exports = router.routes();