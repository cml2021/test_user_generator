'use strict';

const femaleFirstNamesLib = require('@stdlib/datasets-female-first-names-en');
const maleFirstNamesLib = require('@stdlib/datasets-male-first-names-en');
const lastNamesLib = require('common-last-names');
const emailDomains = require('email-domains');

const femaleFirstNames = femaleFirstNamesLib();
const maleFirstNames = maleFirstNamesLib();

/*
Class representing a test user.
*/
class User {
    constructor(hasEmail, hasPhone, hasAge, hasHeight, hasWeight) {
        this.gender = setGender();
        this.name = generateName(this.gender);
        hasEmail === true ? this.email = generateEmail(this.name) : this.email = undefined;
        hasPhone === true ? this.phone = generatePhone() : this.phone = undefined;
        this.age = undefined;
        this.birthday = undefined;
        this.height = undefined;
        this.weight = undefined;
    }
};

// condition ? exprIfTrue : exprIfFalse

function createUser(req, res) {
    let [hasEmail, hasPhone, hasAge, hasHeight, hasWeight] = Array(5).fill(undefined);
    "email" in req.body ? hasEmail = true : hasEmail = undefined;
    "phone" in req.body ? hasPhone = true : hasPhone = undefined;
    const user = new User(hasEmail, hasPhone, hasAge, hasHeight, hasWeight);
    res.send(user);
};

/*
Randomly sets gender.

@return {string}    gender
*/
function setGender() {
    const gender = Math.round(Math.random()) === 1 ? "Female" : "Male";
    return gender;
}

/*
Generates a random first and last name.

@param  {string}    gender      user's gender

@return {string}    name     
*/
function generateName(gender) {
    let firstName = "";
    if (gender === "Female") {
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

    
    let max = 5;
    let min = 1;
    // randomly select an email address pattern
    switch (Math.floor(Math.random() * (max - min + 1) + min)) {
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

    // add random numbers to email address half the time
    let hasNumbers = Math.round(Math.random()) === 1 ? true : false;
    if (hasNumbers === true) {
        let nums = Math.floor(Math.random() * 1000);
        return `${email}${nums.toString()}@${domain}`;
    }
    return `${email}@${domain}`;
};

/*
Generates a random phone number.

@return {string}    phone number
*/
function generatePhone() {
    let min = 100;
    let max = 999;
    let areaCode = Math.floor(Math.random() * (max - min + 1) + min);

    let exchangeCode = "555"

    min = 0;
    max = 9999;
    let subscriberCode = Math.floor(Math.random() * (max - min + 1) + min);
    subscriberCode = subscriberCode.toString();
    // ensure subscriberCode is always 4 digits long
    while (subscriberCode.length < 4) {
        subscriberCode = "0" + subscriberCode;
    }
    return `(${areaCode}) ${exchangeCode}-${subscriberCode}`;
}

module.exports = { createUser }