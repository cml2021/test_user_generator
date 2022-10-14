'use strict';

const express = require('express');
const femaleFirstNamesLib = require( '@stdlib/datasets-female-first-names-en' );
const maleFirstNamesLib = require('@stdlib/datasets-male-first-names-en');
const lastNamesLib = require('common-last-names');
const emailDomains = require('email-domains');

const app = express();
const PORT = 3000;
const femaleFirstNames = femaleFirstNamesLib();
const maleFirstNames = maleFirstNamesLib();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

/*
User object represents a test user with a name and optionally an email address, phone number, age, birthday, height, and weight.
*/
class User {
    constructor(email) {
        this.name = generateName();
        this.email = generateEmail(this.name);
        this.phone = undefined;
        this.age = undefined;
        this.birthday = undefined;
        this.height = undefined;
        this.weight = undefined;
    }
};

/*
Generates a random first and last name.

@return {string}    name     
*/
function generateName() {
    let isFemale = Math.round(Math.random()) === 1 ? true : false;
    let firstName = "";
    if (isFemale === true) {
        firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    } else {
        firstName = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
    }
    const lastName = lastNamesLib.random();
    return `${firstName} ${lastName}`;
}

/*
Generates an email address based on the user's name and common patterns.

@param  {string}    name    user's name 

@return {string}    email address     
*/
function generateEmail(name) {
    // assumes first and last name are each single strings
    const nameArr = name.split(" ");
    const first = nameArr[0].toLowerCase();
    const last = nameArr[1].toLowerCase(); 
    const domain = emailDomains.random();
    let email = "";

    switch (Math.floor(Math.random() * 5 + 1)) {
        case 1:
            email = `${first}${last}`;
            break;
        case 2:
            email = `${first}.${last}`;
            break;
        case 3:
            email = `${first}_${last}`
            break;
        case 4:
            email = `${first}`
            break;
        case 5:
            email = `${first}${last[0]}`
    }

    let hasNumbers = Math.round(Math.random()) === 1 ? true : false;
    if (hasNumbers === true) {
        let nums = Math.floor(Math.random()*1000);
        return `${email}${nums.toString()}@${domain}`;
    }
    return `${email}@${domain}`;
};

function createUser(req, res) {
    let email = undefined;
    if ("email" in req.body) {
        email = req.body.email;
    }
    const user = new User(email);
    res.send(user);
}

// Request Handlers

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
});

app.post("/create", (req, res) => {
    createUser(req, res);
});