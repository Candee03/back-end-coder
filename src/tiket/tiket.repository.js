class TiketRepository {
    constructor (dao) {
        this.dao = dao
    }

    /**
     * 
     * @param {string} email email del comprador
     * @param {number} totalAmount precio total de la compra
     */
    async createTiket (email, totalAmount) {
        await this.dao.createTiket(email, totalAmount)
    }
}

export default TiketRepository