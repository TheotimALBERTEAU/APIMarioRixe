const mongoose = require("mongoose");

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
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Items', Items);