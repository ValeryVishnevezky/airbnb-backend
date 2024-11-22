import { dbService } from '../services/db.service.js'

// async function updateStaysDates() {
//     try {
//         const collection = await dbService.getCollection('stays')
//         const fixedEndDate = new Date('2030-12-31T00:00:00Z')
//         const stays = await collection.find().toArray()

//         for (const stay of stays) {
//             const now = new Date()
//             const fixedStartDate = Math.random() < 0.5
//                 ? new Date(2024, 10, 1) // 2024-11-01
//                 : new Date(2025, 2, 1) // 2025-03-01

//             const updatedDates = [
//                 {
//                     start: fixedStartDate,
//                     end: fixedEndDate,
//                 }
//             ]

//             await collection.updateOne(
//                 { _id: stay._id },
//                 {
//                     $set: { availableDates: updatedDates },
//                 }
//             )
//         }

//         console.log('Stays dates update successfully')
//     } catch (err) {
//         console.error('Error during update:', err)
//     }
// }

// updateStaysDates()
//     .then(() => {
//         console.log('Update finished')
//         process.exit(0)
//     })


async function updateTropicalStays() {
    try {
        const collection = await dbService.getCollection('stays')
        const tropicalStartDate = new Date(2024, 10, 1) // 2024-11-01

        const result = await collection.updateMany(
            { labels: { $in: ['Tropical'] } },
            { $set: { 'availableDates.0.start': tropicalStartDate } }
        )

        console.log(`Updated ${result.modifiedCount} stays with the "Tropical" label.`)
    } catch (err) {
        console.error('Error updating tropical stays:', err)
    }
}

updateTropicalStays()
    .then(() => {
        console.log('Update finished')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Error during update:', err)
        process.exit(1)
    })
