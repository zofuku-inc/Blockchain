const router = require('express').Router();
const invoiceModel = require('../models/invoices');
const SHA256 = require('crypto-js/sha256');

router.get('/', async (req,res) => {
    try {
        const invoices = await invoiceModel.getInvoices()
        res.status(200).json(invoices)
    }
    catch(err) {
        res.status(500).json(err.message)
    }
    
})

router.post('/', async (req,res) => {
    const invoice = req.body
    invoice.hash = SHA256(JSON.stringify(invoice)).toString()
    try {
        const response = await invoiceModel.addInvoice(invoice)
        res.status(200).json({id: response.id, hash: invoice.hash})
    }
    catch(err) {
        res.status(500).json(err.message)
    }
    
})

router.get('/:invoiceId', async (req, res) => {
    const invoiceId = req.params.invoiceId

    try {
        const invoice = await invoiceModel.getInvoiceById(invoiceId)
        res.status(200).json(invoice)
    } catch (err){
        res.status(500).json(err.message)
    }
})

router.delete('/:invoiceId', async (req,res) => {
    const {invoiceId} = req.params
    try {
        await invoiceModel.removeInvoice(invoiceId)
        res.status(200).json({message: 'Deleted 1 invoice'})
    }
    catch(err) {
        res.status(500).json(err.message)
    }
})

router.patch('/:invoiceId', async (req,res) => {
    const {invoiceId} = req.params
    const change = req.body
    try {
        await invoiceModel.updateInvoice(invoiceId, change)
        res.status(200).json({message: 'Updated 1 invoice'})
    }
    catch(err) {
        res.status(500).json(err.message)
    }
})



module.exports = router;