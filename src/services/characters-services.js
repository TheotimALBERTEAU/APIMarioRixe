const DAOFactory = require('../dao/dao-factory');

module.exports = {
    getAll: async () => {
        const allCharacters = await DAOFactory.getDAOCharacter().selectAll();
        return allCharacters;
    }
}