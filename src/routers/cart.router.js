import { Router } from 'express';
import CartService from '../dao/cartDAO.js';
import { productService } from './product.router.js';

import fs from 'fs';

const cartRouter = Router();
const cartService = new CartService()
const path = 'src/carts.json'

//*---------METODO GET----------
// cartRouter.get('/', async(req, res) => {
// 	try{
//         return res.status(200).send(await cartService.getCarts())
//         // if (!req.query.limit) {
//         //     return res.status(201).send(carts)
//         // } else {
//         //     return res.status(201).send(carts.slice(0,Number(req.query.limit)))
//         // }
//     }
//     catch (err) {
//         return res.status(404).send({error: `error en la request`})
//     }
// });
cartRouter.get('/:cid', async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)
        if (cartFound){
            const carts = await cartService.getCarts()
            fs.promises.writeFile (path, JSON.stringify(carts, null, `\t`))
            res.status(200).send(cartFound)
        } else{
            throw new Error('no existe un carrito con el id')
        }
    }
    catch (err) {
        res.status(500).send({error: `${err.message} ${req.params.cid}`})
    }
});

//?---------METODO POST---------
cartRouter.post('/', async(req, res) => {
    try {
        const newCart = await cartService.createCart()
        const carts = await cartService.getCarts()
        fs.promises.writeFile (path, JSON.stringify(carts, null, `\t`))
        res.status(201).send(newCart)
    }
    catch (err) {
        return res.status(400).send({error: `El carrito no se creo`})
    }
});

cartRouter.post('/:cid/product/:pid', async(req, res) => {
    const productFound = await productService.getProductById(req.params.pid)
    const cartFound = await cartService.getCartById(req.params.cid)
    try {
        if (productFound && cartFound) {
            await cartService.addProductToCart(req.params.cid, req.params.pid)
            const carts = await cartService.getCarts()
            fs.promises.writeFile (path, JSON.stringify(carts))
            res.redirect('/products')
        } else {
            throw new Error('El carrito o el producto con esa id no existe')
        }
    }
    catch (err) {
        return res.status(400).send(`${err.message}`)
    }
});

//&----------METODO PUT------------
cartRouter.put('/:cid', async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)
        const products = req.body
        if (cartFound !== undefined || products.lenght !== 0) {
            await cartService.updateAllProducts(req.params.cid, products)
            const carts = await cartService.getCarts()
            fs.promises.writeFile (path, JSON.stringify(carts, null, `\t`))
        }
        return res.status(200).send(cartFound)
    }
    catch (err) {
        return res.send(err)
    }
})

cartRouter.put('/:cid/products/:pid', async(req, res) => {
    try {
        const cartFound = await cartService.getCartById(req.params.cid)
        const productFound = await productService.getProductById(req.params.pid)
        const quantity = req.body
        if (cartFound !== undefined || productFound !== undefined || quantity) {
            await cartService.updateProduct(req.params.cid, req.params.pid, quantity)
            const carts = await cartService.getCarts()
            fs.promises.writeFile (path, JSON.stringify(carts, null, `\t`))
        }
        return res.status(200).send(cartFound)
    }
    catch (err) {
        return res.send(err)
    }
})

//!----------METODO DELETE---------
cartRouter.delete('/:cid/products/:pid', async(req, res) => {
    try {
        await cartService.deleteProductFromCart(req.params.cid, req.params.pid)

        const carts = await cartService.getCarts()
        fs.promises.writeFile (path, JSON.stringify(carts, null, `\t`))
        res.status(201).send(await cartService.getCarts())
    }
    catch (err) {
        return res.status(400).send({error: err.message})
    }
});

cartRouter.delete('/:cid', async(req, res) => {
    try {
        await cartService.deleteAllProducts(req.params.cid)

        const carts = await cartService.getCarts()
        fs.promises.writeFile (path, JSON.stringify(carts, null, `\t`))
        res.status(201).send(await cartService.getCarts())
    }
    catch (err) {
        return res.status(400).send({error: err.message})
    }
});


export { cartRouter };