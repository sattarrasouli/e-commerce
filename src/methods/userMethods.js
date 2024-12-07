const bcrypt = require("bcryptjs")

const validatePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

module.exports = { validatePassword };