const express = require('express');
const app = express();
const formData = require('express-form-data')
const cors = require('cors');
require('dotenv').config();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(express.json())
app.use(formData.parse())
app.use(cors({
    origin: 'https://store.spaceincome.jp'
}))


const imageRoute = require('./api/routes/image');
const invoiceRoute = require('./api/routes/invoices');
const sendInvoiceRoute = require('./api/routes/sendInvoice');
const stripeCheckOutRoute = require('./api/routes/payment')

app.use('/images', imageRoute);
app.use('/invoices', invoiceRoute);
app.use('/sendInvoice', sendInvoiceRoute);
app.use('/checkout', stripeCheckOutRoute);


const PORT = process.env.PORT || 5009
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

