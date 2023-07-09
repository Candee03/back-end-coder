import { Router } from "express";
import UserService from "../dao/userDAO.js";
import passport from "passport";

const usersRouter = Router()
export const userService = new UserService()

usersRouter.get('/', async(req, res) => {
    const users = await userService.getAll()
    res.send(users)
})

usersRouter.post('/', passport.authenticate('register', {failureRedirect:'/'}), async(req, res) => {
    res.redirect('/login')
})

usersRouter.post('/auth', passport.authenticate('login', {failureRedirect:'/'}), async(req, res) => {
    const {email} = req.body
    try{
        const user = await userService.getByEmail(email)
        req.session.user = user
        delete user.password
        res.redirect('/products')
    }
    catch (err) {
        res.status(400).json({error : err.message})
    }
})

//*AUTENTICACION DE TERCEROS
usersRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {})

usersRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user
    delete req.user.password
    res.redirect('/products')
})

usersRouter.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

export default usersRouter