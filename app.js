const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const multer=require("multer")

const app = express()

app.use(express.static("public"))
app.use('/posts/:postId', express.static("public"));
app.use('/admin', express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://127.0.0.1:27017/mynotebook", { useNewUrlParser: true })
const postschema=mongoose.Schema({
    title:String,
    text:String,
    photopath:String,
    views: Number
})
const blog=mongoose.model("notebook", postschema)

var homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const extension="."+file.originalname.split('.').pop();
      const uniqueSuffix = file.fieldname+Date.now()+extension
      cb(null, uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

app.get("/", function (req, res) {
    async function find(){
        var post= await blog.find({})
        // console.log(post)
        res.render("home", {home:homeStartingContent.slice(0,180), newarray:post})
    }
    find()
})

app.get("/compose", function(req, res){
    res.render("compose")
})


app.get("/posts/:postId", function(req, res){
  const requestedPostID=req.params.postId;
    async function updatedViews(){
      var document= await blog.findById(requestedPostID).exec()
      var newviews=document.views +1
      await blog.findByIdAndUpdate(requestedPostID, {views:newviews})
    }
    updatedViews()
    async function post(){
      
      const content= await blog.findById(requestedPostID).exec()
      res.render("postpage", {content:content})
      console.log(content.views)

    }
  
    post()
  
})


app.post("/compose", upload.single("thumbnail"),function(req, res){
   const page=new blog({
    title: req.body.title,
    text:req.body.text,
    photopath:req.file.filename,
    views:0
   })
   page.save()
  res.redirect("/admin")    
})

app.get("/admin", function(req, res){
  async function find(){
    const posts= await blog.find({}).exec()
    const sorted=posts.sort( (a,b) => b.views - a.views );
    var totalviewers=0
    for (var j=0; j<posts.length; j++){
      totalviewers+=posts[j].views
    }
    res.render("admin", {newarray:posts, total:totalviewers})
    console.log(sorted)
}
find()
  
})


app.get("/delete/:id", function(req, res){
  const id=req.params.id;
  async function deleted(){
    await blog.findByIdAndDelete(id)
    res.redirect("/admin")
  }
  deleted()
})



app.get("/fetch", function(req, res){
  
  async function viewChart(){
    var yourArray=[]
    var documentArray= await blog.find({}).exec()
    for (j=0; j<documentArray.length; j++){
      yourArray.push(documentArray[j].views)
    }
    yourArray.sort( (a,b) => b - a)
    var myJsonString = JSON.stringify(yourArray);
  res.json(myJsonString)
  }
  
  viewChart()
  
})


app.listen(3000, function () { })
