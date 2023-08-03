import { Router } from 'express';
import { addProduct, createCart, deleteAllProductsFromCart, deleteOneProductFromCart, getCartById, updateAllCart, updateOneProduct } from '../cart/cart.controller.js';
import { allowedModifyCart } from '../middleware/auth.middleware.js';



const cartRouter = Router();

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
cartRouter.get('/:cid', getCartById);

//?---------METODO POST---------
cartRouter.post('/', createCart);

cartRouter.post('/:cid/product/:pid', allowedModifyCart, addProduct);

//&----------METODO PUT------------
cartRouter.put('/:cid', updateAllCart)

cartRouter.put('/:cid/products/:pid', updateOneProduct)

//!----------METODO DELETE---------
cartRouter.delete('/:cid', deleteAllProductsFromCart);

cartRouter.delete('/:cid/products/:pid', deleteOneProductFromCart);


export default cartRouter