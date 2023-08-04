import config from '../config/env.js';
import { Router } from 'express';
import nodemailer from 'nodemailer';
import { tiketService } from '../tiket/tiket.controller.js';

const mailRouter = Router()

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'candela.alfano1503@gmail.com',
        pass: `${config.code_mail}`
    }
})

mailRouter.get('/:codePurchase', async(req, res) => {
    const tiket = await tiketService.getTiket(req.params.codePurchase)
    let result = await transport.sendMail({
        from:'candela.alfano1503@gmail.com',
        to: (req.session.user.email).toString(),
        subject: `Resumen de compra`,
        html:`
        <div>
            <h1>Resumen de tu compra:</h1>
            <p>A nombre de: ${req.session.user.first_name}</p>
            <p>Total: ${tiket.amount}</p>
            <p>Codigo de pedido: ${tiket.code}</p>
            <h2>GRACIAS POR TU COMPRA!!!</h2>
        </div>
        `,
        attachments:[]
    })
    res.redirect('/products')
})

export default mailRouter