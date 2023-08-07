import { Router } from "express";
import { passportCall } from "../config/utils.js";
import { UserForUserDTO, UserSafeDTO } from "../user/user.DTO.js";

const sessionsRouter = Router()

const PRIVATE_KEY = 'secretKey'

sessionsRouter.get('/current', passportCall('jwt'), (req,res) => {
    if (req.user.user.role === 'admin') {
        const user = new UserSafeDTO(req.user.user)
            return res.status(200).send({user: user})
    }
    const user = new UserForUserDTO(req.user.user)
    return res.status(200).send({user: user})
})

export default sessionsRouter