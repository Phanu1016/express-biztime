const express = require('express')
const router = express.Router()
const ExpressError = require("../expressError")
const database = require("../db")

router.get('/', async (req, res) => {

    const results = await database.query(`SELECT * FROM companies`)

    for (let i = 0; i < results.rows.length; i++) {

        const industry_results = await database.query(`
            SELECT i.code, i.name
            FROM companies AS c
            LEFT JOIN companies_industries AS ci
            ON c.code = ci.company_code
            LEFT JOIN industries AS i
            ON ci.industry_code = i.code
            WHERE c.code = $1`, [results.rows[i].code])

            results.rows[i].industries = industry_results.rows[0]
        
      }

    return res.json({companies: results.rows})
  
});

router.get('/:code', async (req, res, next) => {
    const { code } = req.params
    try{
        const company_results = await database.query(`SELECT * FROM companies WHERE code=$1`, [code])
        if ( company_results.rows.length === 0){
            throw new ExpressError(`No such company: ${code}`, 404)
        }
        else{

            const invoice_results = await database.query('SELECT * FROM invoices WHERE comp_code=$1', [code])
            let company = company_results.rows[0]
            company.invoices = invoice_results.rows[0]

            const industry_results = await database.query(`
            SELECT i.code, i.name
            FROM companies AS c
            LEFT JOIN companies_industries AS ci
            ON c.code = ci.company_code
            LEFT JOIN industries AS i
            ON ci.industry_code = i.code
            WHERE c.code = $1`, [code])
            company.industries = industry_results.rows[0]


            return res.json({companies: company})

        }
    } catch (error) {
        return next(error)
    }
});

router.post('/', async (req, res, next) => {
    try{
        const { code, name, description } = req.body
        const results = await database.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description])
        return res.status(201).json(results.rows[0])
    } catch (error) {
        return next(error)
    }
});

router.patch('/:code', async (req, res, next) => {
    try{
        const { code } = req.params
        const { name, description } = req.body
        const results = await database.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description,code])
        if ( results.rows.length === 0){
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.status(201).json(results.rows[0])
        }
    } catch (error) {
        return next(error)
    }
})

router.delete('/:code', async (req, res, next) => {
    try{
        const { code } = req.params
        const results = await database.query('DELETE FROM companies WHERE code=$1 RETURNING code', [code])
        if ( results.rows.length === 0){
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({status: "deleted"})
        }
    } catch (error) {
        return next(error)
    }
})



module.exports = router