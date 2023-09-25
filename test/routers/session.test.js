import chai, { use } from "chai";
import supertest from "supertest";

const expect = chai.expect
const request = supertest("http://localhost:8080")

describe('Test de integracion - Session User', () => {
    let userId
    let cookie = {}

    after(async() => {
        await request.post('/api/users/logout').set('Cookie', cookie)
        cookie = {}
    })

    it('El metodo POST en la ruta "/api/users" debe registar un nuevo usuario', async() => {
        const user = {
            first_name: 'pedrito',
            last_name: 'sanchez',
            email: 'example@email.com',
            age: 20,
            password: '123456',
            img: 'exampleImage'
        }
        const {_body} = await request.post('/api/users').send(user)

        expect(_body._id).to.be.an('string')
        expect(_body.password).to.not.be.equal(user.password)
        userId = _body._id
    })

    it('El metodo POST en la ruta "/api/users/auth" debe iniciar la session del usuario', async() => {
        const user = {
            "email": "example@email.com",
            "password": "123456"
        }

        const {header} = await request.post('/api/users/auth').send(user)
        const cookieResult= header["set-cookie"][0]
        cookie = cookieResult
        
        expect(cookieResult).to.be.an('string')
    })

    it('El metodo DELETE en la ruta "/api/users/:uid" debe eliminar el usuario', async() => {
        await request.delete(`/api/users/${userId}`).set('Cookie', cookie)
        .then((result)=>{
            const { _body } = result;
            expect(_body).to.be.ok;
        })
    })
})