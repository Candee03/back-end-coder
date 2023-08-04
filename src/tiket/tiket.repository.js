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
        return await this.dao.createTiket(email, totalAmount)
    }

    /**
     * 
     * @param {string} purchaserCode 
     * @returns tiket encontrado
     */
    async getTiket (purchaserCode) {
        return await this.dao.getTiket(purchaserCode)
    }
}

export default TiketRepository