import { Router } from "express";
import UserService from "../dao/userDAO.js";

const usersRouter = Router()
export const userService = new UserService()

usersRouter.post('/', async(req, res) => {
    const userData = req.body
    try {
        if (userData.email === 'adminCoder@coder.com') userData.rol = 'admin'
        await userService.createUser(userData)
        res.redirect('/products')
    }
    catch (err) {
        res.status(400).json({error : err.message})
    }
})


usersRouter.post('/auth', async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await userService.getByEmail(email)
        if (!user) throw new Error ('no existe un usario registrado con ese email')
        if (user.password !== password) throw new Error ('la contraseña es incorrecta')
        req.session.user = user
        res.redirect('/products')
    }
    catch (err) {
        res.status(400).json({error : err.message})
    }
})

usersRouter.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

export default usersRouter