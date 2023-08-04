import TiketMongo from "./tiket.DAO.js";
import TiketRepository from "./tiket.repository.js";

export const tiketService = new TiketRepository(new TiketMongo())