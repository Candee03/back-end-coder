import EErrors from "../tools/EErrors.js"
import CustomErrors from "../tools/customError.js"
import { findProductInfo, } from "../tools/info.js"
import { productModel } from "./product.model.js"
import { userModel } from "../user/user.model.js"

class ProductMongo{
        constructor() {
        this.model = productModel
    }

    async getProducts (limit = 10, page = 1, sort = false, category = false, status=undefined ) {
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
    }

    async getProductsRealTime () {
        return await this.model.find().lean()
    }

    /**
     * @param {string} id 
     * @returns producto Encontrado
     */
    async getProductById (id) {
        const product = await this.model.findById(id).lean()
        
        if (product ===null || product === undefined) {
            throw CustomErrors.createError({
                name: 'Error al encontrar el producto',
                message: 'El producto no existe',
                cause: findProductInfo(id),
                code: EErrors.INVALID_TYPE
            })
        }
        else {
            return product
        }
    }

    /**
     * @param {object} objectProduct objeto del producto a agregar
     * @returns true si se añade el producto
     * @example {title, description, price, thumbnail, code, status, category, stock}
     */
    async addProduct (objectProduct) {
        await this.model.create(objectProduct)
        return true
    }

    /**
    * @param {string} id Id del producto a eliminar
    */
    async deleteProduct (id) {
        return await this.model.deleteOne({_id : id})
    }

    /**
     * @param {string} id id del objeto a modificar
     * @param {object} updatedProduct objeto del producto a agregar
     * @example {title, description, price, thumbnail, code, status, category, stock}
    */
    async updateProduct (id, updatedProduct) {
        return await this.model.updateOne({_id:id}, updatedProduct, {new: true})
    }
}

export default ProductMongo