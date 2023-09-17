import passport from "passport";
import { changePassword, getAllUsers, login, logout, register, restore, updateRole } from "../user/user.controller.js";
import MakeRouter from "./routers.js";
import { authToRestore, generateToken } from "../config/jwt.js";

class UsersRouter extends MakeRouter {
    init() {
        this.get('/', ['ADMIN'], getAllUsers)

        this.post('/',['PUBLIC'], passport.authenticate('register', {failureRedirect:'/'}), register)

        this.post('/auth', ['PUBLIC'], passport.authenticate('login', {failureRedirect:'/'}), login)

        this.post('/logout', ['USER', 'ADMIN', 'PREMIUM'], logout);

        this.post('/restore', ['PUBLIC'], restore);

        this.post('/changePassword/:email', ['PUBLIC'], authToRestore, changePassword)

        this.get('/premium/:uid', ['ADMIN'], updateRole)

        //*AUTENTICACION DE TERCEROS
        this.get('/github', ['PUBLIC'], passport.authenticate('github', {scope:['user:email']}), async (req, res) => {})

        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', {failureRedirect:'/login'}), async (req, res) => {
            req.session.user = req.user
            delete req.user.password

            const token = generateToken(req.user)
            res.cookie('token', token, {
            maxAge: 3600 * 1000, //LA SESION DURA 1 HORA ABIERTA
            httpOnly: true
            }).redirect('/products')
        })
    }
}

const usersRouter = new UsersRouter()

export default usersRouter