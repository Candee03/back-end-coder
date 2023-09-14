import { UserSafeDTO } from "../user/user.DTO.js"
import { getMockingProducts } from "../mock/mock.controller.js"

export const getProducts = async(req, res) => {
    const { limit, page, sort, category, status } = req.query
    let products = await req.productService.getProducts( limit, page, sort, category, status )
    const user = new UserSafeDTO(req.user.user)
    const admin = user.role === 'admin' ? true : false
    res.render('products', {products, user, admin})
}

export const getMocking = async(req, res) => {
    const products = getMockingProducts(100)
    res.status(200).send(products)
}

export const getDetails = async(req, res) => {
    const product = await req.productService.getProductById(req.params.pid.toString())
    const cartId = await req.session.user.cartId._id
    res.render('details', {product, cartId})
}

export const getCart = async(req, res) => {
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
}

export const chat = async(req, res) => {
    const user = new UserSafeDTO(req.user.user)
    res.render('chat', user)
}