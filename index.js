// import express from "express";
// import bodyParser from "body-parser";
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//set the static folder to public
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB").then(() => {
  console.log("mongodb connected at port 27017");
});

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);


const item1 = new Item({
  name: "Welcome to your todo list"
})
const item2 = new Item({
  name : "yours completely"
});
const defaultItems = [item1, item2];  
// Item.insertMany(defaultItems).then(() => {console.log("inserted")});



app.post("/today", (req, res) => {
  const itemName = req.body["nextTaskToday"];
  const newItem = new Item({ name: itemName});
  newItem.save();
  res.redirect("/");

});

app.post("/delete", (req, res)=>{
  const removedItemId= req.body.checkbox;
  Item.deleteOne({_id: removedItemId}).then(function(){
    console.log("deleted");
  
  })
  res.redirect("/");
})


app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({name: customListName}).then((data) => {
    if(data.length === 0) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/:" + customListName);
    }
    else {
      res.render("today.ejs", { head: data.name, list: data.items})
    }
  })
  
})


app.get("/", (req, res) => {
  Item.find().then((foundItems)=>{
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems).then(() => {console.log("inserted")});
      res.redirect("/");
    }
    else {
      res.render("today.ejs", {head: "today", list: foundItems});
    }
  })
});
app.listen(port, () => {
  console.log(`app runs at ${port}`);
});
