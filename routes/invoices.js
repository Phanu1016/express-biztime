const express = require('express')
const router = express.Router()
const ExpressError = require("../expressError")
const database = require("../db")

router.get('/', async (req, res) => {

    const results = await database.query(`SELECT * FROM invoices`)
    return res.json({invoices: results.rows})
  
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params
    try{
        const results = await database.query(`SELECT * FROM invoices WHERE id=$1`, [id])
        if ( results.rows.length === 0){
            throw new ExpressError(`No such invoice: ${id}`, 404)
        }
        else{
            return res.json({invoices: results.rows[0]})
        }
    } catch (error) {
        return next(error)
    }
});

router.post('/', async (req, res, next) => {
    try{
        const { comp_code, amt } = req.body
        const results = await database.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt])
        return res.status(201).json(results.rows[0])
    } catch (error) {
        return next(error)
    }
});

router.put('/:id', async (req, res, next) => {
    try{
        const { id } = req.params
        const { amt } = req.body
        const results = await database.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, id])
        if ( results.rows.length === 0){
            throw new ExpressError(`No such invoice: ${id}`, 404)
        } else {
            return res.json(results.rows[0])
        }
    } catch (error) {
        return next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try{
        const { id } = req.params
        const results = await database.query('DELETE FROM invoices WHERE id=$1 RETURNING id', [id])
        if ( results.rows.length === 0){
            throw new ExpressError(`No such invoice: ${id}`, 404)
        } else {
            return res.json({status: "deleted"})
        }
    } catch (error) {
        return next(error)
    }
})



module.exports = router