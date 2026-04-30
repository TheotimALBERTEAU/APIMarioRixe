const DAOAttackMongoose = require("./mongoose/daoattacks-mongoose");
module.exports = {
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

    },

    getDAOUser: () => {
        if (process.env.BDD_MODE === "mongodb") {
            const DAOUserMongoose = require('./mongoose/daouser-mongoose');
            return new DAOUserMongoose();
        }

    }
}