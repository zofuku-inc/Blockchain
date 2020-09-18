const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/test', (req, res) => {
    res.status(200).json({message: 'worked!'})
})

router.post('/:invoiceId', (req,res) => {
    const invoiceId = req.params.invoiceId
    const hash = req.body.hash
    console.log(process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: 'smtp.gmail.com',
        // port: 587,
        // secure: false,
        // requireTLS: true,
        auth: {
            type: 'OAuth2',
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
            clientId: `${process.env.OAUTH2_CLIENT_ID}`,
            clientSecret: `${process.env.OAUTH2_CLIENT_SECRET}`,
            refreshToken: `${process.env.REFRESH_TOKEN}`
        }
    })
    const mailOptions = {
        from: 'jessiehong@zofuku.com',
        to: 'htran2@babson.edu',
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

module.exports = router;