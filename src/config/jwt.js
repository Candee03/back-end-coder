import config from './env.js'
import jwt from "jsonwebtoken";

export const PRIVATE_KEY = config.secretKey

export const generateToken = (user, expiresIn) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: expiresIn ? expiresIn : '24h'})
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

export function authToRestore (req, res, next) {
	const cookie = req.cookies.tokenRestore
	
	if (cookie) {
        jwt.verify(cookie, PRIVATE_KEY, (err, credential) => {
            //SI EL TOKEN VENCE TE PIDE QUE GENERES OTRO
            if (err) return res.render('restorePassword', {messageError: 'Debes volver a generar un token porque el anterior ya venció'})
        })
        next()
	} else{
		return res.render('restorePassword', {messageError: 'Debes volver a generar un token porque el anterior ya venció o asegurate de usar el mismo navegador'})
	}
}