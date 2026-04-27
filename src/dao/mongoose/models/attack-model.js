const mongoose = require("mongoose");

const Attacks = new mongoose.Schema({
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
        required: true
    },
    fp_cost: {
        type: Number,
        required: true
    },
    sp_cost: {
        type: Number,
        required: true
    },
    damage: {
        type: Number,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    effect: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Attacks', Attacks);