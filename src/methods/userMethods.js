const bcrypt = require("bcryptjs")

const validatePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

module.exports = { validatePassword };