import UserRepository from "./user.repository.js"
import UserMongo from "./user.DAO.js"
import { UserSafeDTO } from "./user.DTO.js"
import {generateToken} from "../config/jwt.js"
import { comparePassword, hashPassword } from "../config/encript.util.js"

export const userService = new UserRepository(new UserMongo())

export const getAllUsers = async(req, res) => {
    const users = await userService.getAll()
    res.send(users)
}

export const register = async(req, res) => {
    res.redirect('/login')
}

export const login = async(req, res) => {
    const {email} = req.body
    try{
        const user = await userService.getByEmail(email)
        req.session.user = new UserSafeDTO(user)
        const token = generateToken(user)
        req.logger.debug('se inicio la sesion')
        res.cookie('token', token, {
            maxAge: 3600 * 1000, //LA SESION DURA 1 HORA ABIERTA
            httpOnly: true
        }).redirect('/products')
    }
    catch (err) {
        req.logger.error(err.message)
        res.status(400).json({error : err.message})
    }
}

export const logout = (req, res) => {
	res.cookie('token', '', { expires: new Date(0), httpOnly: true });
	res.redirect('/login');
    req.logger.debug('se cerró la sesion')
}

export const restore = (req, res) => {
    try {
        const user = req.body.email
        const tokenRestore = generateToken(user, '1h')
    
        req.logger.debug('TOKEN: '+ tokenRestore)

        res.cookie('tokenRestore', tokenRestore, {maxAge: 3600 * 1000 })
        
        res.redirect(`/api/mail/restorePassword/${req.body.email}/${tokenRestore}`)
    }
    catch (err) {
        req.logger.error(err.message)
        res.send('error')
    }
}

export const changePassword = async(req, res) => {
    try {
        const newPassword = req.body.password
        const user = await userService.getByEmail(req.params.email)

        if (comparePassword(user, newPassword)) {
            res.render('changePassword', {email: req.params.email, messageError: 'La nueva contraseña no puede ser igual a la anterior'})
        } else {
            await userService.updatePassword(user._id, hashPassword(newPassword))
            req.logger.debug('nuevo usuario: '+ await userService.getByEmail(req.params.email))

            res.status(200).send('La contraseña se cambio con éxito! Recordá anotarla para no olvidarla 😉 <a href = "/login">Ir al login</a>')
        }
    }
    catch (err) {
        res.send('error: '+ err.message)
    }
}