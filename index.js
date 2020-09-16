const express = require('express');
const app = express();
const invoiceModel = require('./api/models');
const formData = require('express-form-data')
const cors = require('cors');
const cloudinary = require('cloudinary');
const SHA256 = require('crypto-js/sha256');
const nodemailer = require('nodemailer');

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

app.get('/invoices/:invoiceId', async (req, res) => {
    const invoiceId = req.params.invoiceId

    try {
        const invoice = await invoiceModel.getInvoiceById(invoiceId)
        res.status(200).json(invoice)
    } catch (err){
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

app.post('/sendInvoice/:invoiceId', (req,res) => {
    const invoiceId = req.params.invoiceId
    const hash = req.body.hash
    console.log(process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })
    const mailOptions = {
        from: 'htran2@babson.edu',
        to: 'jessiehong@zofuku.com',
        subject: `Zofuku Bill | Invoice #${invoiceId}`,
        text: 
            'You are requested to pay an invoice for Zofuku.\n'
            + `To conduct the payment, you need this code ${hash}, so save it.\n`
            + `Please click on the following link, or paste this into your browser to view the bill and conduct payment.\n`
            + `https://store.spaceincome.jp/invoices/${invoiceId} \n`
            + 'Zofuku, Inc.\n'
            + 'hello@zofuku.com \n',
        html: 
            "<p>You are requested to pay an invoice for Zofuku.</p>\n"
            + "<p>To conduct the payment, you will need this code, make sure you save it</p>\n\n"
            + `<h2>${hash}</h2>\n\n`
            + `<p>Please click on the following link, or paste this into your browser to view the bill and conduct payment.</p>\n`
            + `<a style='font-size: 20px' href="https://store.spaceincome.jp/invoices/${invoiceId}">https://store.spaceincome.jp/invoices/${invoiceId} </a>\n`
            + '<p>Zofuku, Inc.</p>\n'
            + '<p>hello@zofuku.com </p>\n',
    }
    transporter.sendMail(mailOptions, (err, response) => {
        if (err){
            console.error('there was an error: ', err)
        } else {
            console.log('here is the res: ', response)
            res.status(200).json('invoice sent')        
        }
    })
})

const PORT = process.env.PORT || 5009
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

