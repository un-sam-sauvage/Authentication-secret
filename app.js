//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {
    secret: secret,
    encryptedFields : ["password"]
});

const User = new mongoose.model('User', userSchema);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(3000, function () {
    console.log("Server started")
});

app.get("/logout", function (req, res) {
    res.render("home");
});
app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    });
})
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        email: username,
        
    }, function (err, userFound) {
        if (!err && userFound != null && userFound.password === password) {
            res.render("secrets")
        } else {
            console.log(err)
        }
    })
});