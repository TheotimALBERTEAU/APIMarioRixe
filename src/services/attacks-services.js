const DAOFactory = require('../dao/dao-factory');

module.exports = {
    getAll: async () => {
        return await DAOFactory.getDAOAttack().selectAll();
    },

    getOneById: async (id) => {
        return await DAOFactory.getDAOAttack().selectById(id);
    }
}