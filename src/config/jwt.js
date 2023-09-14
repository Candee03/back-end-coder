import config from './env.js'
import jwt from "jsonwebtoken";

export const PRIVATE_KEY = config.secretKey

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'})
    return token
}

export const authToken = (req, res, next) => {
    const authHeader = req.cookies.token;


    if (!authHeader) {
        // req.logger.fatal(`No se pudo autenticar => ${req.ip}`)
        return res.status(401).send({error: 'no autenticado'})
    }


    jwt.verify(authHeader, PRIVATE_KEY, (error, credentials)=> {
        if(error) {
            // req.logger.fatal(`No se pudo autenticar => ${req.ip} || ${error}`)
            return res.status(401).send({error: 'no autenticado', err: error})
        }
        req.user = credentials.user

        next()
    })
}