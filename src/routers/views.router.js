import { Router } from "express";
import { isGuest } from "../middleware/auth.middleware.js";
import { userService } from "../user/user.controller.js";
import { UserSafeDTO } from "../user/user.DTO.js";
import { authorization, passportCall } from "../config/utils.js";

const viewsRouter = Router();

viewsRouter.get('/', async(req,res) => {
    res.redirect('/login')
})
viewsRouter.get('/products', passportCall('jwt'), async(req,res) => {
    const { limit, page, sort, category, status } = req.query
    const products = await req.productService.getProducts( limit, page, sort, category, status )

    const user = new UserSafeDTO(req.user.user)
    const admin = user.role === 'admin' ? true : false
    res.render('products', {products, user, admin})
})
viewsRouter.get('/details/:pid', passportCall('jwt'), async(req,res) => {
    const product = await req.productService.getProductById(req.params.pid.toString())
    const cartId = await req.session.user.cartId._id
    console.log(req.session);
    res.render('details', {product, cartId})
})
viewsRouter.get('/carts/:cid', passportCall('jwt'), async(req,res) => {
    const cartId = req.params.cid.toString()
    const cartProducts = await req.cartService.getProductsPopulated(cartId)
    res.render('cart', {cartProducts, cartId})
})
viewsRouter.get('/chat', passportCall('jwt'), authorization('user'),  async(req,res) => {
    const user = new UserSafeDTO(req.user.user)
    res.render('chat', user)
})
viewsRouter.get('/realtimeproducts', passportCall('jwt') , async(req,res) => {
    res.render('realtimeproducts',{})
})
viewsRouter.get('/register', isGuest, async (req, res) => {
    res.render('register', {})
})
viewsRouter.get('/login', isGuest, async (req, res) => {
    res.render('login', {})
})
viewsRouter.get('/users', passportCall('jwt'), authorization('admin'), async (req, res) => {
    const users = await userService.getAll()
    res.render('users', {users})
})

export default viewsRouter