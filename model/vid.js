mongoose=require("mongoose");

var videoSchema=new mongoose.Schema({
    title:String,
    address:String
});

module.exports=mongoose.model("Video",videoSchema);