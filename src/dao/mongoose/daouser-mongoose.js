const User = require('./models/user-model');
const IDAOUser = require('../idaouser')

class DAOUserMongoose extends IDAOUser {
    async selectByEmail(email) {
        return await User.findOne({ email: email })
    }

    async insert(user){
        const newUser = new User({
            email: user.email,
            password: user.password,
            pseudo: user.pseudo,
        })
        return await newUser.save()
    }

}

module.exports = DAOUserMongoose;