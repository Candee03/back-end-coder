import { Server } from "socket.io";
import express from 'express';
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import session from "express-session";
import cookieParser from "cookie-parser";
import config from "./env.js"

const app = express()

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

//!---socket.io--------------------------------
const httpServer = app.listen(config.port , () => {
    console.log(`esta escuchando el server ${config.port}`)
})
const io = new Server(httpServer)


export {io, app}