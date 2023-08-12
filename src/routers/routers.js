import { Router } from "express";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../config/jwt.js";

export default class MakeRouter{
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter(){
        return this.router
    }

    init(){}

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }
    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }
    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callbacks) => async(...params)=>{
            return await callbacks.apply(this, params)
        })
    }

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === 'PUBLIC' || policies[0] == undefined ) return next()
        const token = req.cookies.token
        if (!token) return res.status(401).send({status: 'error', error: 'Unauthorized'})

        const user = jwt.verify(token, PRIVATE_KEY)

        if (!policies.includes(user.user.role?.toUpperCase())) {
            return res.status(401).send({status: 'error', error: 'Unauthorized'})
        }

        req.user= user
        next()
    }
}