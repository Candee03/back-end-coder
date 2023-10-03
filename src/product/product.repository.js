class ProductRepository{
        constructor(dao) {
        this.dao = dao
    }

    async getProducts (limit = 10, page = 1, sort = false, category = false, status=undefined ) {
        return await this.dao.getProducts(limit, page = 1, sort = false, category = false, status=undefined)

    }

    async getProductsRealTime () {
        return await this.dao.getProductsRealTime()
    }

    /**
     * @param {string} id 
     * @returns producto Encontrado
     */
    async getProductById (id) {
        return await this.dao.getProductById(id)
    }

    /**
     * @param {object} objectProduct objeto del producto a agregar
     * @returns true si se añade el producto
     * @example {title, description, price, thumbnail, code, status, category, stock}
     */
    async addProduct (objectProduct) {
        return await this.dao.addProduct(objectProduct)
    }

    /**
    * @param {string} id Id del producto a eliminar
    */
    async deleteProduct (id) {
        return await this.dao.deleteProduct(id)
    }

    /**
     * @param {string} id id del objeto a modificar
     * @param {object} updatedProduct objeto del producto a agregar
     * @example {title, description, price, thumbnail, code, status, category, stock}
    */
    async updateProduct (id, updatedProduct) {
        return await this.dao.updateProduct(id, updatedProduct)
    }
}

export default ProductRepository