'use strict';

const random = require('random');
const femaleFirstNamesLib = require('@stdlib/datasets-female-first-names-en');
const maleFirstNamesLib = require('@stdlib/datasets-male-first-names-en');
const lastNamesLib = require('common-last-names');
const emailDomains = require('email-domains');
const biometricData = require('./biometric_data.json');
const {addYears, getYear} = require('date-fns');

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
        hasAge === true ? this.age = getYear(new Date()) - generateBirthYear() : this.age = undefined;
        this.height = undefined;
        this.weight = undefined;
    }
};

function createUser(req, res) {
    let [hasEmail, hasPhone, hasAge, hasHeight, hasWeight] = Array(5).fill(undefined);
    "email" in req.body ? hasEmail = true : hasEmail = undefined;
    "phone" in req.body ? hasPhone = true : hasPhone = undefined;
    "age" in req.body ? hasAge = true : hasAge = undefined;
    const user = new User(hasEmail, hasPhone, hasAge, hasHeight, hasWeight);
    res.send(user);
};

/*
Randomly sets gender.

@return {string}    gender
*/
function setGender() {
    const gender = random.boolean() === true ? "Female" : "Male";
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
        firstName = femaleFirstNames[random.int((0), (femaleFirstNames.length))];
    } else {
        firstName = maleFirstNames[random.int((0), (maleFirstNames.length))];
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

    // randomly select an email address pattern
    switch (random.int((1), (5))) {
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
    let hasNumbers = random.boolean() === true ? true : false;
    if (hasNumbers === true) {
        let nums = random.int((0), (9999));
        return `${email}${nums.toString()}@${domain}`;
    }
    return `${email}@${domain}`;
};

/*
Generates a random phone number.

@return {string}    phone number
*/
function generatePhone() {
    let areaCode = random.int((100), (999));
    let exchangeCode = "555"
    let subscriberCode = random.int((0), (9999));
    subscriberCode = subscriberCode.toString();
    // ensure subscriberCode is always 4 digits long
    while (subscriberCode.length < 4) {
        subscriberCode = "0" + subscriberCode;
    }
    return `(${areaCode}) ${exchangeCode}-${subscriberCode}`;
}

/*
Generates a random birthdate.

@return 
*/
function generateBirthYear() {
    const today = new Date();
    const startYear = getYear(addYears(today, -85));
    const endYear = getYear(addYears(today, -20));
    const birthYear = random.int((startYear), (endYear));
    return birthYear;
};

module.exports = { createUser }