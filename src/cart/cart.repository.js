class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createCart () {
        try {
            return await this.dao.create()
        }
        catch (err) {
            console.log(`No se pudo crear el carrito`);
        }
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
        try {
            await this.dao.deleteOne(cid, pid)
        }
        catch (err) {
            console.log(err.name, err.message);
        }
    }
    
    /**
     * @param {string} cid del carrito 
     */
    async deleteAllProducts (cid) {
        try {
            await this.dao.deleteAll(cid)
        }
        catch (err) {
            console.log(err.name, err.message);
        }
    }

    /**
     * @returns todos los carritos
     */
    async getCarts () {
        try{
            return await this.dao.get()
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {string} id 
     * @returns Carrito Encontrado
     */
    async getCartById (id) {
        try{
            return await this.dao.getById(id)
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * 
     * @param {string} cid id del carrito
     * @param {Array} products array con los productos
     */
    async updateAllProducts(cid, products) {
        try {
            await this.dao.updateAll(cid, products)
        }
        catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {string} cid 
     * @param {string} pid 
     * @param {object} quantity 
     */

    async updateProduct(cid, pid, quantity) {
        try {
            return await this.dao.updateOne(cid, pid, quantity)
        }
        catch (err) {
            console.log(err);
        }
    }

    async getProductsFromCart(cid) {
        return await this.dao.getProductsPopulated(cid)
    }
}

export default CartRepository