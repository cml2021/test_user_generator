'use strict';

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

/*
User object represents a test user with a name and optionally an email address, phone number, age, birthday, height, and weight.
*/
class User {
    constructor(name, email, phone, age, height, weight) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.birthday = undefined;
        this.height = height;
        this.weight = weight;
    }
};

function generateName() {
    //
}

function createUser(req, res) {
    // TODO
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});

app.post("/create", (req, res) => {
    res.send(req.body);
})