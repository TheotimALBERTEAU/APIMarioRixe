const IDAOItems = require("../idaoitems");
const Item = require("./models/item-model");

class DAOItemsMongoose extends IDAOItems {
    async selectAll() {
        return await Item.find();
    }

    async selectById(id) {
        return await Item.findById(id)
    }
}

module.exports = DAOItemsMongoose;