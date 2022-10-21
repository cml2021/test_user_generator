const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    gender: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    phone: {
        required: false,
        type: String
    },
    age: {
        required: false,
        type: Number
    },
    height: {
        required: false,
        type: Number
    },
    weight: {
        required: false,
        type: Number
    },
    created: {
        required: true,
        type: Date
    }
})

module.exports = mongoose.model('Data', dataSchema)