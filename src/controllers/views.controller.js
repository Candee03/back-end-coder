import { UserSafeDTO } from "../user/user.DTO.js"
import { getMockingProducts } from "../mock/mock.controller.js"
import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from "../config/jwt.js"

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

export const changePassword = (req, res) => {
    try {
        const token = req.params.token
        const cookieToken = req.cookies.tokenRestore

        jwt.verify(cookieToken, PRIVATE_KEY, (err, credential) => {
            //SI EL TOKEN VENCE TE PIDE QUE GENERES OTRO
            if (err) return res.render('restorePassword', {messageError: 'Debes volver a generar un token porque el anterior ya venció'})
            //SI SE GENERÓ MAS DE UN TOKEN TE PIDE QUE REVISES EL ULTIMO MAIL
            if (token !== cookieToken) return res.render('messages', {title: 'Se solicitó más de un link', message: 'Debes usar el ultimo link generado'})

            return res.render('changePassword', {email: req.params.email})
        })

    } catch (err) {
        req.logger.error(err.name + ': ' + err.message)
        res.send('error: '+ err.message)
    }
}