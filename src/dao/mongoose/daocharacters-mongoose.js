const IDAOCharacters = require("../idaocharacters");
const Character = require("./models/character-model");

class DAOCharacterMongoose extends IDAOCharacters {
    async selectAll() {
        return await Character.find();
    }

    async selectById(id) {
        return await Character.findById(id)
    }
}

module.exports = DAOCharacterMongoose;