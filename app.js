//引入koa模块

var Koa = require('koa'),
    router = require('koa-router')(),
    path = require('path'),
    render = require('koa-art-template'),
    static = require('koa-static'),
    session = require('koa-session'),
    bodyParser = require('koa-bodyparser'),
    md5 = require('md5'),
    multer = require('koa-multer');

//实例化
var app = new Koa();




//配置post数据传输中间件
app.use(bodyParser());

//配置session中间件
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 1800000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** (boolean) Force a sessiotruen identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));


//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});


//配置静态资源中间件
app.use(static(__dirname + '/public'));


//引入模块

var tosonGW = require('./routes/tosonGW.js');
var api = require('./routes/api.js');
var admin = require('./routes/admin.js');


router.use('/admin',admin);
router.use('/api',api);
router.use(tosonGW);

/*router.post('/upload', upload.single('file'), async ctx => {
    if (ctx.req.file){
        ctx.body = 'upload success';
    } else {
        ctx.body = 'upload error';
    }
});*/

app.use(router.routes());  /*启动路由*/
app.use(router.allowedMethods());

app.listen(3000,'0.0.0.0',function(){
    console.log('韩国人说要有光');
});