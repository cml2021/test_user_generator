'use strict';

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const { createUser } = require('./user.js')

// Launch app
const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

// Connect to database and test connection
require('dotenv').config();
const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

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
