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

export const restore = async(req, res) => {
    try {
        const user = req.body.email
        //SI NO EXISTE UNA CUENTA CON EL EMAIL SALE ERROR
        if (! await userService.getByEmail(user)) return res.render('restorePassword', {messageError: 'No existe una cuenta registrada con este email'})

        //CREACION DEL TOKEN Y DE LA COOKIE
        const tokenRestore = generateToken(user, '1h')
        req.logger.debug('TOKEN: '+ tokenRestore)
        res.cookie('tokenRestore', tokenRestore, { maxAge: 3600 * 1000, httpOnly: true })

        return res.redirect(`/api/mail/restorePassword/${req.body.email}/${tokenRestore}`)
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
            //SI LA CONTRASEÑA ES IGUAL SALTA UN ERROR
            return res.render('changePassword', {email: req.params.email, messageError: 'La nueva contraseña no puede ser igual a la anterior'})
        } else {
            //ACTUALIZA LA CONTRASEÑA Y BORRA LA COOKIE
            await userService.updatePassword(user._id, hashPassword(newPassword))
            req.logger.debug('nuevo usuario: '+ await userService.getByEmail(req.params.email))
            
            res.cookie('tokenRestore', '', { expires: new Date(0), httpOnly: true });
            return res.render('messages', {title: 'La contraseña se cambio con éxito!', message: 'Recordá anotarla para no olvidarla 😉', link: '/login', linkName: 'Ir al login'})
        }
    }
    catch (err) {
        res.send('error: '+ err.message)
    }
}

export const updateRole = async (req, res) => {
    try {
        const uid = req.params.uid
        const user = await userService.getById(uid)
        const isPremium = (user.role).toString() === 'premium'

        if (isPremium) {
            await userService.updateRole(user._id, 'user')
            req.logger.info('se actualizo el rol!')
            return res.status(200).send('ok')
        } else {
            await userService.updateRole(user._id, 'premium')
            req.logger.info('se actualizo el rol!')
            return res.status(200).send('ok')
        }
    } catch(err) {
        return res.status(404).send(err.message)
    }
}