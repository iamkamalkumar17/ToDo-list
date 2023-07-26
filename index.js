import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//set the static folder to public
app.use(express.static("public"));

var todayList = ["First of the day"];
var workList = ["Got to work"];

const date = new Date();
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var toPrint =
  weekday[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate();

app.post("/today", (req, res) => {
  var newTask = req.body["nextTaskToday"];
  console.log("today: " + newTask);
  if (newTask.length > 0) todayList.push(newTask);
  res.render("today.ejs", {
    list: todayList,
    head: toPrint,
  });
});

app.post("/work", (req, res) => {
  var newTask = req.body["nextTaskWork"];
  console.log("work: " + newTask);
  if (newTask.length > 0) workList.push(newTask);
  res.render("work.ejs", {
    list: workList,
  });
});

app.get("/work", (req, res) => {
  res.render("work.ejs", {
    list: workList,
  });
});
app.get("/", (req, res) => {
  res.render("today.ejs", {
    list: todayList,
    head: toPrint,
  });
});
app.listen(port, () => {
  console.log(`app runs at ${port}`);
});
