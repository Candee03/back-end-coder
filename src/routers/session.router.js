import { Router } from "express";
// import { authToken } from "../config/jwt.js";
// import passport from "passport";
import { authorization, passportCall } from "../config/utils.js";
import { UserSafeDTO } from "../user/user.DTO.js";

const sessionsRouter = Router()

const PRIVATE_KEY = 'secretKey'

sessionsRouter.get('/current', passportCall('jwt'), authorization('admin'), (req,res) => {
    const user = new UserSafeDTO(req.user.user)
    res.status(200).send({user: user})
})
// sessionsRouter.get('/current', passport.authenticate('jwt', {session:false}), (req,res) => {
//     res.status(200).send({user: req.user})
// })
// sessionsRouter.get('/current', authToken, (req,res) => {
//     res.status(200).send({user: req.user, token: req.cookies})
// })

export default sessionsRouter