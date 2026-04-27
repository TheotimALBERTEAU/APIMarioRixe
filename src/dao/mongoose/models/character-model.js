const mongoose = require("mongoose");

const Characters = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sprite: {
        type: String,
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    defense: {
        type: Number,
        required: true
    },
    attack: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Characters', Characters);