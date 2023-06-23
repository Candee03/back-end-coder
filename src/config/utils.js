import { Server } from "socket.io";
import express from 'express';
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import session from "express-session";
import cookieParser from "cookie-parser";


const app = express()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('B2zdY3B$pHmxW%'));

// Session
app.use(
	session({
		store: MongoStore.create({
			mongoUrl:
				'mongodb+srv://candelaalfano1503:Candela1234@candecluster.7rjnqro.mongodb.net/ecommerce?retryWrites=true&w=majority',
			mongoOptions: {
				useNewUrlParser: true,
			},
			ttl: 6000,
		}),
		secret: 'B2zdY3B$pHmxW%',
		resave: true,
		saveUninitialized: true,
	})
);

mongoose.connect(
    'mongodb+srv://candelaalfano1503:Candela1234@candecluster.7rjnqro.mongodb.net/ecommerce?retryWrites=true&w=majority'
)

//!---socket.io--------------------------------
const httpServer = app.listen(8080, () => {
    console.log('esta escuchando el server 8080')
})
const io = new Server(httpServer)


export {io, app}