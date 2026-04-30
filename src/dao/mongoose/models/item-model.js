const mongoose = require("mongoose");
const {userConnection} = require("../connection");

const Items = new mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['attack', 'recovery', 'buff', 'debuff', 'gamble'],
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    fp: {
        type: Number,
        required: true
    },
    effect: {
        slug: { type: String, ref: 'Effect', default: null },
        chance: { type: Number, min: 0, max: 1, default: 1.0 }
    }
});

module.exports = mongoose.model('Items', Items);