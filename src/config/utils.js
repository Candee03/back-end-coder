import { Server } from "socket.io";
import express from 'express';
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import session from "express-session";
import cookieParser from "cookie-parser";
import config from "./env.js"
import passport from "passport";

export const app = express()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(config.secretKey));

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:config.mongoUrl,
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: config.secretKey,
		resave: true,
		saveUninitialized: true,
	})
);
mongoose.connect(config.mongoUrl)


export const passportCall = (strategy) => {
	return async(req, res, next) => {
		passport.authenticate(strategy, function(err, user, info) {
			if (err) return next(err)
			if (!user) {
				return res.redirect('/login')
				// return res.status(401).send({error: info.messages? info.messages : info.toString()})
			}
			req.user = user
			next()
		})(req, res, next)
	}
}

export const authorization = (role) => {
	return async(req, res, next) => {
		if(!req.user) return res.status(401).send({error: 'Unauthorized'})
		if(req.user.user.role !== role) return res.status(403).send({error: 'no tienes permiso para entrar'})
		next()
	}
}

export const generarCodigoAleatorio = (longitud) => {
	const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let codigo = '';
	for (let i = 0; i < longitud; i++) {
		const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
		codigo += caracteres.charAt(indiceAleatorio);
	}
	return codigo;
}
//!---socket.io--------------------------------
const httpServer = app.listen(config.port , () => {
    console.log(`esta escuchando el server ${config.port}`)
})
const io = new Server(httpServer)


export {io}