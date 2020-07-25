const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// Link static files
app.use(express.static("public"));

app.set("view engine" , "ejs");


mongoose.connect("mongodb://localhost:27017/todolist" , {useNewUrlParser:true});

const itemsSchema = new mongoose.Schema({
  name: String,
});


const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Hello"
});

const item2 = new Item({
  name: "Hiii"
});

const item3 = new Item({
  name: "Bye"
});

const defaultItems = [item1, item2, item3];

// For other routes
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);



app.get("/" , function(req,res){

  Item.find(function(err, foundItems){
    if(foundItems.length === 0)
    {
      Item.insertMany(defaultItems, function(error){
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log("Successfully saved items to database");
        }
      });

      res.redirect("/");
    }
    else
    {
      res.render("index" , {title : "Today" , newListItem : foundItems});
    }
  })

});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err,foundList){
    if(!err){
      if(!foundList){
        // Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/"+customListName);
      }
      else {
      // Show an existing list

      res.render("index",{title: foundList.name, newListItem: foundList.items})
      }
    }
  });




});

app.post("/",function(req,res){

    const newItem = req.body.newItem;
    const listName = req.body.currPage;

    const itemnew = new Item({
      name: newItem
    });

    if(listName === "Today"){
      itemnew.save();
      res.redirect("/");
    }else {
      List.findOne({name: listName}, function(err, foundList){
          foundList.items.push(itemnew);
          foundList.save();
          res.redirect("/"+listName);
      });
    }

});

app.post("/delete" , function(req,res){
  const checkedItemId =  req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }

});


app.get("/about",function(req,res){
  res.render("about");
})

app.listen(3000,function(){
  console.log("Server Started");
});

