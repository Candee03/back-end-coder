import { userModel } from "./user.model.js";

class UserMongo {
    constructor() {
        this.model = userModel
    }
    async getAll() {
		return await this.model.find().lean()
	}

	async getByEmail(email) {
		return await this.model.findOne({ email: email });
	}

	async createUser(userData) {
		return await this.model.create(userData);
	}

	async getById(id) {
		return await this.model.findById(id)
	}
}

export default UserMongo;