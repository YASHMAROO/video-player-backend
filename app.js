express=require("express");
app=express();
mongoose=require("mongoose");
bodyParser=require("body-parser");
methodOverride=require("method-override");
multer=require("multer");
upload=multer({dest:'videos/'})
Video=require("./model/vid");

mongoose.connect("mongodb://localhost/video_app",{useNewUrlParser:true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/",function(req,res){
    res.redirect("/videolist");
});

app.get("/videolist",function(req,res){
    Video.find({},function(err,video){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("show.ejs",{video:video});
        }
    })
})

app.get("/video/:id",function(req,res){
    Video.findById(req.params.id,function(err,video){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("video.ejs",{video: video});
        }
    })
});

app.get("/videolist/new",function(req,res){
    res.render("new.ejs");
});

app.post("/videolist",upload.single('productimage'),function(req,res){
    console.log(req.file);
    Video.create(req.body.video,function(err,video){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/videolist");
        }
    });
});

app.get("/videolist/:id/edit",function(req,res){
    Video.findById(req.params.id,function(err,video){
        if(err)
        {
            res.redirect("/videolist");
        }
        else
        {
            res.render("edit.ejs",{video:video});
        }
    });
});

app.put("/videolist/:id",function(req,res){
    Video.findByIdAndUpdate(req.params.id,req.body.video,function(err,updatedVideo){
        if(err)
        {
            res.redirect("/videolist");
        }
        else
        {
            res.redirect("/videolist");
        }
    });
});

app.delete("/videolist/:id",function(req,res){
    Video.findByIdAndRemove(req.params.id,function(err,deletedVideo){
        if(err)
        {
            res.redirect("/videolist");
        }
        else
        {
            res.redirect("/videolist");
        }
    });
});

app.listen(3000,function(){
    console.log("Server started");
});
