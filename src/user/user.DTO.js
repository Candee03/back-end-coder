import { hashPassword } from "../config/encript.util.js";

export class UserRegisterDTO {
    constructor(user, password, cartId) {
        this._id = user._id
        this.first_name = user.first_name || ''
        this.last_name = user.last_name || ''
        this.email = user.email || ''
        this.age = user.age || 0
        this.password = hashPassword(password) || ''
        this.img = user.img || ''
        this.role = 'user'
        this.cartId = cartId
    }
}

export class UserSafeDTO {
    constructor (user) {
        this._id = user._id
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.img = user.img
        this.role = user.role
        this.cartId = user.cartId
    }
}
export class UserForUserDTO {
    constructor (user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.img = user.img
    }
}