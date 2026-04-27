const IDAOCharacter = require("../idaocharacters");
const Character = require("./models/character-model");

class DAOCharacterMongoose extends IDAOCharacters {
    async selectAll() {
        return await Character.find();
    }
}

module.exports = DAOCharacterMongoose;