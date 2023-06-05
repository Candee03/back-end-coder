import { Server } from "socket.io";
import express from 'express';
import mongoose from "mongoose";


const app = express()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))


mongoose.connect(
    'mongodb+srv://candelaalfano1503:Candela1234@candecluster.7rjnqro.mongodb.net/ecommerce?retryWrites=true&w=majority'
)

//!---socket.io--------------------------------
const httpServer = app.listen(8080, () => {
    console.log('esta escuchando el server 8080')
})
const io = new Server(httpServer)


export {io, app}