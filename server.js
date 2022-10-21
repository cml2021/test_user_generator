'use strict';

// Import modules

const express = require('express');
const mongoose = require('mongoose');
const { createUser } = require('./user.js')
const routes = require('./routes/routes');

// Launch app

const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes)

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});