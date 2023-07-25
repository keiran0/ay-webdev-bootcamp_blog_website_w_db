const express = require("express");
const app = express();
const lodash = require("lodash")
const mongoose = require("mongoose");

db = mongoose.connect("mongodb://127.0.0.1:27017/blog")

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const postsSchema = {
  sectionTitle: String,
  postTitle: String,
  postContent: String
}

const Post = mongoose.model("posts", postsSchema);

const homeDefaultParagraph = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutDefaultParagraph = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactDefaultParagraph = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const homeStartingContent = new Post({
  sectionTitle: "home", 
  postTitle: "Default", 
  postContent: homeDefaultParagraph
})
const aboutStartingContent = new Post({
  sectionTitle: "about",
  postTitle: "Default",
  postContent: aboutDefaultParagraph,
})
const contactStartingContent = new Post({
  sectionTitle: "contact",
  postTitle: "Default",
  postContent: contactDefaultParagraph
})

const posts = []

app.get("/", function(req, res){

  // const truncatedBody = []
  // const links = []

  // posts.forEach(function(post){

  //   truncated = lodash.truncate(post.body, {'length':100})
  //   truncatedBody.push(truncated);

  //   let formattedTitle = lodash.kebabCase(post.title.toLowerCase())
  //   let link = "/posts/" + formattedTitle;

  //   links.push(link);

  // })

  // res.render("home", {homeStartingContent:homeStartingContent, truncatedBody:truncatedBody, posts:posts, links:links});


  Post.find()
    .then(function(posts){
      if (posts.length === 0) {
        console.log("No posts available, inserting default items")
        homeStartingContent.save()
      }
    })
    .catch(function(err){
      console.log(err);
    })

  res.send("hello")


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent:contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  let post = {}
  post.title = req.body.composeTitle
  post.body = req.body.composePost
  posts.push(post)

  posts.forEach(function(post){
    console.log(post.title)
  })

  res.redirect("/")
});

app.get("/posts/:input", function(req, res){
  
  var lowerKebabedtitles = []
  let formattedParam = lodash.kebabCase(req.params.input.toLowerCase())

  posts.forEach(function(post){

    let formattedTitle = lodash.kebabCase(post.title.toLowerCase())

    // posts = [{title:tit, body: blank}]

    if (formattedParam == formattedTitle) {
      displayPost = post.title;
      displayBody = post.body;
    }

    lowerKebabedtitles.push(formattedTitle);

  })

  let lowerInput = req.params.input.toLowerCase()
  if (lowerKebabedtitles.includes(lodash.kebabCase(lowerInput))){
    res.render("post", {displayPost:displayPost, displayBody:displayBody})
  } else {
    res.send("match not found")
  }



});

app.listen(3000, function(){
  console.log("Running on port 3000");
});
