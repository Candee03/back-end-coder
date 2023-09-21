import { addProduct, createCart, deleteAllProductsFromCart, deleteOneProductFromCart, getCartById, purchase, updateAllCart, updateOneProduct } from '../cart/cart.controller.js';
import MakeRouter from './routers.js';

class CartRouter extends MakeRouter {
    init() {

        /** 
         * @swagger
         * tags:
         *      name: Carts
         *      description: The Carts managing API | Login required to run endpoints |
         * components:
         *      schemas:
         *          Cart:
         *              type: object
         *              properties:
         *                  _id:
         *                      type: string
         *                      description: The auto-generated id of the Cart in MongoDB
         *                  products:
         *                      type: array
         *                      default: []
         *                      items:
         *                          type: object
         *                          properties:
         *                              product:
         *                                  type: string
         *                                  description: Product Id
         *                              quantity:
         *                                  type: number
         *                                  description: added quantity
         *                                  default: 1
         *              examples:
         *                  _id : 65062a0ff663636419a55ce4
         *                  products: [ { product: 647e105a1f51e16a9a412abe, quantity: 3,  _id: 65063691ac43fc8333500cec } ] 
         */
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

        /**
         * @swagger
         * /api/carts/{cid}:
         *      get:
         *          summary: Returns the cart found
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *          responses:
         *              200:
         *                  description: The Cart found
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Cart'
         *                          example:
         *                              _id: 65062a0ff663636419a55ce4,
         *                              products: [{product: object of product populated by id, quantity: 3, _id: 65063691ac43fc8333500cec}]
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.get('/:cid', ['USER', 'ADMIN', 'PREMIUM'], getCartById);
        
        //?---------METODO POST---------

        /**
         * @swagger
         * /api/carts:
         *      post:
         *          summary: Creates a cart when a user registers
         *          tags: [Carts]
         *          responses:
         *              201:
         *                  description: Return the new cart
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Cart'
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.post('/', ['USER', 'ADMIN', 'PREMIUM'], createCart);
        
        /**
         * @swagger
         * /api/carts/{cid}/product/{pid}:
         *      post:
         *          summary: Add a product to cart
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *              - name: pid
         *                in: path
         *                description: Id of the product
         *                required: true
         *                schema: 
         *                    type: string
         *          responses:
         *              200:
         *                  description: Redirect to route '/products'
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.post('/:cid/product/:pid', ['USER', 'ADMIN', 'PREMIUM'], addProduct);
        
        /**
         * @swagger
         * /api/carts/{cid}/purchase:
         *      post:
         *          summary: Makes the purchase of the products in the cart
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *          responses:
         *              200:
         *                  description: Generates a ticket and sends it by email with the summary of the purchase
         *              405:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.post('/:cid/purchase', ['USER', 'ADMIN', 'PREMIUM'], purchase);

        //&----------METODO PUT------------

        /**
         * @swagger
         * /api/carts/{cid}:
         *      put:
         *          summary: Update all cart
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *          requestBody:
         *              description: All the object of products
         *              content:
         *                  application/json:
         *                      example:
         *                          [ {product: 647e103a4cc63e0cd4317a0c, quantity: 4}, {product: 647e10b5f6aa451a79ca0b16, quantity: 3} ]
         *              required: true
         *          responses:
         *              200:
         *                  description: Returns the cart that was modified
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Cart'
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.put('/:cid', ['USER', 'ADMIN', 'PREMIUM'], updateAllCart)
        
        /**
         * @swagger
         * /api/carts/{cid}/products/{pid}:
         *      put:
         *          summary: Update one product of cart
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *              - name: pid
         *                in: path
         *                description: Id of the product to modify
         *                required: true
         *                schema: 
         *                    type: string
         *          requestBody:
         *              description: All the object of products
         *              content:
         *                  application/json:
         *                      example:
         *                          {quantity: 3}
         *              required: true
         *          responses:
         *              200:
         *                  description: Returns the cart that was modified
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Cart'
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.put('/:cid/products/:pid', ['USER', 'ADMIN', 'PREMIUM'], updateOneProduct)
        
        //!----------METODO DELETE---------

        /**
         * @swagger
         * /api/carts/{cid}:
         *      delete:
         *          summary: Remove all products from a cart
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *          responses:
         *              200:
         *                  description: Returns the Cart that was modified
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Cart'
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.delete('/:cid', ['USER', 'ADMIN', 'PREMIUM'], deleteAllProductsFromCart);

        /**
         * @swagger
         * /api/carts/{cid}/products/{pid}:
         *      delete:
         *          summary: Remove one product from a cart
         *          tags: [Carts]
         *          parameters:
         *              - name: cid
         *                in: path
         *                description: Id of the cart
         *                required: true
         *                schema: 
         *                    type: string
         *              - name: pid
         *                in: path
         *                description: Id of the product
         *                required: true
         *                schema: 
         *                    type: string
         *          responses:
         *              200:
         *                  description: Returns the Cart that was modified
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Cart'
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.delete('/:cid/products/:pid', ['USER', 'ADMIN', 'PREMIUM'], deleteOneProductFromCart);
        
    }
}

const cartRouter = new CartRouter()

export default cartRouter