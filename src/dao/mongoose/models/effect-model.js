const mongoose = require("mongoose");

const EffectSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['buff', 'debuff', 'recovery'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    chance: {
        type: Number,
        min: 0,
        max: 1,
        required: true
    },
    mechanics: {
        damagePerTurn: { type: Number, default: null },
        healPerTurn: { type: Number, default: null },
        fpHealPerTurn: { type: Number, default: null },
        drainPerTurn: { type: Number, default: null },

        duration: { type: Number, default: null },
        stackable: { type: Boolean, default: false },

        immobilized: { type: Boolean, default: false },
        canGuard: { type: Boolean, default: true },

        attackMultiplier: { type: Number, default: null },
        attackIncrease: { type: Number, default: null },
        attackReduction: { type: Number, default: null },

        defenseMultiplier: { type: Number, default: null },
        damageMultiplier: { type: Number, default: null },
        damageReduction: { type: Number, default: null },

        missChance: { type: Number, default: null },
        targetMissChance: { type: Number, default: null },
        confusionChance: { type: Number, default: null },

        reflectDamage: { type: Number, default: null },
        reflectDamagePercent: { type: Number, default: null },
        contactOnly: { type: Boolean, default: false },

        extraTurn: { type: Boolean, default: false },
        skipTurn: { type: Boolean, default: false },
        turnMultiplier: { type: Number, default: null },

        speedMultiplier: { type: Number, default: null },
        fpCostMultiplier: { type: Number, default: null },

        setHpTo: { type: Number, default: null },
        swapHpFp: { type: Boolean, default: false },

        noDamage: { type: Boolean, default: false },
        autoRevive: { type: Boolean, default: false },
        reviveHp: { type: Number, default: null },

        immuneToStatus: { type: Boolean, default: false },
        nextAttackCritical: { type: Boolean, default: false },
        disableActionCommand: { type: Boolean, default: false },

        elementBoost: { type: String, default: null },
        damageOverArea: { type: Boolean, default: false },
        damageAmount: { type: Number, default: null },

        curesStatus: [{ type: String }],
        curesAllStatus: { type: Boolean, default: false },

        immuneEnemies: [{ type: String }],
        enemyOnly: { type: Boolean, default: false },

        instantEffect: { type: Boolean, default: false },
        randomEffect: { type: Boolean, default: false },
        veryRare: { type: Boolean, default: false },
        noCure: { type: Boolean, default: false },
        pierceable: { type: Boolean, default: false },
        oneTime: { type: Boolean, default: false },
        visualAlert: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Effect', EffectSchema);