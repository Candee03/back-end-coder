import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoUrl : process.env.MONGO_URL,
    secretKey : process.env.SECRET_KEY,
    port : process.env.PORT
}