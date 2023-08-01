import UserRepository from "./user.repository.js"
import UserMongo from "./user.DAO.js"
import { UserSafeDTO } from "./user.DTO.js"
import { generateToken } from "../config/jwt.js"

export const userService = new UserRepository(new UserMongo())

export const getAllUsers = async(req, res) => {
    const users = await userService.getAll()
    res.send(users)
}

export const register = async(req, res) => {
    res.redirect('/login')
}

export const login = async(req, res) => {
    const {email} = req.body
    try{
        const user = await userService.getByEmail(email)
        req.session.user = new UserSafeDTO(user)
        const token = generateToken(user)
        
        res.cookie('token', token, {
            maxAge: 60000,
            httpOnly: true
        }).send(req.cookie);
        // res.redirect('/products')
    }
    catch (err) {
        res.status(400).json({error : err.message})
    }
}

export const logout = (req, res) => {
	req.session.destroy();
	res.redirect('/login');
}