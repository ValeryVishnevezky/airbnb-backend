import { dbService } from '../services/db.service.js'

async function addWish() {
    try {
      const collection = await dbService.getCollection('stays')
      
      await collection.updateMany(
        {},
        { $set: { wishlist: [] } }
      )
      
      console.log('Wishlist added successfully to all stays.')
    } catch (err) {
      console.error('Error updating stays:', err)
    }
  }
  
  addWish()
    .then(() => {
      console.log('Update finished')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Error during update:', err)
      process.exit(1)
    })
  