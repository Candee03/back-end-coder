import CartRepository from "./cart.repository.js"
import CartMongo from "./cart.DAO.js"
import { productService } from "../product/product.controller.js"
import { tiketService } from "../tiket/tiket.controller.js"

import CustomErrors from "../tools/customError.js"
import EErrors from "../tools/EErrors.js"
import { findProductInfo } from "../tools/info.js"

export const cartService = new CartRepository(new CartMongo())

export const getCartById = async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)

        if (!cartFound){
            throw new Error('no existe un carrito con el id')
        }

        res.status(200).send(cartFound)
    }
    catch (err) {
        req.logger.error(err.message);
        res.status(400).send({error: `${err.message} ${req.params.cid}`})
    }
}

export const createCart = async(req, res) => {
    try {
        const newCart = await cartService.createCart()
        res.status(201).send(newCart)
    }
    catch (err) {
        req.logger.error('El carrito no se creo');
        return res.status(400).send({error: `El carrito no se creo`})
    }
}

export const addProduct = async(req, res) => {
    try {
        let productExists = true
        const product = await productService.getProductById(req.params.pid)
        .catch(err => {
            productExists = false
            CustomErrors.createError({
                name: 'Error al modificar el carrito',
                message: `No existe un producto con ese id. ${err.message}`,
                cause: findProductInfo(req.params.pid),
                code: EErrors.INVALID_TYPE
            })
        })
        
        if (req.user.user.email === product.owner) {
            CustomErrors.createError({
                name: 'Error al modificar el carrito',
                message: 'No puedes agregar un producto que tu creaste',
                cause: req.params.pid,
                code: EErrors.INVALID_TYPE
            })
        }
        await cartService.addProductToCart(req.params.cid, req.params.pid)
        res.status(200).redirect('/products')
    }
    catch (err) {
        req.logger.error(err.name+': '+ err.message);
        return res.status(400).send(err.name+': '+ err.message)
    }
}

export const updateAllCart = async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)
        const products = req.body

        if (cartFound !== undefined || products.lenght !== 0) {
            await cartService.updateAllProducts(req.params.cid, products)
        }
        return res.status(200).send(cartFound)
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send(err)
    }
}

export const updateOneProduct = async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)
        const productFound = await productService.getProductById(req.params.pid)
        const quantity = req.body

        if (cartFound !== undefined && productFound !== undefined && quantity) {
            await cartService.updateProduct(req.params.cid, req.params.pid, quantity)
        }
        return res.status(200).send(cartFound)
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send(err)
    }
}

export const deleteAllProductsFromCart = async(req, res) => {
    try {
        await cartService.deleteAllProducts(req.params.cid)
        res.status(200).send(await cartService.getCartById(req.params.cid))
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send({error: err.message})
    }
}

export const deleteOneProductFromCart = async(req, res) => {
    try {
        await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
        res.status(200).send(await cartService.getCartById(req.params.cid))
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send({error: err.message})
    }
}

export const purchase = async(req, res) => {
    try {
        const cartProducts = await cartService.getProductsFromCart(req.params.cid)
        if (!cartProducts) throw new Error('no existe un carrito con el id')

        let total
        let productsForBuy = []
        let noAviable = []
        cartProducts.map(p => {
            if (p.quantity <= p.product.stock) {
                productsForBuy.push(p)
                total =+ p.product.price * p.quantity
            } else {
                noAviable.push(p.product._id)
            }
        })

        if (productsForBuy[0] === undefined) return res.redirect('/products')

        productsForBuy.map(async p => {
            const newStock = p.product.stock - p.quantity
            await productService.updateProduct((p.product._id).toString(),{
                ...p.product,
                stock: newStock
            })
            await cartService.deleteProductFromCart(req.params.cid, (p.product._id).toString())
        })

        const tiket = await tiketService.createTiket((req.session.user.email).toString(), total)
        fetch(`http://localhost:8080/api/mail/${tiket.code}/${req.session.user.email}/${req.session.user.first_name}`, {method: 'GET'})
        return res.status(200).send('success')
    }
    catch(err) {
        req.logger.error(err.message)
        return res.status(405).send(err.message)
    }
}

export const deleteCart = async(req, res) => {
    try {
        req.logger.debug('se borro el carrito')
        await cartService.deleteCart(req.params.cid)
        res.status(200).send('se booro el carrito')
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send({error: err.message})
    }
}