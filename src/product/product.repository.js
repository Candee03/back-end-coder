class ProductRepository{
        constructor(dao) {
        this.dao = dao
    }

    async getProducts (limit = 10, page = 1, sort = false, category = false, status=undefined ) {
        try{
            return await this.dao.getProducts(limit = 10, page = 1, sort = false, category = false, status=undefined)
        } catch (err) {
            console.log(err);
        }
    }

    async getProductsRealTime () {
        try{
            return await this.dao.getProductsRealTime()
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {string} id 
     * @returns producto Encontrado
     */
    async getProductById (id) {
        try {
            return await this.dao.getProductById(id)
        }
        catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {object} objetProduct objeto del producto a agregar
     * @returns true si se añade el producto
     * @example {title, description, price, thumbnail, code, status, category, stock}
     */
    async addProduct (objetProduct) {
        return await this.dao.addProduct(objetProduct)
    }

    /**
    * @param {string} id Id del producto a eliminar
    */
    async deleteProduct (id) {
        try{
            return await this.dao.deleteProduct(id)
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
        return await this.dao.updateProduct(id, updatedProduct)
    }
}

export default ProductRepository