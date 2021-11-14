var bcrypt = require('bcryptjs')
const createError = require('http-errors')


module.exports = {
    hashPassword: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                    reject(createError.InternalServerError(err))
                    return
                }
                resolve(hash)
            })
        })
    },
    verifyPasswords: (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, result) {
                if (err) {
                    console.log(err)
                    reject(createError.InternalServerError(err))
                    return
                }
                if (!result) {
                    reject(createError.InternalServerError())
                    return
                }
                resolve()
            })
        })
    }
}