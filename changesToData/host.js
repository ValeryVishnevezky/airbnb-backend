import { dbService } from '../services/db.service.js'
import { ObjectId } from 'mongodb'

const user = {
  _id: new ObjectId("6738f80fc2e1f893eb7d74a0"),
  username: "valery",
  password: "$2a$10$XWB1cgMCPzYnwMNeNaLgqOvzY1lHsqkw7ywkD/6sNTJg7i03pCoa2",
  fullname: "Valery Vi",
  isAdmin: true,
  imgUrl: "https://ca.slack-edge.com/T07G2AGFSKT-U07G0636EFR-3f1d3ac2396d-512",
}

const stayIdsToUpdate = [
    "6738ca4cae769d402b653c8f",
    "6738ca4cae769d402b653d2f",
    "6738ca4cae769d402b653d6e",
    "6738ca4cae769d402b653cc5",
    "6738ca4cae769d402b653d4b",
    "6738ca4cae769d402b653dd6",
    "6738ca4cae769d402b653dc4",
    "6738ca4cae769d402b653ca5",
    "6738ca4cae769d402b653cb4",
    "6738ca4cae769d402b653d05",
    "6738ca4cae769d402b653d90",
    "6738ca4cae769d402b653d9d",
    "6738ca4cae769d402b653d7e",
    "6738ca4cae769d402b653c9f",
    "6738ca4cae769d402b653c7f",
    "6738ca4cae769d402b653cbf",
    "6738ca4cae769d402b653d32",
    "6738ca4cae769d402b653db4",
    "6738ca4cae769d402b653dd2",
    "6738ca4cae769d402b653cd8",
    "6738ca4cae769d402b653d76",
    "6738ca4cae769d402b653c89",
    "6738ca4cae769d402b653d7c"
]

async function updateStaysWithUserAsHost() {
  try {
    const collection = await dbService.getCollection('stays')
    const stays = await collection.find({ _id: { $in: stayIdsToUpdate.map(id => new ObjectId(id)) } }).toArray()

    for (const stay of stays) {
      const updatedHost = {
        _id: user._id,
        fullname: user.fullname,
        about: "Love to travel and meet interesting people!",
        responseTime: "within an hour",
        isSuperhost: true,
        pictureUrl: user.imgUrl
      }

      await collection.updateOne(
        { _id: stay._id },
        { $set: { host: updatedHost } }
      )
    }

    console.log('Hosts updated successfully for all stays.')
  } catch (err) {
    console.error('Error updating stays:', err)
  }
}

updateStaysWithUserAsHost()
  .then(() => {
    console.log('Update finished')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Error during update:', err)
    process.exit(1)
  })
