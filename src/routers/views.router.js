import { Router } from "express";
import { isAuth, isGuest, onlyAdmin, onlyUser } from "../middleware/auth.middleware.js";
import { userService } from "../user/user.controller.js";
import { UserSafeDTO } from "../user/user.DTO.js";

const viewsRouter = Router();

// viewsRouter.get('/', isAuth, async(req,res) => {
//     const { limit, page, sort, category, status } = req.query
//     const products = await req.productService.getProducts( limit, page, sort, category, status )
//     res.render('home', {products})
// })
viewsRouter.get('/products', isAuth, async(req,res) => {
    const { limit, page, sort, category, status } = req.query
    const products = await req.productService.getProducts( limit, page, sort, category, status )

    const user = new UserSafeDTO(req.session.user)
    const admin = user.role === 'admin' ? true : false
    res.render('products', {products, user, admin})
})
viewsRouter.get('/details/:pid', isAuth, async(req,res) => {
    const product = await req.productService.getProductById(req.params.pid.toString())
    const cartId = await req.session.user.cartId._id
    res.render('details', {product, cartId})
})
viewsRouter.get('/carts/:cid', isAuth, async(req,res) => {
    const cart = await req.cartService.getProductsFromCart(req.params.cid.toString())
    res.render('cart', {cart})
})
viewsRouter.get('/chat', onlyUser, async(req,res) => {
    res.render('chat')
})
viewsRouter.get('/realtimeproducts',(isAuth, onlyAdmin) , async(req,res) => {
    res.render('realtimeproducts',{})
})
viewsRouter.get('/register', isGuest, async (req, res) => {
    res.render('register', {})
})
viewsRouter.get('/login', isGuest, async (req, res) => {
    res.render('login', {})
})
viewsRouter.get('/users', (isAuth, onlyAdmin), async (req, res) => {
    const users = await userService.getAll()
    res.render('users', {users})
})

export default viewsRouter