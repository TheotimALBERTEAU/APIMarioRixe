const DAOFactory = require('../dao/dao-factory');

module.exports = {
    getAll: async () => {
        return await DAOFactory.getDAOItem().selectAll();
    },

    getOneById: async (id) => {
        return await DAOFactory.getDAOItem().selectById(id);
    }
}