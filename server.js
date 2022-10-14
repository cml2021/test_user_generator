'use strict';

const express = require('express');
const { createUser } = require('./user.js')

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Request Handlers

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});

app.post("/create", (req, res) => {
    createUser(req, res);
});