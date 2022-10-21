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
        hasHeight === true ? this.height = generateHeight(this.age, this.gender) : this.height = undefined;
        hasWeight === true ? this.weight = generateWeight(this.age, this.gender) : this.height = undefined;
    }
};

function createUser(req) {
    let [hasEmail, hasPhone, hasAge, hasHeight, hasWeight] = Array(5).fill(undefined);
    "email" in req.body ? hasEmail = true : hasEmail = undefined;
    "phone" in req.body ? hasPhone = true : hasPhone = undefined;
    "age" in req.body ? hasAge = true : hasAge = undefined;
    "height" in req.body ? hasHeight = true : hasHeight = undefined;
    "weight" in req.body ? hasWeight = true : hasWeight = undefined;
    const user = new User(hasEmail, hasPhone, hasAge, hasHeight, hasWeight);
    return user;
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

/*
Returns the age range max value for a user for biometric lookup.

@param  {number}    age     test user's age in years

@return {number}            age range max corresponding to biometric data
*/
function getAgeRange(age) {
    let ageRangeMax = 0;
    switch(true) {
        case age < 30:
            ageRangeMax = 29;
            break;
        case age < 40:
            ageRangeMax = 39;
            break;
        case age < 50:
            ageRangeMax = 49;
            break;
        case age < 60:
            ageRangeMax = 59;
            break;
        case age < 70:
            ageRangeMax = 69;
            break;
        case age < 80:
            ageRangeMax = 79;
            break;
        default:
            ageRangeMax = 100;
    }
    return ageRangeMax;
}

/*
Generates a height for the test user based on their age and gender.

@param {number}     age     test user's age in years
@param {string}     gender  test user's gender

@return {number}    height  test user's height in centimeters
*/
function generateHeight(age, gender) {
    const ageRange = getAgeRange(age);
    let meanHeight = 0;
    let heightStErr = 0;
    for (const obj in biometricData) {
        if (biometricData[obj]["Gender"] === gender && biometricData[obj]["Age Range Max"] === ageRange) {
            meanHeight = biometricData[obj]["Mean Height"];
            heightStErr = biometricData[obj]["Height Standard Error"];
        }
    }
    const heightDist = random.normal((meanHeight), (heightStErr));
    const height = Math.round(heightDist());
    return height;
};

/*
Generates a weight for the test user based on their age and gender.

@param {number}     age     test user's age in years
@param {string}     gender  test user's gender

@return {number}    height  test user's weight in kilograms
*/
function generateWeight(age, gender) {
    const ageRange = getAgeRange(age);
    let meanWeight = 0;
    let weightStErr = 0;
    for (const obj in biometricData) {
        if (biometricData[obj]["Gender"] === gender && biometricData[obj]["Age Range Max"] === ageRange) {
            meanWeight = biometricData[obj]["Mean Weight"];
            weightStErr = biometricData[obj]["Weight Standard Error"];
        }
    }
    const weightDist = random.normal((meanWeight), (weightStErr));
    const weight = Math.round(weightDist());
    return weight;
}

module.exports = { createUser }