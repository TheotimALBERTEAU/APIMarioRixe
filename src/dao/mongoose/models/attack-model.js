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
        enum: ['attack', 'recovery', 'buff', 'debuff'],
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
        slug: { type: String, ref: 'Effect', default: null },
        chance: { type: Number, min: 0, max: 1, default: 1.0 }
    }
});

module.exports = mongoose.model('Attacks', Attacks);