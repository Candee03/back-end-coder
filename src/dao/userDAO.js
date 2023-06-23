import { userModel } from "./models/user.model.js";

class UserService {
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
}

export default UserService;