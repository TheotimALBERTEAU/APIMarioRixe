const mongoose = require("mongoose");

const Characters = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    attack: {
        type: Number,
        required: true
    },
    defense: {
        type: Number,
        required: true
    },
    fight_sprite: {
        type: String,
        required: true
    },
    inv_sprite: {
        type: String,
        required: true
    },
    move_set: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attacks'
    }],
    item_set: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items'
    }]
});

module.exports = mongoose.model('Characters', Characters);