const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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
  name : "<--click this button to delete any task"
});
const defaultItems = [item1, item2];  
// Item.insertMany(defaultItems).then(() => {console.log("inserted")});



app.post("/", (req, res) => {
  const itemName = req.body.nextTask;
  const listName = req.body.list;

  const newItem = new Item({ name: itemName});

  if(listName =="Today") {
    newItem.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: listName}).then((foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

});

app.post("/deleteActivity", (req, res)=>{
  const removedItemId= req.body.checkbox;
  const listName = req.body.listName;
  
  if(listName === "Today") {
    Item.deleteOne({_id: removedItemId}).then(function(){
      console.log("Deleted and item from 'Today'");
    
    })
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: removedItemId}}}).then((foundList) => {
      res.redirect("/" + listName);
    });
  }
  
})


app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}).then((data) => {
    if(!data) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
    }
    else {
      res.render("list.ejs", { listHead: data.name, activities: data.items})
    }
  }).catch((err) => {console.log(`There have been some mistake, ERROR CODE: ${err}`)});
  
})


//default
app.get("/", (req, res) => {
  Item.find().then((foundItems)=>{
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems).then(() => {console.log("inserted")});
      res.redirect("/");
    }
    else {
      res.render("list.ejs", {listHead: "Today", activities: foundItems});
    }
  })
});




app.listen(port, () => {
  console.log(`app runs at ${port}`);
});
