process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('../app')
const db = require('../db')


describe('GET /companies & /companies:code', function () {
    test('Gets a list of companies', async function() {
        const response = await request(app).get(`/companies`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(
            {
            "companies": [
                {
                    "code": "apple",
                    "name": "Apple Computer",
                    "description": "Maker of OSX."
                },
                {
                    "code": "ibm",
                    "name": "IBM",
                    "description": "Big blue."
                }
                ]
            }
        )
    })

    test('Gets all details from a company', async function() {
        const response = await request(app).get(`/companies/apple`)
        expect(response.statusCode).toEqual(200)
    })
})

describe('POST /companies', function () {
    test('Adds a compapy to the companies', async function() {
        const response = await request(app).post(`/companies`).send({code: 'gg', name: 'Google', description: 'Very good company.'})
        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual(
            {
                "code": "gg",
                "name": "Google",
                "description": "Very good company."
            }
        )
    })
})

describe('PATCH /companies:code', function () {
    test('Updates a compapy', async function() {
        const response = await request(app).patch(`/companies/gg`).send({code: 'gg', name: 'google', description: 'Very good company.'})
        expect(response.statusCode).toEqual(201)
        expect(response.body).toEqual(
            {
                "code": "gg",
                "name": "google",
                "description": "Very good company."
            }
        )
    })
})

describe('DELETE /companies:code', function () {
    test('Deletes a compapy', async function() {
        const response = await request(app).delete(`/companies/gg`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(
            {status: "deleted"}
        )
    })
})