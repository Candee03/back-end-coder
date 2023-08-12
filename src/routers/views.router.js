import { Router } from "express";
import { isGuest } from "../middleware/auth.middleware.js";
import { userService } from "../user/user.controller.js";
import { UserSafeDTO } from "../user/user.DTO.js";
import { authorization, passportCall } from "../config/utils.js";
import { getMockingProducts } from "../mock/mock.controller.js";

const viewsRouter = Router();

viewsRouter.get('/', async(req, res) => {
    res.redirect('/login')
})
viewsRouter.get('/products', passportCall('jwt'), async(req, res) => {
    const { limit, page, sort, category, status } = req.query
    let products = await req.productService.getProducts( limit, page, sort, category, status )
    const user = new UserSafeDTO(req.user.user)
    const admin = user.role === 'admin' ? true : false
    res.render('products', {products, user, admin})
})
viewsRouter.get('/mockingproducts', passportCall('jwt'), async(req, res) => {
    const products = getMockingProducts(100)
    res.status(200).send(products)
})
viewsRouter.get('/details/:pid', passportCall('jwt'), async(req, res) => {
    const product = await req.productService.getProductById(req.params.pid.toString())
    const cartId = await req.session.user.cartId._id
    res.render('details', {product, cartId})
})
viewsRouter.get('/carts/:cid', passportCall('jwt'), async(req, res) => {
    const cartId = req.params.cid.toString()
    const cartProducts = await req.cartService.getProductsPopulated(cartId)

    let cart = []
    cartProducts.forEach(product => {
        product = {
            ...product,
            cartId : cartId
        }
        cart.push(product)
    });
    res.render('cart', {cart, cartId})
})
viewsRouter.get('/chat', passportCall('jwt'), authorization('user'),  async(req, res) => {
    const user = new UserSafeDTO(req.user.user)
    res.render('chat', user)
})
viewsRouter.get('/realtimeproducts', passportCall('jwt') , async(req, res) => {
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