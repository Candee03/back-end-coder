import { Router } from "express";
import passport from "passport";
import { getAllUsers, login, logout, register } from "../user/user.controller.js";

const usersRouter = Router()

usersRouter.get('/', getAllUsers)

usersRouter.post('/', passport.authenticate('register', {failureRedirect:'/'}), register)

usersRouter.post('/auth', passport.authenticate('login', {failureRedirect:'/'}), login)

usersRouter.post('/logout', logout);

//*AUTENTICACION DE TERCEROS
usersRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {})

usersRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req, res) => {
    req.session.user = req.user
    delete req.user.password
    res.redirect('/products')
})

export default usersRouter