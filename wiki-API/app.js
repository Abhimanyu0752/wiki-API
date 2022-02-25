const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema={
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);



app.route("/articles")


.get(function(req,res){
Article.find({},function(err,foundArticle){
  if(err){
    console.log(err);
  }else{
    res.send(foundArticle);
  }
});
})


.post(function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send("Oops,Error occured!!");
    }else{
      res.send("Successfully saved your information.");
    }
  });
})


.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
  res.send("Successfully deleted requested data");
    }else{
      res.send("Oops there's an error!!");
    }
  });
});


app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("NO such Article found");
    }
  });
})

.put(function(req,res){
  Article.update({title:req.params.articleTitle},{title:req.body.title , content:req.body.content},{overwrite:true},function(err){
    if(!err){
      res.send("Successfully updated the article.");
    }
    else{
      res.send("Oops there's some problem updating your request!!");
    }
  });
})

.patch(function(req,res){
  Article.update({title:req.params.articleTitle},{$set:req.body},function(err){
    if(err){
      res.send("Oops there's some problem updating your data.");
    }
    else{
      res.send("Successfully updated your data.");
    }
  });
})


.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("successfully Deleted the requested data.");
    }else{
      res.send("Oops thers's some problem deleteing the requested data!!");
    }
  });
});





app.listen(3000,function(){
  console.log("We are running at port 3000");
});
