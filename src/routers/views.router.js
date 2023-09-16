import { userService } from "../user/user.controller.js";
import MakeRouter from "./routers.js";
import { changePassword, chat, deleteProduct, getCart, getDetails, getMocking, getProducts } from "../controllers/views.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
import { authToRestore } from "../config/jwt.js";

class ViewsRouter extends MakeRouter {
    init() {
        this.get('/', ['PUBLIC'], isAuth, async(req, res) => {
            res.redirect('/login')
        })
        //?VIEWS PRODUCTS
        this.get('/products', ['ADMIN', 'USER', 'PREMIUM'], getProducts)

        this.get('/mockingproducts', ['ADMIN', 'USER', 'PREMIUM'], getMocking)

        this.get('/details/:pid', ['ADMIN', 'USER', 'PREMIUM'], getDetails)

        this.get('/realtimeproducts', ['ADMIN'], async(req, res) => {
            res.render('realtimeproducts',{})
        })

        this.get('/addProduct', ['ADMIN', 'PREMIUM'], (req, res) => {
            res.render('createProduct')
        })

        this.get('/deleteProduct', ['ADMIN', 'PREMIUM'], deleteProduct)

        //?VIEWS CARRITO
        this.get('/carts/:cid', ['ADMIN', 'USER', 'PREMIUM'], getCart)

        //?VIEWS CHAT
        this.get('/chat', ['USER', 'PREMIUM'], chat)

        //?VIEWS USER
        this.get('/register', ['PUBLIC'], isAuth, async (req, res) => {
            res.render('register')
        })

        this.get('/login', ['PUBLIC'],async (req, res) => {
            res.render('login')
        })

        this.get('/users', ['ADMIN'], async (req, res) => {
            const users = await userService.getAll()
            res.render('users', {users})
        })

        this.get('/restorePassword', ['PUBLIC'], async(req, res) => {
            res.render('restorePassword')
        })

        this.get('/changePassword/:email/:token', ['PUBLIC'], authToRestore, changePassword);
    }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter