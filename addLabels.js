import { dbService } from './services/db.service.js'

function getRandomFavorite() {
  return Math.random() < 0.4;
}

async function updateStaysWithRandomFavorite() {
  try {
    const collection = await dbService.getCollection('stays');
    const stays = await collection.find({}).toArray();
    
    for (const stay of stays) {
      const isGuestFavorite = getRandomFavorite();
      await collection.updateOne(
        { _id: stay._id },
        { $set: { isGuestFavorite: isGuestFavorite } },
        { $unset: { guestFavorit: "" } }
      );
    }
    
    console.log('isGuestFavorite updated successfully for all stays.');
  } catch (err) {
    console.error('Error updating isGuestFavorite:', err);
  }
}

updateStaysWithRandomFavorite()
  .then(() => {
    console.log('Update finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during update:', err);
    process.exit(1);
  });
