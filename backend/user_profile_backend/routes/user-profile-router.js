const express = require('express')

const bodyParser = require('body-parser')
const { validateUser } = require('../middleware/validateUser')
const { validateAdmin } = require('../middleware/validateAdmin')

const getUserById = require('../controller/getUser').getUserById
const getUserByName = require('../controller/getUser').getUserByName
const getUsers = require('../controller/getUser').getUsers

const createUser = require('../controller/createUser').createUser

const deleteUserByUserID = require('../controller/deleteUser').deleteUserByUserID

const updateUserInfo = require('../controller/updateUser').updateUserInfo

const loginUser = require('../controller/getUser').loginUser

const checkUSerAdmin = require('../controller/checkUserAdmin').checkUSerAdmin
const setUserAdmin = require('../controller/setUserAdmin').setUserAdmin

const app = express()
const router = express.Router()

router.use(express.json())

// Define your routes
router.post('/login', loginUser)
router.post('/createUser', createUser)
router.get('/users', [validateUser], getUsers)
router.get('/userById', getUserById)
router.get('/userByName', [validateUser], getUserByName)
router.put('/updateUser', [validateUser], updateUserInfo)
router.delete('/deleteUser', [validateUser], deleteUserByUserID)
router.get('/checkUserAdmin', [validateUser], checkUSerAdmin)
router.put('/setUserAdmin', [validateUser, validateAdmin], setUserAdmin)

module.exports = router