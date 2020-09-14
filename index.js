const express = require('express');
const app = express();
const invoiceModel = require('./api/models');
const cors = require('cors');

app.use(express.json())

// app.use('/', (req,res) => {
//     res.send('Hello world');
// })

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

app.post('/invoices', async (req,res) => {
    const invoice = req.body
    try {
        const id = await invoiceModel.addInvoice(invoice)
        res.status(200).json(id)
    }
    catch(err) {
        res.status(500).json(err.message)
    }
    
})


const PORT = process.env.PORT || 5009
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

