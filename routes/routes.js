const express = require('express');
const Model = require('../models/model');
const { createUser } = require('../user.js');

const router = express.Router();

// POST method to create a test user
router.post("/create", async (req, res) => {
    const user = createUser(req)
    const data = new Model({
        name: user.name,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        age: user.age,
        height: user.height,
        weight: user.weight,
        created: user.created
    })
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
})

module.exports = router;