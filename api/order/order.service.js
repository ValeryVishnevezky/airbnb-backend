import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import { ObjectId } from 'mongodb'

export const orderService = {
  query,
  remove,
  add,
  update,
  getUserOrders,
  getHostOrders
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('orders')

    const orders = await collection
      .aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: 'user',
            foreignField: '_id',
            localField: 'userId',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'stay',
            foreignField: '_id',
            localField: 'stayId',
            as: 'stay',
          },
        },
        {
          $unwind: '$stay',
        },
        {
          $lookup: {
            from: 'user',
            foreignField: '_id',
            localField: 'hostId',
            as: 'host',
          },
        },
        {
          $unwind: '$host',
        },
        {
          $project: {
            _id: true,
            totalPrice: 1,
            startDate: 1,
            endDate: 1,
            guests: 1,
            status: 1,
            user: { _id: 1, fullname: 1, imgUrl: 1 },
            stay: { _id: 1, name: 1, price: 1, loc: 1 },
            host: { _id: 1, fullname: 1, rating: 1 },
          },
        },
      ])
      .toArray()

    return orders
  } catch (err) {
    loggerService.error('cannot find orders', err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const collection = await dbService.getCollection('orders')

    const criteria = { _id: ObjectId.createFromHexString(orderId) }
    if (!loggedinUser.isAdmin) criteria.userId = ObjectId.createFromHexString(loggedinUser._id)

    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    loggerService.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

async function add(order) {
  try {
    const orderToAdd = {
      userId: ObjectId.createFromHexString(order.userId),
      stayId: ObjectId.createFromHexString(order.stayId),
      hostId: ObjectId.createFromHexString(order.hostId),
      totalPrice: order.totalPrice,
      startDate: new Date(order.startDate),
      endDate: new Date(order.endDate),
      guests: order.guests,
      status: order.status || 'pending',
    }

    const collection = await dbService.getCollection('orders')
    await collection.insertOne(orderToAdd)
    console.log('orderToAdd:', orderToAdd)
    return orderToAdd
  } catch (err) {
    loggerService.error('cannot add order', err)
    throw err
  }
}

async function update(orderId, status) {
  try {
    const collection = await dbService.getCollection('orders')
    const result = await collection.updateOne(
      { _id: ObjectId.createFromHexString(orderId) },
      { $set: { status: status } }
    )

    console.log(`Order status updated: ${status}`)
    return result
  } catch (err) {
    loggerService.error('Cannot update order status', err)
    throw err
  }
}

async function getUserOrders(userId) {
  try {
    const collection = await dbService.getCollection('orders')
    const orders = await collection.find({
      userId: ObjectId.createFromHexString(userId)
    }).toArray()
    return orders
  } catch (err) {
    loggerService.error(`while finding orders for user: ${userId}`, err)
    throw err
  }
}

async function getHostOrders(hostId) {
  try {
    const collection = await dbService.getCollection('orders')
    const orders = await collection.find({
      hostId: ObjectId.createFromHexString(hostId)
    }).toArray()
    return orders
  } catch (err) {
    loggerService.error(`while finding orders for host: ${hostId}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.userId) criteria.userId = ObjectId.createFromHexString(filterBy.userId)
  if (filterBy.stayId) criteria.stayId = ObjectId.createFromHexString(filterBy.stayId)
  if (filterBy.hostId) criteria.hostId = ObjectId.createFromHexString(filterBy.hostId)
  return criteria
}
