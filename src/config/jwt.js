import jwt from "jsonwebtoken";

const PRIVATE_KEY = 'secretKey'

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'})
    return token
}

export const authToken = (req, res, next) => {
    const authHeader = req.cookies.token;


    if (!authHeader) {
        return res.status(401).send({error: 'no autenticado'})
    }


    jwt.verify(authHeader, PRIVATE_KEY, (error, credentials)=> {
        if(error) return res.status(401).send({error: 'no autenticado', err: error})

        req.user = credentials.user

        next()
    })
}