const bcrypt = require("bcryptjs")

const hashPassword = async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
}

module.exports = {
    beforeCreate: hashPassword
}