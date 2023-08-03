import CartRepository from "./cart.repository.js"
import CartMongo from "./cart.DAO.js"
import { productService } from "../product/product.controller.js"


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
        res.status(500).send({error: `${err.message} ${req.params.cid}`})
    }
}

export const createCart = async(req, res) => {
    try {
        const newCart = await cartService.createCart()
        res.status(201).send(newCart)
    }
    catch (err) {
        return res.status(400).send({error: `El carrito no se creo`})
    }
}

export const addProduct = async(req, res) => {
    try {
        const productFound = await productService.getProductById(req.params.pid)
        const cartFound = await cartService.getCartById(req.params.cid)

        if (!productFound && !cartFound) {
            throw new Error('El carrito o el producto con esa id no existe')
        }

        await cartService.addProductToCart(req.params.cid, req.params.pid)
        res.redirect('/products')
    }
    catch (err) {
        return res.status(400).send(`${err.message}`)
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
        return res.send(err)
    }
}

export const updateOneProduct = async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)
        const productFound = await productService.getProductById(req.params.pid)
        const quantity = req.body

        if (cartFound !== undefined || productFound !== undefined || quantity) {
            await cartService.updateProduct(req.params.cid, req.params.pid, quantity)
        }
        return res.status(200).send(cartFound)
    }
    catch (err) {
        return res.send(err)
    }
}

export const deleteAllProductsFromCart = async(req, res) => {
    try {
        await cartService.deleteAllProducts(req.params.cid)

        res.status(201).send(await cartService.getCarts())
    }
    catch (err) {
        return res.status(400).send({error: err.message})
    }
}

export const deleteOneProductFromCart = async(req, res) => {
    try {
        await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
        res.status(201).send(await cartService.getCarts())
    }
    catch (err) {
        return res.status(400).send({error: err.message})
    }
}