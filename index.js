import express from "express";
const app = express();

const port = 3000;
app.use(express.static("public"));

app.get("/work", (req, res)=>{
    res.render("work.ejs");
})
app.get("/", (req, res)=>{
    res.render("today.ejs")
})
app.listen(port, ()=>{
    console.log(`app runs at ${port}`);
})