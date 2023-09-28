class UserRepository {
    constructor(dao) {
        this.dao = dao
    }
    async getAll() {
		return await this.dao.getAll()
	}

	async getByEmail(email) {
		return await this.dao.getByEmail(email);
	}

	async createUser(userData) {
		return await this.dao.createUser(userData);
	}

	async getById(id) {
		return await this.dao.getById(id)
	}

	async updatePassword(id, password) {
		return await this.dao.updatePassword(id, password)
	}

	async updateRole(id, role) {
		return await this.dao.updateRole(id, role)
	}

	async deleteUser(uid) {
		return await this.dao.deleteUser(uid)
	}
	async updateConnection (uid, date) {
		return await this.dao.updateConnection(uid, date)
	}

	/**
	 * 
	 * @param {string} uid _id del user
	 * @param {Array} docs array con todos los documentos del usuario
	 */
	async uploadDocs (uid, docs) {
		return await this.dao.uploadDocs(uid, docs)
	}
}

export default UserRepository;