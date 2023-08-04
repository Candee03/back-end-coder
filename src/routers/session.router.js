import { Router } from "express";
import { authorization, passportCall } from "../config/utils.js";
import { UserSafeDTO } from "../user/user.DTO.js";

const sessionsRouter = Router()

const PRIVATE_KEY = 'secretKey'

sessionsRouter.get('/current', passportCall('jwt'), authorization('admin'), (req,res) => {
    const user = new UserSafeDTO(req.user.user)
    res.status(200).send({user: user})
})

export default sessionsRouter