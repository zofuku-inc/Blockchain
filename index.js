const express = require('express');
const app = express();
const formData = require('express-form-data')
const cors = require('cors');
require('dotenv').config();

app.use(express.json())
app.use(formData.parse())
app.use(cors())

const imageRoute = require('./api/routes/image');
const invoiceRoute = require('./api/routes/invoices');
const sendInvoiceRoute = require('./api/routes/sendInvoice');

app.use('/images', imageRoute);
app.use('/invoices', invoiceRoute);
app.use('/sendInvoice', sendInvoiceRoute);


const PORT = process.env.PORT || 5009
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

