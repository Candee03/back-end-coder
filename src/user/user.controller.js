import UserRepository from "./user.repository.js"
import UserMongo from "./user.DAO.js"
import { UserSafeDTO } from "./user.DTO.js"
import {generateToken} from "../config/jwt.js"
import { comparePassword, hashPassword } from "../config/encript.util.js"
import { cartService } from "../cart/cart.controller.js"

export const userService = new UserRepository(new UserMongo())

export const getAllUsers = async(req, res) => {
    let users = await userService.getAll()
    users = new UserSafeDTO(users)
    res.send(users)
}

export const register = async(req, res) => {
    const user = await userService.getByEmail(req.body.email)
    res.send(user)
}

export const login = async(req, res) => {
    const {email} = req.body
    try{
        const user = await userService.getByEmail(email)
        await userService.updateConnection(user._id, new Date().toLocaleString())

        req.session.user = new UserSafeDTO(user)
        const token = generateToken(user)
        req.logger.debug('se inicio la sesion')
        res.cookie('token', token, {
            maxAge: 3600 * 1000, //LA SESION DURA 1 HORA ABIERTA
            httpOnly: true
        }).status(200).redirect('/products')
    }
    catch (err) {
        req.logger.error(err.message)
        res.status(400).json({error : err.message})
    }
}

export const logout = async(req, res) => {
    await userService.updateConnection(req.user.user._id, new Date().toLocaleString())
	res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    req.logger.debug('se cerró la sesion')
	return res.redirect('/login');
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
            let requiredDocuments = []
            user.documents.forEach(doc => {
                const nameOfDoc = (doc.name.split('-').pop()).split('.').shift().toString()

                if (nameOfDoc.toUpperCase() === ('Identificacion').toUpperCase() || nameOfDoc.toUpperCase() === ('Comprobante de domicilio').toUpperCase() || nameOfDoc.toUpperCase() === ('Comprobante de estado de cuenta').toUpperCase()) {
                    requiredDocuments.push(nameOfDoc)
                }
            })
            if (requiredDocuments.length === 3) {
                await userService.updateRole(user._id, 'premium')
                req.logger.info('se actualizo el rol!')
                return res.status(200).send('ok')
            } else {
                req.logger.info('Debes tener los 3 archivos requeridos para ser premium')
            }
        }
    } catch(err) {
        return res.status(404).send(err.message)
    }
}

export const deleteUser = async(req,res) =>{
    try {
        const userId = req.params.uid;
        await userService.deleteUser(userId)
        res.status(200).send({status:"success",message:"User deleted"})
    }
    catch (err) {
        res.status(400).send({status:"error",message:err.message})
    }
}

export const uploadDocuments = async(req, res) => {
    try {
        const user = await userService.getById(req.params.uid.toString())
        let docs = []
        if (req.files.profile) {
            const path = (req.files.profile[0].destination).split('/').splice(1,2)
            const imgPath = `${path[0]}/${path[1]}/${req.files.profile[0].filename}`
            await userService.updateImgProfile(user._id, imgPath)
        }
        if (req.files.documents) {
            req.files.documents.forEach(file => {
                const doc= {
                    name: file.filename,
                    reference: file.path
                }
                if (user.documents.some(document => document.reference === doc.reference)) {
                    throw new Error('❌no reenvies documentos que ya enviaste')
                }
                docs.push(doc)
            })
            await userService.uploadDocs(req.params.uid.toString(), docs)
        }
        return res.status(200).redirect('/products')
    }
    catch (err) {
        res.status(404).render('uploadDocuments', {uid: req.params.uid, message:err.message})
    }
}

/**
 * 
 * @param {string} date date to locale string
 */
const returnsDateObject = (date) => {
    const d = date.split(', ').shift()
    const day = d.split('/')[0]
    const month = d.split('/')[1]

    const dateObject = {
        day: day,
        month: month,
    }
    return dateObject
}

export const removeInactiveUsers = async (req, res) => {
    const users = await userService.getAll()
    const date = returnsDateObject(new Date().toLocaleString())
    users.forEach(async user => {
        const userConnection = returnsDateObject(user.last_connection)
        if (parseInt(date.day) >= parseInt(userConnection.day) + 2 || parseInt(date.day) <= parseInt(userConnection.day) && userConnection.month !== date.month || userConnection.month !== date.month ) {
            await userService.deleteUser(user._id)
            await cartService.deleteCart(user.cartId._id)
            await fetch(`/api/mail/${user.email}`, {method: 'GET'})
        }
    })
    return res.status(200).send('ok')
}