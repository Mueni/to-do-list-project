const express = require("express");
const mongoose = require('mongoose');
const config = require('./config/database');
const app = express();

//models
const TodoTask = require("./models/TodoTask");

//loadstatic assets with virtual path
app.use("/static", express.static("public"));

//Setting up the front end (html)
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

//port number
const port = 3000;

//db connection
mongoose.connect(config.database);

//on connection
mongoose.connection.on('connected', function () {
    console.log('Connected to database' + config.database);
    app.listen(port, () => {
        console.log('to do server up on port' + port)
    });
});

//error connection
mongoose.connection.on('error', function (err) {
    console.log('database error' + err);
});


// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        //res.send("i am here")
        res.render("todo.ejs", { todoTasks: tasks });
    });
});


//POST METHOD
app.post('/', async (req, res) => {
    // console.log(req.body);

    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});


