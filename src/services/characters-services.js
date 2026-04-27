const DAOFactory = require('../dao/dao-factory');

module.exports = {
    find_all_characters: async () => {
        const allCharacters = await DAOFactory.getDAOCharacter.selectAll();
        return allCharacters;
    }
}