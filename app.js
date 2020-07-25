//jshint esversion:
require("dotenv").config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true ,useUnifiedTopology: true});
const userSchema= new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET ,encryptedFields:["password"]});
const User = new mongoose.model("User",userSchema);


app.route("/")
.get(function(req,res){
  res.render('home');
});
app.route("/login")
.get(function(req,res){
  res.render('login');
})
.post(function(req,res){
  User.findOne({email:req.body.username},function(err,founditem){
      if(founditem.password === req.body.password){
        res.render("secrets");
      };
  });
});

app.route("/register")
.get(function(req,res){
  res.render('register');
})
.post(function(req,res){
  const anotheruser= new User({
    email:req.body.username,
    password:req.body.password
  });
  anotheruser.save(function(err){
    if(!err){
      console.log("saved");
      res.render("secrets");
    }else{
      console.log(err);
    };
  });
});

app.listen(3005,function(){
  console.log("sucess fully running");
});
