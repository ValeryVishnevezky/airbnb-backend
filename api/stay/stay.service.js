import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const stayService = {
	query,
	getById,
	remove,
	update,
	add,
	addStayMsg,
	removeStayMsg
}

async function query(filterBy) {
	try {
		console.log('Generated query filterBy:', filterBy)
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('stays')
		// const stays = await collection.find(criteria).toArray()
		let cursor = collection.find(criteria)

		if (filterBy.limit) {
			cursor = cursor
				.sort({ rating: -1, _id: 1 })
				.skip(filterBy.page * filterBy.limit)
				.limit(filterBy.limit)
		}

		const stays = await cursor.toArray()
		return stays
	} catch (err) {
		loggerService.error('ERROR: cannot find stays')
		console.error('Query filter criteria:', criteria)
		throw err
	}
}

async function getById(stayId) {
	try {
		const collection = await dbService.getCollection('stays')
		const stay = await collection.findOne({ _id: ObjectId.createFromHexString(stayId) })
		return stay
	} catch (err) {
		loggerService.error(`ERROR: cannot find stay ${stayId}`)
		throw err
	}
}

async function remove(stayId) {
	try {
		const collection = await dbService.getCollection('stays')
		return await collection.deleteOne({ _id: ObjectId.createFromHexString(stayId) })
	} catch (err) {
		loggerService.error(`ERROR: cannot remove stay ${stayId}`)
		throw err
	}
}

async function update(stay) {
	try {
		const stayToSave = {
			name: stay.name || '',
			summary: stay.summary || '',
			imgUrls: stay.imgUrls || [],
			loc: stay.loc || { city: '', country: '' },
			price: stay.price || 0,
			capacity: stay.capacity || 0
		}
		const collection = await dbService.getCollection('stays')
		await collection.updateOne({ _id: ObjectId.createFromHexString(stay._id) }, { $set: stayToSave })
		return stay
	} catch (err) {
		loggerService.error(`ERROR: cannot update stay ${stay._id}`)
		throw err
	}
}

async function add(stay) {
	try {
		const stayToSave = {
			name: stay.name || '',
			summary: stay.summary || '',
			imgUrls: stay.imgUrls || [],
			loc: stay.loc || { city: '', country: '' },
			price: stay.price || 0,
			capacity: stay.capacity || 0,
			amenities: stay.amenities || [],
			availableDates: stay.availableDates || [
				{
					month: 'Nov',
					start: '20',
					end: '30'
				}
			],
			reviews: stay.reviews || [],
			host: stay.host || '',
			msgs: stay.msgs || []
		}
		const collection = await dbService.getCollection('stays')
		await collection.insertOne(stayToSave)
		return stay
	} catch (err) {
		loggerService.error(`ERROR: cannot insert stay`)
		throw err
	}
}

async function addStayMsg(stayId, msg) {
	try {
		msg.id = utilService.makeId()
		const collection = await dbService.getCollection('stays')
		await collection.updateOne({ _id: ObjectId.createFromHexString(stayId) }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		logger.error(`cannot add stay msg ${stayId}`, err)
		throw err
	}
}

async function removeStayMsg(stayId, msgId) {
	try {
		const collection = await dbService.getCollection('stays')
		await collection.updateOne({ _id: ObjectId.createFromHexString(stayId) }, { $pull: { msgs: { id: msgId } } })
		return msgId
	} catch (err) {
		logger.error(`cannot remove stay msg ${stayId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const { place, adults, children, infants, pets, availableDates, label } = filterBy
	const criteria = {}
	if (place) {
		criteria.$or = [{ 'loc.city': { $regex: place, $options: 'i' } }, { 'loc.country': { $regex: place, $options: 'i' } }]
	}
	const totalGuests = (adults || 0) + (children || 0) + (infants || 0) + (pets || 0)
	if (totalGuests > 0) {
		criteria.capacity = { $gte: totalGuests }
	}
	if (availableDates) {
		if (availableDates.start) {
			const startDate = new Date(availableDates.start)
			criteria['availableDates.start'] = { $lte: startDate }
		}
		if (availableDates.end) {
			const endDate = new Date(availableDates.end)
			criteria['availableDates.end'] = { $gte: endDate }
		}
	}
	if (label) {
		criteria.labels = { $in: [label] }
	}
	console.log(criteria)

	return criteria
}
