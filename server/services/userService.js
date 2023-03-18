const User = require("../model/userModel")

class UserService {
    async findUser(filter){
        return await User.findOne(filter);
    }

    async createUser(data){
        return await User.create(data);
    }

}


module.exports = new UserService();