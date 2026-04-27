module.exports = {
    // Retourne un IDEAOCharacter

    getDAOCharacter: () => {
        if (process.env.BDD_MODE === "mongodb") {
            const DAOCharacterMongoose = require('./mongoose/daocharacters-mongoose');
            return new DAOCharacterMongoose();
        }

    }
}