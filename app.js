let express=require("express");
let app=express();
let path=require("path")
let cors=require("cors");
let bodyparser=require("body-parser");
let joi=require('@hapi/joi')
let userconstroller=require("./constroller/user");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cors());
app.use(function(req,res,next){
    res.ss=function(err,status=1){
        res.send({
            status,
            msg:err instanceof Error ? err.message:err
        })
    }
    next();
})
app.use(express.static(path.join(__dirname,'./uploads')))
let expressJWT=require("express-jwt");
let config=require("./config");
//解析，信息挂在user上面
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api/] }))

app.use('/api',userconstroller);
let userInfoconstroller=require("./constroller/userinfo");
app.use("/auth",userInfoconstroller);

//引入分类管理模块
let catsConstroller=require("./constroller/cats");
app.use("/cauth",catsConstroller);
//引入文章模块
let articleConstroller=require("./constroller/article");
app.use("/cauth/article",articleConstroller);
app.use((err,req,res,next)=>{
    if(err.name==="UnauthirizedError"){
        return res.ss("身份验证失败")
    }
    if(err instanceof joi.ValidationError){
        return res.ss(err)
    }
    res.ss("未知错误")
})

app.listen(4000,()=>{
    console.log("4000运行起来了")
})