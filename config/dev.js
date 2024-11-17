import dotenv from "dotenv"
dotenv.config()

export default {
    dbURL: process.env.MONGODB_URI,
    dbName: 'Ardnd',
}
