import { Router } from 'express';
import CartManager from '../cartManager.js';
import { products } from './product.router.js';

const cartManager = new CartManager('src/carts.json')
// const carts = await cartManager.getCarts()
const cartRouter = Router();

//!---------METODO GET----------
// cartRouter.get('/', async(req, res) => {
// 	try{
//         if (!req.query.limit) {
//             return res.status(201).send(carts)
//         } else {
//             return res.status(201).send(carts.slice(0,Number(req.query.limit)))
//         }
//     }
//     catch (err) {
//         return res.status(404).send({error: `error en la request`})
//     }
// });
cartRouter.get('/:cid', async(req, res) => {
    try {
        const cartEncontrado = await cartManager.getCartById(Number(req.params.cid))
        if (cartEncontrado){
            res.status(201).send(cartEncontrado)
        } else{
            throw new Error('no existe un carrito con el id')
        }
    }
    catch (err) {
        res.status(400).send({error: `${err.message} ${req.params.cid}`})
    }
});

//!---------METODO POST---------
cartRouter.post('/', async(req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).send(newCart)
    }
    catch (err) {
        return res.status(400).send({error: `El carrito no se creo`})
    }
});
cartRouter.post('/:cid/product/:pid', async(req, res) => {
    try {
        const productoEncontrado = await products.find(p => Number(req.params.pid) === p.id)
        if (productoEncontrado) {
            await cartManager.addProductToCart(Number(req.params.cid),productoEncontrado)
            res.status(201).send(productoEncontrado)
        } else {
            throw new Error('no existe un producto con esa id')
        }
    }
    catch (err) {
        return res.status(400).send({error: err.message})
    }
});

export { cartRouter };