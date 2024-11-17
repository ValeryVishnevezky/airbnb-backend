import Cryptr from 'cryptr'
import bcryptjs from 'bcryptjs'
import dotenv from "dotenv"

dotenv.config()

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}
const apiUrl = process.env.REACT_APP_SPOTIFY_API_URL;

const cryptr = new Cryptr(process.env.AUTH_KEY )

async function login(username, password) {
    loggerService.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')

    const match = await bcryptjs.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname) {
    const saltRounds = 10

    loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)

    if (!username || !password || !fullname) return Promise.reject('Missing required signup information')
        
    const hash = await bcryptjs.hash(password, saltRounds)
    const user = { username, password: hash, fullname }
    return userService.add(user)
}

function getLoginToken(user) {
    const userInfo = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }
    const token = cryptr.encrypt(JSON.stringify(userInfo))
    loggerService.debug('Generated token:', token)
    return token
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}
