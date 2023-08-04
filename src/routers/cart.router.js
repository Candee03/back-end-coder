import { addProduct, createCart, deleteAllProductsFromCart, deleteOneProductFromCart, getCartById, purchase, updateAllCart, updateOneProduct } from '../cart/cart.controller.js';
import MakeRouter from './routers.js';

class CartRouter extends MakeRouter {
    init() {
        //*---------METODO GET----------
        // cartRouter.get('/', async(req, res) => {
        //     try{
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
        this.get('/:cid', ['USER', 'ADMIN'], getCartById);
        
        //?---------METODO POST---------
        this.post('/', ['USER', 'ADMIN'], createCart);
        
        this.post('/:cid/product/:pid', ['USER', 'ADMIN'], addProduct);
        
        this.post('/:cid/purchase', ['USER', 'ADMIN'], purchase);
        
        //&----------METODO PUT------------
        this.put('/:cid', ['USER', 'ADMIN'], updateAllCart)
        
        this.put('/:cid/products/:pid', ['USER', 'ADMIN'], updateOneProduct)
        
        //!----------METODO DELETE---------
        this.delete('/:cid', ['USER', 'ADMIN'], deleteAllProductsFromCart);
        
        this.delete('/:cid/products/:pid', ['USER', 'ADMIN'], deleteOneProductFromCart);
        
    }
}

const cartRouter = new CartRouter()

export default cartRouter