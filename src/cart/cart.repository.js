class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createCart () {
        return await this.dao.create()
    }

    /**
     * @param {string} cid del carrito 
     * @param {string} pid del producto
     */
    async addProductToCart (cid, pid) {
        return await this.dao.addProductToCart(cid, pid)
    }

    /**
     * @param {string} cid del carrito 
     * @param {string} pid del producto
     */
    async deleteProductFromCart (cid, pid) {
        await this.dao.deleteOne(cid, pid)
    }
    
    /**
     * @param {string} cid del carrito 
     */
    async deleteAllProducts (cid) {
        await this.dao.deleteAll(cid)
    }

    async deleteCart (cid) {
        await await this.dao.deleteCart(cid)
    }

    /**
     * @returns todos los carritos
     */
    async getCarts () {
        return await this.dao.get()
    }

    /**
     * @param {string} id 
     * @returns Carrito Encontrado
     */
    async getCartById (id) {
        return await this.dao.getById(id)
    }

    /**
     * 
     * @param {string} cid id del carrito
     * @param {Array} products array con los productos
     */
    async updateAllProducts(cid, products) {
        await this.dao.updateAll(cid, products)
    }

    /**
     * @param {string} cid 
     * @param {string} pid 
     * @param {object} quantity 
     */

    async updateProduct(cid, pid, quantity) {
        return await this.dao.updateOne(cid, pid, quantity)
    }

    async getProductsFromCart(cid) {
        return await this.dao.getProductsPopulated(cid)
    }
}

export default CartRepository