import chai from "chai";
import supertest from "supertest";


const expect = chai.expect
const request = supertest("http://localhost:8080")


describe('Test de integracion - Products', () => {
    const user = {
        "email": "adminCoder@coder.com",
        "password": "adminCod3r123"
        }
    let cookie = {}
    let pid = {}

    before(async () => {
        await request.post('/api/users/auth').send(user)
        .then((result) => {
            const cookieResult= result.header["set-cookie"][0]
            cookie = cookieResult
        })
    })

    it('El metodo GET de la ruta "/api/products" debe retornar la lista de todos los productos', async () => {
        const { statusCode, _body } = await request.get('/api/products').set('Cookie', cookie)

        expect(statusCode).to.equal(200)
        expect(_body.docs).to.be.an('array')
        expect(_body.totalDocs).to.be.an('number')
    })

    it('El metodo POST en la ruta "/api/products" debe crear un producto satisfactoriamente', async() => {
        const newProduct = {
            title: 'test',
            description: 'description test',
            price: 20000,
            category: 'test',
            stock: 10
        }
        const { statusCode, body } = await request.post('/api/products').set('Cookie', cookie).send(newProduct)

        pid = body._id
        expect(body).to.have.property('code')
        expect(statusCode).to.equal(200)
    })
    
    it('El metodo DELETE en la ruta "/api/products/:pid" debe borrar un producto segun su ID', async() => {
        const { statusCode } = await request.delete(`/api/products/${pid}`).set('Cookie', cookie)

        expect(statusCode).to.equal(200)
    })
})