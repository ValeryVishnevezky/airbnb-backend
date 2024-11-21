import { loggerService } from '../../services/logger.service.js'
import { orderService } from './order.service.js'
import { userService } from '../user/user.service.js'
import { stayService } from '../stay/stay.service.js'

export const orderController = {
  getOrders,
  deleteOrder,
  addOrder,
  getUserOrders,
  getHostOrders
}

async function getOrders(req, res) {
  try {
    const orders = await orderService.query(req.query)
    res.send(orders)
  } catch (err) {
    loggerService.error('Cannot get orders', err)
    res.status(400).send({ err: 'Failed to get orders' })
  }
}

async function deleteOrder(req, res) {
  try {
    const deletedCount = await orderService.remove(req.params.id)
    if (deletedCount === 1) {
      res.send({ msg: 'Deleted successfully' })
    } else {
      res.status(400).send({ err: 'Cannot remove order' })
    }
  } catch (err) {
    loggerService.error('Failed to delete order', err)
    res.status(400).send({ err: 'Failed to delete order' })
  }
}

async function addOrder(req, res) {
  const { loggedinUser } = req
  try {
    let order = req.body
    console.log('Received order:', order)

    if (!validateObjectId(loggedinUser._id)) throw new Error('Invalid user ID format')
    if (!validateObjectId(order.stayId)) throw new Error('Invalid stay ID format')

    const stay = await stayService.getById(order.stayId)
    if (!stay) throw new Error('Stay not found')

    if (!stay.host || !stay.host._id || !validateObjectId(stay.host._id.toString())) {
      throw new Error('Invalid host ID format')
    }

    const host = await userService.getById(stay.host._id)
    if (!host) throw new Error('Host not found')

    order.userId = loggedinUser._id
    order.hostId = host._id.toString()
    order.totalPrice = _calculateTotalPrice(stay.price, order.guests, order.nights)
    order = await orderService.add(order)

    order.user = { _id: loggedinUser._id, fullname: loggedinUser.fullname, imgUrl: loggedinUser.imgUrl }
    order.stay = { _id: stay._id, name: stay.name, price: stay.price, loc: stay.loc }
    order.host = { _id: host._id, fullname: host.fullname, rating: host.rating }

    res.send(order)
  } catch (err) {
    loggerService.error('Failed to add order', err)
    res.status(400).send({ err: 'Failed to add order' })
  }
}

function _calculateTotalPrice(pricePerNight, guests, nights) {
  return pricePerNight * nights + (guests.adults + guests.children * 0.5) * 20
}

function validateObjectId(id) {
  if (typeof id !== 'string') return false
  return id.length === 24 && /^[a-fA-F0-9]+$/.test(id)
}

async function getUserOrders(req, res) {
  const { userId } = req.params
  try {
    const orders = await orderService.getUserOrders(userId)
    res.send(orders)
  } catch (err) {
    loggerService.error('Cannot get user orders', err)
    res.status(400).send({ err: 'Failed to get user orders' })
  }
}

async function getHostOrders(req, res) {
  const { hostId } = req.params
  console.log('Received hostId:', hostId)
  if (!validateObjectId(hostId)) throw new Error('Invalid hostId format')
  try {
    const orders = await orderService.getHostOrders(hostId)
    res.send(orders)
  } catch (err) {
    loggerService.error('Cannot get host orders', err)
    res.status(400).send({ err: 'Failed to get host orders' })
  }
}