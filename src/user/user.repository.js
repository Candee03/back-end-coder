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
}

export default UserRepository;