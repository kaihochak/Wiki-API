const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// connect to mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article =  mongoose.model("Article", articleSchema);

// Requests Targetting Articles
app.route('/articles')
  .get(function(req, res){
    Article.find(function(err, foundArticles){
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function(req, res){
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully added a new an article");
      }
    });
  })
  .delete(function(req, res){
    Article.deleteMany(function(err){
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  })

// Requests Targetting A Specific Article
app.route('/articles/:articleTitle')
  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (!err){
        res.send(foundArticle);
      } else {
        res.send("No article matching is found");
      }
    });
  })
  .put(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err, updateArticle) {
        if (!err) {
          res.send("Article has been updated!");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if (!err) {
          res.send("Successfully update.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if (!err) {
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    });
  })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
