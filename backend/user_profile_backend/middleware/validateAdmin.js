const axios = require('axios')
const { verifyJsonWebToken } = require('./tokenUtils')
const USER_HOST = process.env.USER_HOST ? process.env.USER_HOST : "http://localhost:4000/api/users"


async function validateAdmin (request, response, next) {
    const token = request.headers.authorization
    console.log(token)
    try {
        const is_admin = verifyJsonWebToken(token).user_data.is_admin
        if (!is_admin) {
            return response.status(401).json({ error: 'Unauthorised access. User not admin.' })
        }
    } catch (error) {
        console.log("error")
        console.log(error.message)
        return response.status(401).json({ error: 'Unauthorised' })
    }

    next()
}

module.exports = {
    validateAdmin
}