module.exports = {
    // Retourne un IDEAOCharacter

    getDAOCharacter: () => {
        if (process.env.BDD_MODE === "mongodb") {
            const DAOCharacterMongoose = require('./mongoose/daocharacters-mongoose');
            return new DAOCharacterMongoose();
        }

    },

    getDAOItem: () => {
        if (process.env.BDD_MODE === "mongodb") {
            const DAOItemMongoose = require('./mongoose/daoitems-mongoose');
            return new DAOItemMongoose();
        }

    },

    getDAOAttack: () => {
        if (process.env.BDD_MODE === "mongodb") {
            const DAOAttackMongoose = require('./mongoose/daoattacks-mongoose');
            return new DAOAttackMongoose();
        }

    }
}