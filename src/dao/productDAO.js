import { productModel } from './models/product.model.js';

class ProductServices{
    constructor() {
        this.model = productModel
    }

    async getProducts (limit = 10, page = 1, sort = false, category = false, status=undefined ) {
        try{
            let order = undefined
            if (sort) {
                order = {price: sort}
            }

            let filter = {}
            if (category) {
                filter = { category: category }
            }
            if (status) {
                filter = { status: status }
            }
            const products = await this.model.paginate(filter, { lean : true, limit, page, sort: order })

            products.prevLink = products.prevPage? 
            `?limit=${products.limit}&page=${products.prevPage}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}`
            : null
            
            products.nextLink = products.nextPage? 
            `?limit=${products.limit}&page=${products.nextPage}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ''}${status ? `&status=${status}` : ''}`
            : null

            return products
        } catch (err) {
            console.log(err);
        }
    }

    async getProductsRealTime () {
        try{
            return await this.model.find().lean()
        } catch (err) {
            console.log(err);
        }
    }
    // async getProductsWithLimit (limit) {
    //     try{
    //         return await this.model.find().limit(limit).lean()
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    /**
     * @param {string} id 
     * @returns producto Encontrado
     */
    async getProductById (id) {
        const productoEncontrado = await this.model.findById(id).lean()
        try{
            if (productoEncontrado === undefined) {
                throw new Error('Producto no encontrado')
            } else {
                return productoEncontrado
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    /**
     * @param {object} objetProduct objeto del producto a agregar
     * @returns true si se añade el producto
     * @example {title, description, price, thumbnail, code, status, category, stock}
     */
    async addProduct (objetProduct) {
        const {title, description, price, thumbnail, code, status, category, stock} = objetProduct
        try {
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                status,
                category,
                stock
            }
            if (product.title === undefined || product.category === undefined || product.status === undefined || product.description === undefined || product.price === undefined || product.code === undefined || product.stock === undefined){
                throw new Error(`Debes enviar todos los campos requeridos`)
            }
            await this.model.create(product)
            return true
        }
        catch (err) {
            console.log(`No se pudo agregar porque ${err.message}`);
        }
    }

    /**
    * @param {string} id Id del producto a eliminar
    */
    async deleteProduct (id) {
        try{
            return await this.model.deleteOne({_id : id})
        } catch (err) {
            console.log(err.message);
        }
    }

    /**
     * @param {string} id id del objeto a modificar
     * @param {object} updatedProduct objeto del producto a agregar
     * @example {title, description, price, thumbnail, code, status, category, stock}
    */
    async updateProduct (id, updatedProduct) {
        try {
            if (!id) {
                throw new Error('Debes enviar una id de usuario valida')
            } else {
                return await this.model.updateOne({_id:id}, updatedProduct, {new: true})
            }
        }
        catch (err) {
            console.log(`No se puede modificar el producto con id ${id} porque no existe`);
        }
    }

}

export default ProductServices