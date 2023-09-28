process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('../app')
const db = require('../db')


describe('GET /invoices & /invoices:id', function () {
    test('Gets a list of invoices', async function() {
        const response = await request(app).get(`/invoices`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(
            {
                "invoices": [
                    {
                        "id": 1,
                        "comp_code": "apple",
                        "amt": 100,
                        "paid": false,
                        "add_date": "2023-09-27T07:00:00.000Z",
                        "paid_date": null
                    },
                    {
                        "id": 2,
                        "comp_code": "apple",
                        "amt": 200,
                        "paid": false,
                        "add_date": "2023-09-27T07:00:00.000Z",
                        "paid_date": null
                    },
                    {
                        "id": 3,
                        "comp_code": "apple",
                        "amt": 300,
                        "paid": true,
                        "add_date": "2023-09-27T07:00:00.000Z",
                        "paid_date": "2018-01-01T08:00:00.000Z"
                    },
                    {
                        "id": 4,
                        "comp_code": "ibm",
                        "amt": 400,
                        "paid": false,
                        "add_date": "2023-09-27T07:00:00.000Z",
                        "paid_date": null
                    }
                ]
            }
        )
    })

    test('Gets all details from an invoice', async function() {
        const response = await request(app).get(`/invoices/1`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(
            {
                "invoices": {
                    "id": 1,
                    "comp_code": "apple",
                    "amt": 100,
                    "paid": false,
                    "add_date": "2023-09-27T07:00:00.000Z",
                    "paid_date": null
                }
            }
        )
    })
})

describe('POST /invoices', function () {
    test('Adds an invoice', async function() {
        const response = await request(app).post(`/invoices`).send({comp_code: 'ibm', amt: 1000})
        expect(response.statusCode).toEqual(201)
    })
})

describe('PATCH /invoices:id', function () {
    test('Updates an invoice', async function() {
        const response = await request(app).patch(`/invoices/5`).send({comp_code: 'ibm', amt: 5000})
        expect(response.statusCode).toEqual(201)
    })
})

describe('DELETE /invoices:id', function () {
    test('Deletes an invoice', async function() {
        const response = await request(app).delete(`/invoices/5`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual(
            {status: "deleted"}
        )
    })
})