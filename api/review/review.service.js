import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import { ObjectId } from 'mongodb'

export const reviewService = {
  query,
  remove,
  add,
}

async function query(filterBy = {}) {

  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('review')

    var reviews = await collection
      .aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: 'user',
            foreignField: '_id',
            localField: 'byUserId',
            as: 'byUser',
          },
        },
        {
          $unwind: '$byUser',
        },
        {
          $lookup: {
            from: 'toy',
            foreignField: '_id',
            localField: 'aboutToyId',
            as: 'aboutToy',
          },
        },
        {
          $unwind: '$aboutToy',
        },
        {
          $project: {
            _id: true,
            txt: 1,
            byUser: { _id: 1, fullname: 1 },
            aboutToy: { _id: 1, name: 1, price: 1 },
          },
        },
      ])
      .toArray()
    return reviews
  } catch (err) {
    logger.error('cannot find reviews', err)
    throw err
  }
}

async function remove(reviewId) {
  try {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const collection = await dbService.getCollection('review')

    const criteria = { _id: ObjectId.createFromHexString(reviewId) }
    if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)

    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      byUserId: ObjectId.createFromHexString(review.byUserId),
      aboutToyId: ObjectId.createFromHexString(review.aboutToyId),
      txt: review.txt,
    }
    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)
    console.log('reviewToAdd:', reviewToAdd)
    return reviewToAdd
  } catch (err) {
    logger.error('cannot insert review', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.byUserId) criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
  if (filterBy.aboutToyId) criteria.aboutToyId = ObjectId.createFromHexString(filterBy.aboutToyId)
  return criteria
}




