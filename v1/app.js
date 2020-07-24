const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// Link static files
app.use(express.static("public"));

app.set("view engine" , "ejs");


let items = ["Buy food" , "Cook food" , "Eat food"];
let work_items = [];

app.get("/" , function(req,res){

  let date = new Date();
  var options = { weekday: "long", month: "short", day: "numeric" };
  let datee = date.toLocaleDateString('en-US' , options);

  res.render("index" , {title : datee , newListItem : items});

});

app.post("/",function(req,res){

  if(req.body.currPage ===  "Work")
  {
    work_items.push(req.body.newItem);
    res.redirect("/work");
  }
  else
  {
    items.push(req.body.newItem);
    res.redirect("/");
  }


});

app.get("/work",function(req,res){

  res.render("index",{title:"Work",newListItem:work_items})
});

app.post("/work",function(req,res){
  arrw.push(req.body.newItem);
  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("about");
})

app.listen(3000);
