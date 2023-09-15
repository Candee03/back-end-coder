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

mailRouter.get('/restorePassword/:email/:token', async(req, res) => {
    const email = (req.params.email).toString()
    const token = req.params.token

    let result = await transport.sendMail({
        from:'candela.alfano1503@gmail.com',
        to: email,
        subject: `Restablecer contraseña`,
        html:`
        <div>
            <h1>Link para restablecer tu contraseña ⬇️</h1>
            <p>Recuerda que tienes <strong>Una hora</strong> para restaurar la contraseña. Pasado ese tiempo el link ya no funcionara.</p>
            <a href="http://localhost:8080/changePassword/${email}/${token}">
                <button style="border: 1.5px rgb(4, 4, 94) solid; border-radius: 10px; background-color:rgb(1, 1, 162); color:white;">
                    Restablecer contraseña
                </button>
            </a>
            <p><strong>Si vos no pediste la restauracion solo ignora el mensaje</strong></p>
        </div>
        `,
        attachments:[]
    })
    res.redirect('/login')
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