import dotenv from 'dotenv'

dotenv.config()

export default {
    ENVIROMENT: process.env.ENVIROMENT,
    mongoUrl : process.env.MONGO_URL,
    secretKey : process.env.SECRET_KEY,
    port : process.env.PORT,
    client_id : process.env.CLIENT_ID,
    callback_url : process.env.CALLBACK_URL,
    code_mail : process.env.CODE_MAIL
}