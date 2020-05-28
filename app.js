const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.listen('3000', () => {
  console.log("Server running on port 3000");
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb+srv://moid-admin:Frenzy%2399188@cluster0-aujzw.mongodb.net/wikiDB",{ useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get((req,res) => {
  Article.find({},(err,foundArticles) => {
    if(!err) {
      res.send(foundArticles);
    }
  });
})
.post((req,res) => {

  let articleToSave = new Article({
    title: req.body.title,
    content: req.body.content
  });

  articleToSave.save(function(err){
    if(err) {
      res.send(err);
    } else {
      res.send("success!!");
    }
  });
})
.delete((req,res) => {
  Article.deleteMany({},function(err){
    if(err) {
      res.send(err);
    } else {
      res.send("All deleted!!");
    }
  });
});

app.route("/articles/:articleTitle")

.get((req,res) => {
  Article.findOne({
    title: req.params.articleTitle
  },function(err,foundArticle) {
    if(!err) {
      res.send(foundArticle);
    } else {
      res.send(err);
    }
  })
})
.put((req,res) => {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title,content: req.body.content},
    {overwrite:true},
    function (err,result) {
      if(result) {
        res.send("Updated!!")
      } else {
        res.send("Not found!!");
      }
    }
  );
})
.patch((req,res) => {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if(!err) {
        res.send("Patch successful");
      } else {
        res.send(err);
      }
    }
  );
})
.delete((req,res) => {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if(!err){
        res.send("Deleted successfully");
      } else {
        res.send(err);
      }
    }
  );
});
