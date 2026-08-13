const User = require('../models/user');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },
    createUser: async (userData) => {
        const user = new User(userData);
        const savedUser = await user.save();
        return savedUser;
    },
    findById: async (id) => {
        const user = await User.findById(id).select('-password');
        return user;
    }
};

module.exports = userDao;
