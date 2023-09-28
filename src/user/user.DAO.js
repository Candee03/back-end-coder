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
	
	async updatePassword(id, password) {
		return await this.model.findOneAndUpdate({_id: id,}, {password: password})
	}
	
	async updateRole (id, role) {
		return await this.model.findOneAndUpdate({_id: id}, {role: role})
	}

	async deleteUser (uid) {
		return await this.model.deleteOne({_id: uid})
	}
	async updateConnection (uid, date) {
		return await this.model.findOneAndUpdate({_id: uid}, {last_connection: date})
	}

	async uploadDocs (uid, docs) {
		const user = await this.model.findOne({_id: uid})
		const documents = user.documents

		await this.model.findByIdAndUpdate({_id: uid}, {documents: docs})
		const newDocuments = await this.model.findOne({_id: uid})

		user.documents = [...documents, ...newDocuments.documents]
		return await user.save()
	}

}

export default UserMongo;