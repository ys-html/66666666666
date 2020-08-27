let express=require("express");
let path=require("path");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
let ejs=require("ejs");
let app=express();
app.set('views',path.join(__dirname,'./views'))
app.get("/",(req,res)=>{
    let page=req.query.page || 1;//当前多少页
    (page <=0 ) && (page = 1);
    console.log(page);
    let pagesize=3;//每页显示几条
    let offset=(page-1)*pagesize;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("news"); 
        dbo.collection("newlist").find({}).skip(offset).limit(pagesize).toArray(function(err, result) { 
            if (err) throw err;
            dbo.collection("newlist").count().then((result2)=>{
                let total=result2;//总新闻条数
                let size=Math.ceil(total/pagesize);//总共多少页
                res.render("传统页面.ejs",{
                data:result,
                total,
                pagesize,
                page,
                size,});
            })
           
            db.close();
        });
    });
})
app.listen(3100,()=>{
    console.log("3100运行了")
})