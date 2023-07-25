import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
app.use(express.static("public"));

var todayList=["first"];
var workList=["first"];
app.post("/today", (req, res)=>{
    var newTask= req.body["nextTaskToday"];
    console.log("today: " +newTask);
    todayList.push(newTask);
    console.log(todayList);
    res.render("today.ejs");
})

app.post("/work", (req, res)=>{
    var newTask = req.body["nextTaskWork"];
    console.log("work: " + newTask);
    workList.push(newTask);
    console.log(workList);

})

app.get("/work", (req, res)=>{
    res.render("work.ejs");
})
app.get("/", (req, res)=>{
    res.render("today.ejs")
})
app.listen(port, ()=>{
    console.log(`app runs at ${port}`);
})