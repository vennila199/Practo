//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption"

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const Schema = mongoose.Schema;
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields: ["password"]});
const User =mongoose.model("User",userSchema);


app.get("/",(req,res)=>
{
    res.render("home");
})

app.get("/login",(req,res)=>
{
    res.render("login");
})

app.get("/register",(req,res)=>
{
    res.render("register");
})

app.post("/register",(req,res)=>{
    const newUser=new User({
     email:req.body.username,
     password:req.body.password
    });
    newUser.save();
    res.render("secrets");
})

app.post("/login",async (req,res)=>{
  const userName=req.body.username;
  const password=req.body.password;
  const foundlist= await User.findOne({email:userName});
  if(foundlist)
  {
    if(foundlist.password===password)
    {
        res.render("secrets");
    }
  }
  else
  {
    console.log("you are not authorized !")
  }
    
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})