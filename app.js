express=require("express");
app=express();
mongoose=require("mongoose");
bodyParser=require("body-parser");
methodOverride=require("method-override");
multer=require("multer");
Video=require("./model/vid");
path=require("path");


mongoose.connect("mongodb://localhost/video_app",{useNewUrlParser:true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(express.static("public"));
app.use(express.static("videos"));
app.use(express.static("public/videos"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var filefilter=function(re,file,cb){
    if(file.mimetye === 'video/mp4')
    {
        cb(null,true);
    }
    else
    {
        cb(null,false);
    }
}
var storage = multer.diskStorage({
    destination: './public/videos/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname);
    }
  })
   
var upload = multer({ storage: storage },{filefilter:filefilter});

   
  

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

app.post("/videolist",upload.single('address'),function(req,res){
    const file = req.file;
    console.log(file);
    var vid=new Video();
    vid.title=req.body.title;
    vid.address=file.path;
    Video.create(vid,function(err,video){
        if(err)
        {
            res.render("new.ejs");
        }
        else
        {
            res.redirect("/videolist");
        }
    })
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
