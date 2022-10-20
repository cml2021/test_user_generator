'use strict';

const express = require('express');
const { createUser } = require('./user.js')

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

// Request Handlers

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});

app.post("/create", (req, res) => {
    const user = createUser(req, res);
    testUser = user;
});

app.get("/user", (req, res) => {
    res.render("user");
})
