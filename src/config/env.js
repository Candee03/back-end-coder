import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoUrl : process.env.MONGO_URL,
    secretKey : process.env.SECRET_KEY,
    port : process.env.PORT,
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET,
    callback_url : process.env.CALLBACK_URL
}