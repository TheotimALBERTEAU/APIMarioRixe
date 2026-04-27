const DAOFactory = require('../dao/dao-factory');

module.exports = {
    getAll: async () => {
        const allCharacters = await DAOFactory.getDAOCharacter().selectAll();
        return allCharacters;
    },

    getOneById: async (id) => {
        const character = await DAOFactory.getDAOCharacter().selectById(id);
        return character;
    }
}