import { generarCodigoAleatorio } from "../config/utils.js";
import { tiketModel } from "./tiket.model.js";

class TiketMongo {
    constructor() {
        this.model = tiketModel
    }

    /**
     * 
     * @param {string} email email del comprador
     * @param {number} totalAmount precio total de la compra
     */
    async createTiket (email, totalAmount) {
        const created_at = new Date
        const tiket = {
            code: generarCodigoAleatorio(8),
            purchaser: email,
            amount: totalAmount,
            purchase_datetime: created_at.toLocaleString()
        }
        await this.model.create(tiket)
        return tiket
    }
}

export default TiketMongo