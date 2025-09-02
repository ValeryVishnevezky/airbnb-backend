import { stayService } from './stay.service.js'
import { loggerService } from '../../services/logger.service.js'

export const stayController = {
	getStays,
	getStayById,
	addStay,
	updateStay,
	removeStay
	// addStayMsg,
	// removeStayMsg
}

async function getStays(req, res) {
	try {
		const filterBy = {
			place: req.query.place || '',
			minCapacity: req.query.minCapacity ? Number(req.query.minCapacity) : '',
			availableDates: req.query.availableDates || '',
			label: req.query.label || '',
			page: +req.query.page ? Number(req.query.page) : 0,
			limit: +req.query.limit ? Number(req.query.limit) : 20
		}
		const stays = await stayService.query(filterBy)
		stays.forEach(stay => {
			stay.imgUrls = stay.imgUrls.map(url => getOptimizedUrl(url))
		})

		res.send(stays)
	} catch (err) {
		loggerService.error('Failed to get stays', err)
		res.status(500).send({ err: 'Failed to get stays' })
	}
}

async function getStayById(req, res) {
	try {
		const stayId = req.params.id
		const stay = await stayService.getById(stayId)
		// stay.imgUrls = stay.imgUrls.map(url => optimizeImageUrl(url))
		const optimizedStay = {
			...stay,
			imgUrls: stay.imgUrls.map(url => getOptimizedUrl(url))
		}
		res.send(stay)
	} catch (err) {
		loggerService.error('Failed to get stay', err)
		res.status(500).send({ err: 'Failed to get stay' })
	}
}

async function addStay(req, res) {
	const { loggedinUser } = req
	try {
		const stay = req.body
		stay.owner = loggedinUser
		const addedStay = await stayService.add(stay)
		res.send(addedStay)
	} catch (err) {
		loggerService.error('Failed to add stay', err)
		res.status(500).send({ err: 'Failed to add stay' })
	}
}

async function updateStay(req, res) {
	try {
		const stay = req.body
		const updatedStay = await stayService.update(stay)
		res.send(updatedStay)
	} catch (err) {
		loggerService.error('Failed to update stay', err)
		res.status(500).send({ err: 'Failed to update stay' })
	}
}

async function removeStay(req, res) {
	try {
		const stayId = req.params.id
		await stayService.remove(stayId)
		res.send()
	} catch (err) {
		loggerService.error('Failed to remove stay', err)
		res.status(500).send({ err: 'Failed to remove stay' })
	}
}

function getOptimizedUrl(url, width = 600, quality = 70) {
	return `${url}&im_w=${width}&im_q=${quality}&im_format=webp`
}

// async function addStayMsg(req, res) {
//     const { loggedinUser } = req
//     const { _id, fullname } = loggedinUser
//     try {
//         const stayId = req.params.id
//         const msg = {
//             txt: req.body.txt,
//             by: { _id, fullname },
//         }
//         const savedMsg = await stayService.addStayMsg(stayId, msg)
//         res.json(savedMsg)
//     } catch (err) {
//         logger.error('Failed to update stay', err)
//         res.status(500).send({ err: 'Failed to update stay' })
//     }
// }

// async function removeStayMsg(req, res) {
//     // const { loggedinUser } = req
//     try {
//         const stayId = req.params.id
//         const { msgId } = req.params

//         const removedId = await stayService.removeStayMsg(stayId, msgId)
//         res.send(removedId)
//     } catch (err) {
//         logger.error('Failed to remove stay msg', err)
//         res.status(500).send({ err: 'Failed to remove stay msg' })
//     }
// }
