const IDAOAttacks = require("../idaoattacks");
const Attack = require("./models/attack-model");

class DAOAttacksMongoose extends IDAOAttacks {
    async selectAll() {
        return await Attack.find();
    }

    async selectById(id) {
        return await Attack.findById(id)
    }
}

module.exports = DAOAttacksMongoose;