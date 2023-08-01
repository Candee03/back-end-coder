import { Router } from "express";
import { authToken } from "../config/jwt.js";

const sessionsRouter = Router()

const PRIVATE_KEY = 'secretKey'

sessionsRouter.get('/current', authToken, (req,res) => {
    res.status(200).send({user: req.user})
})

export default sessionsRouter