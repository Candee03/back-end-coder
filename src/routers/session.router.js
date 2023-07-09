import { Router } from "express";

const sessionsRouter = Router()

sessionsRouter.get('/current', (req,res) => {
    res.status(200).send({user: req.session.user})
})

export default sessionsRouter