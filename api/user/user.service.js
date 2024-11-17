import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb'

export const userService = {
	query,
	getById,
	getByUsername,
	remove,
	update,
	add,
}

async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	try {
		const collection = await dbService.getCollection('users')
		var users = await collection.find(criteria).toArray()
		users = users.map((user) => {
			delete user.password
			user.createdAt = ObjectId.createFromHexString(user._id).getTimestamp()
			return user
		})
		return users
	} catch (err) {
		loggerService.error('cannot find users', err)
		throw err
	}
}

async function getById(userId) {
	try {
		const collection = await dbService.getCollection('users')
		const user = await collection.findOne({
			_id: ObjectId.createFromHexString(userId),
		})
		delete user.password
		return user
	} catch (err) {
		loggerService.error(`while finding user by id: ${userId}`, err)
		throw err
	}
}

async function getByUsername(username) {
	try {
		const collection = await dbService.getCollection('users')
		const user = await collection.findOne({ username })
		if (!user) {
            loggerService.error('User not found')
        }
		return user
	} catch (err) {
		loggerService.error(`while finding user by username: ${username}`, err)
		throw err
	}
}

async function remove(userId) {
	try {
		const collection = await dbService.getCollection('users')
		await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
	} catch (err) {
		loggerService.error(`cannot remove user ${userId}`, err)
		throw err
	}
}

async function update(user) {
	try {
		const userToSave = {
			fullname: user.fullname,
		}
		const collection = await dbService.getCollection('users')
		await collection.updateOne({ _id: ObjectId.createFromHexString(user._id) }, { $set: userToSave })
		return user
	} catch (err) {
		loggerService.error(`cannot update user ${user._id}`, err)
		throw err
	}
}

async function add(user) {
	try {
		const userToAdd = {
			username: user.username,
			password: user.password,
			fullname: user.fullname,
			isAdmin: false,
		}
		const collection = await dbService.getCollection('users')
		const result = await collection.insertOne(userToAdd)
        userToAdd._id = result.insertedId
		return userToAdd
	} catch (err) {
		loggerService.error('cannot add user', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	if (filterBy.txt) {
		const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
		criteria.$or = [
			{
				username: txtCriteria,
			},
			{
				fullname: txtCriteria,
			},
		]
	}
	if (filterBy.minBalance) {
		criteria.score = { $gte: filterBy.minBalance }
	}
	return criteria
}