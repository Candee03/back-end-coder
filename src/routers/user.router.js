import passport from "passport";
import { changePassword, deleteUser, getAllUsers, login, logout, register, removeInactiveUsers, restore, updateRole, uploadDocuments } from "../user/user.controller.js";
import MakeRouter from "./routers.js";
import { authToRestore, generateToken } from "../config/jwt.js";
import { uploadFiles } from "../middleware/multer.middleware.js";

class UsersRouter extends MakeRouter {
    init() {
        this.get('/', ['ADMIN'], getAllUsers)

        this.post('/',['PUBLIC'], passport.authenticate('register', {failureRedirect:'/'}), register)

        this.post('/auth', ['PUBLIC'], passport.authenticate('login', {failureRedirect:'/'}), login)

        this.post('/logout', ['USER', 'ADMIN', 'PREMIUM'], logout);

        this.post('/restore', ['PUBLIC'], restore);

        this.post('/changePassword/:email', ['PUBLIC'], authToRestore, changePassword)

        this.post('/:uid/documents', ['USER', 'PREMIUM'], uploadFiles().fields([ { name: 'documents', maxCount: 3 }, {name: 'profile', maxCount: 1} ]), uploadDocuments)

        this.get('/premium/:uid', ['ADMIN'], updateRole)

        this.delete('/', ['ADMIN'], removeInactiveUsers)

        this.delete('/:uid', ['ADMIN'], deleteUser)

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