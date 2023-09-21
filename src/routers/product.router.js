import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../product/product.controller.js';
import MakeRouter from './routers.js';

class ProductRouter extends MakeRouter {
    init() {
        /** 
         * @swagger
         * components:
         *      schemas:
         *          Product:
         *              type: object
         *              required:
         *                  - title
         *                  - description
         *                  - price
         *                  - thumbnail
         *                  - category
         *                  - stock
         *              properties:
         *                  _id:
         *                      type: string
         *                      description: The auto-generated id of the Product in MongoDB
         *                  title:
         *                      type: string
         *                      description: The name of the product
         *                  description:
         *                      type: string
         *                      description: The description of the product
         *                  price:
         *                      type: number
         *                      description: The price of the product
         *                  thumbnail:
         *                      type: Array
         *                      description: Array with link of the images
         *                  code:
         *                      type: string
         *                      description: The code of the product
         *                  status:
         *                      type: boolean
         *                      description: The status of the product. If the stok is equal to 0 the status is false
         *                  category:
         *                      type: string
         *                      description: The category of the product
         *                  stock:
         *                      type: number
         *                      description: The stock of the product
         *                  owner:
         *                      type: string
         *                      description: The email of the owner. Default value is Admin
         *              examples:
         *                  _id: 647e103a4cc63e0cd4317a0c
         *                  title: tostadora
         *                  description: electrodomestico ideal para tu cocina
         *                  price: 20000
         *                  thumbnail: ['link.img1', 'link.img2']
         *                  code: FRGA4
         *                  status: true
         *                  category: cocina
         *                  stock: 5
         *                  owner: admin
         */

        //!---------METODO GET-------
        /**
         * @swagger
         * tags:
         *      name: Products
         *      description: The Products managing API
         * /api/products:
         *      get:
         *          summary: Returns the list of all products
         *          tags: [Products]
         *          responses:
         *              200:
         *                  description: The list of all products and pagination
         *                  content:
         *                      application/json:
         *                          schema:
         *                              type: object
         *                              properties:
         *                                  docs:
         *                                      type: array
         *                                      items:
         *                                          $ref: '#/components/schemas/Product'
         *                                  totalDocs:
         *                                      type: integer
         *                                  limit:
         *                                    type: integer
         *                                  totalPages:
         *                                    type: integer
         *                                  page:
         *                                    type: integer
         *                                  pagingCounter:
         *                                    type: integer
         *                                  hasPrevPage:
         *                                    type: boolean
         *                                  hasNextPage:
         *                                    type: boolean
         *                                  prevPage:
         *                                    type: integer
         *                                  nextPage:
         *                                    type: integer
         *                                  prevLink:
         *                                    type: string
         *                                  nextLink:
         *                                    type: string
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.get('/', ['ADMIN', 'USER', 'PREMIUM'], getAllProducts);

        /**
         * @swagger
         * /api/products/{:pid}:
         *      get:
         *          summary: Returns the product found
         *          tags: [Products]
         *          parameters:
         *              - name: pid
         *                in: path
         *                description: Id of the product
         *                required: true
         *                schema: 
         *                    type: objectID
         *          responses:
         *              200:
         *                  description: The product found
         *                  content:
         *                      application/json:
         *                          schema:
         *                              $ref: '#/components/schemas/Product'
         *                          example:
         *                              _id: 647e103a4cc63e0cd4317a0c
         *                              title: tostadora
         *                              description: electrodomestico ideal para tu cocina
         *                              price: 20000
         *                              thumbnail: ['link.img1', 'link.img2']
         *                              code: FRGA4
         *                              status: true
         *                              category: cocina
         *                              stock: 5
         *                              owner: admin
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.get('/:pid', ['USER', 'ADMIN', 'PREMIUM'], getProductById);

        //!---------METODO POST-------

        /**
         * @swagger
         * /api/products:
         *      post:
         *          summary: Create new product
         *          tags: [Products]
         *          requestBody:
         *              description: Create a new product in store
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/Product'
         *                      example:
         *                          title: title
         *                          description: description
         *                          price: 20000
         *                          thumbnail: ['img1']
         *                          category: category
         *                          stock: 10
         *              required: true
         *          responses:
         *              200:
         *                  description: Returns product created
         *                  content:
         *                      application/json:
         *                          example:
         *                              _id: 647e103a4cc63e0cd4317a0c
         *                              title: tostadora
         *                              description: electrodomestico ideal para tu cocina
         *                              price: 20000
         *                              thumbnail: ['link.img1', 'link.img2']
         *                              code: FRGA4
         *                              status: true
         *                              category: cocina
         *                              stock: 5
         *                              owner: admin
         *              400:
         *                  description: Error in request. Redirect to the form again
         *              500:
         *                  description: Some server Error
         */
        this.post('/', ['ADMIN','PREMIUM'], addProduct);

        //!---------METODO PUT--------

        /**
         * @swagger
         * /api/products/{:pid}:
         *      put:
         *          summary: Update a existing product
         *          tags: [Products]
         *          parameters:
         *              - name: pid
         *                in: path
         *                description: Id of the product
         *                required: true
         *                schema: 
         *                    type: objectID
         *          requestBody:
         *              description: Update a existing product by id
         *              content:
         *                  application/json:
         *                      schema:
         *                          $ref: '#/components/schemas/Product'
         *                      examples:
         *                          example1:
         *                              summary: Example updating some properties of product
         *                              value:
         *                                  title: New title
         *                                  price: 33333
         *                                  stock: 10
         *                          example2:
         *                              summary: Example updating all product
         *                              value:
         *                                  title: New title
         *                                  description: New description
         *                                  price: 20000
         *                                  thumbnail: ['newImg1']
         *                                  category: New category
         *                                  stock: 10
         *              required: true
         *          responses:
         *              201:
         *                  description: The product updated
         *                  content:
         *                      application/json:
         *                          example:
         *                              title: New title
         *                              description: New description
         *                              price: 20000
         *                              thumbnail: ['newImg1']
         *                              category: New category
         *                              stock: 10
         *                              code: FRGA4
         *                              status: true
         *                              owner: admin
         *                              _id: 647e103a4cc63e0cd4317a0c
         *              204:
         *                  description: If you send a empty form
         *              400:
         *                  description: Error in request
         *              500:
         *                  description: Some server Error
         */
        this.put('/:pid', ['ADMIN', 'PREMIUM'], updateProduct);

        //!---------METODO DELETE-----

        /**
         * @swagger
         * /api/products/{:pid}:
         *      delete:
         *          summary: Deletes a product
         *          tags: [Products]
         *          parameters:
         *              - name: pid
         *                in: path
         *                description: Id of the product
         *                required: true
         *                schema: 
         *                    type: objectID
         *          responses:
         *              200:
         *                  description: Product has been deleted
         *              500:
         *                  description: Some server Error
         */
        this.delete('/:pid', ['ADMIN', 'PREMIUM'], deleteProduct);
    }
}

const productRouter = new ProductRouter()

export default productRouter