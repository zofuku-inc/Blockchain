const express = require('express');
const app = express();
const invoiceModel = require('./api/models');
const formData = require('express-form-data')
const cors = require('cors');
const cloudinary = require('cloudinary');
const SHA256 = require('crypto-js/sha256');

require('dotenv').config();

app.use(express.json())
app.use(formData.parse())

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

app.use(cors())

app.get('/invoices', async (req,res) => {
    try {
        const invoices = await invoiceModel.getInvoices()
        res.status(200).json(invoices)
    }
    catch(err) {
        res.status(500).json(err.message)
    }
    
})

app.delete('/invoices/:invoiceId', async (req,res) => {
    const {invoiceId} = req.params
    try {
        await invoiceModel.removeInvoice(invoiceId)
        res.status(200).json({message: 'Deleted 1 invoice'})
    }
    catch(err) {
        res.status(500).json(err.message)
    }
})

app.post('/invoices', async (req,res) => {
    const invoice = req.body
    invoice.hash = SHA256(JSON.stringify(invoice)).toString()
    try {
        const id = await invoiceModel.addInvoice(invoice)
        res.status(200).json(id)
    }
    catch(err) {
        res.status(500).json(err.message)
    }
    
})

app.post('/images', (req, res) => {
    const values = Object.values(req.files)
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    Promise
        .all(promises)
        .then(results => {
            res.status(200).json(results[0].url)
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
})


const PORT = process.env.PORT || 5009
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

