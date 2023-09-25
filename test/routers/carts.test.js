import chai from "chai";
import supertest from "supertest";


const expect = chai.expect
const request = supertest("http://localhost:8080")

describe('Test de integracion - Carts', () => {
    const user = {
        "email": "adminCoder@coder.com",
        "password": "adminCod3r123"
        }
    let cookie = {}

    before(async () => {
        await request.post('/api/users/auth').send(user)
        .then((result) => {
            const cookieResult= result.header["set-cookie"][0]
            cookie = cookieResult
        })
    })
    const cid = '6510f091cbd7f799c33ca368'
    const pid = '647e1088b635190c5329cdb0'

    it('El metodo GET de la ruta "/api/carts/:cid" debe obtener un carrito segun su ID', async() => {
        const { statusCode } = await request.get(`/api/carts/${cid}`).set('Cookie', cookie)

        expect(statusCode).to.be.equal(200)
    })

    it('El metodo POST de la ruta "/api/carts/:cid/product/:pid" agrega a un carrito especifico un producto especifico segun la ID', async() => {
        await request.post(`/api/carts/${cid}/product/${pid}`).set('Cookie', cookie)
        const { body } = await request.get(`/api/carts/${cid}`).set('Cookie', cookie)
        const idProductAdded = body[0].products[0].product._id

        expect(idProductAdded).to.be.equal(pid)
    })

    it('El metodo DELETE de la ruta "/api/carts/:cid/products/:pid" elimina un producto especifico de un carrito especifico segun la ID', async() => {
        await request.delete(`/api/carts/${cid}/products/${pid}`).set('Cookie', cookie)
        const { body, statusCode } = await request.get(`/api/carts/${cid}`).set('Cookie', cookie)

        expect(statusCode).to.be.equal(200)
        expect(body[0].products[0]).to.be.equal(undefined)
    })
})