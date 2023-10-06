import config from '../config/env.js';
import { Router } from 'express';
import nodemailer from 'nodemailer';
import { tiketService } from '../tiket/tiket.controller.js';

const mailRouter = Router()

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: `${config.mail}`,
        pass: `${config.code_mail}`
    }
})

mailRouter.get('/restorePassword/:email/:token', async(req, res) => {
    const email = (req.params.email).toString()
    const token = req.params.token

    let result = await transport.sendMail({
        from:`${config.mail}`,
        to: email,
        subject: `Restablecer contraseña`,
        html:`
        <div>
            <h1>Link para restablecer tu contraseña ⬇️</h1>
            <p>Recuerda que tienes <strong>Una hora</strong> para restaurar la contraseña. Pasado ese tiempo el link ya no funcionara.</p>
            <a href="https://back-end-coder-production.up.railway.app/changePassword/${email}/${token}">
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

mailRouter.get('/:email', async(req, res) => {
    let result = await transport.sendMail({
        from:`${config.mail}`,
        to: (req.params.email).toString(),
        subject: `Usuario eliminado por inactividad`,
        html:`
        <div>
            <h2>Estimado Usuario:</h2>
            <p>Le comentamos que hemos eliminado su cuenta en nuestra tienda por inactividad.</p>
            <p>Su usuario ha sido eliminado porque pasaron más de 2 dias sin que se conecte.</p>
            <br>
            <br>
            <span>Atte: Candela</span>
        </div>
        `,
        attachments:[]
    })
    res.status(200).send('success')
})

mailRouter.get('/product/deleted/:email', async(req, res) => {
    let result = await transport.sendMail({
        from:`${config.mail}`,
        to: (req.params.email).toString(),
        subject: `Producto Eliminado`,
        html:`
        <div>
            <h2>Estimado Usuario:</h2>
            <p>Le comentamos que un producto que era de su propiedad en la tienda ha sido eliminado.</p>
            <p>Si no fue usted quien lo eliminó, entonces fue el administrador y lo invitamos coordialmente a que se comunique con nosotros.</p>
            <p>Saludos coordiales.</p>
            <br>
            <br>
            <span>Atte: Candela</span>
        </div>
        `,
        attachments:[]
    })
    return res.status(200).send('success')
})

mailRouter.get('/:codePurchase/:email/:name', async(req, res) => {
    const tiket = await tiketService.getTiket(req.params.codePurchase)
    let result = await transport.sendMail({
        from:`${config.mail}`,
        to: (req.params.email).toString(),
        subject: `Resumen de compra`,
        html:`
        <div>
            <h1>Resumen de tu compra:</h1>
            <p>A nombre de: ${req.params.name}</p>
            <p>Total: $${tiket.amount}</p>
            <p>Codigo de pedido: ${tiket.code}</p>
            <h2>GRACIAS POR TU COMPRA!!!</h2>
        </div>
        `,
        attachments:[]
    })
    res.status(200).send('success')
})

export default mailRouter