import passport from "passport";
import { getAllUsers, login, logout, register } from "../user/user.controller.js";
import MakeRouter from "./routers.js";

class UsersRouter extends MakeRouter {
    init() {
        this.get('/', ['ADMIN'], getAllUsers)

        this.post('/',['PUBLIC'], passport.authenticate('register', {failureRedirect:'/'}), register)

        this.post('/auth', ['PUBLIC'], passport.authenticate('login', {failureRedirect:'/'}), login)

        this.post('/logout', ['USER', 'ADMIN'], logout);

        //*AUTENTICACION DE TERCEROS
        this.get('/github', ['PUBLIC'], passport.authenticate('github', {scope:['user:email']}), async (req, res) => {})

        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', {failureRedirect:'/login'}), async (req, res) => {
            req.session.user = req.user
            delete req.user.password
            res.redirect('/products')
        })
    }
}

const usersRouter = new UsersRouter()

export default usersRouter