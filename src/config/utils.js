import { Server } from "socket.io";
import express from 'express'


const app = express()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//!---socket.io--------------------------------
const httpServer = app.listen(8080, () => {
    console.log('esta escuchando el server 8080')
})
const socketServer = new Server(httpServer)

export {socketServer, app}