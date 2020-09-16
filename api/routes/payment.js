const router = require('express').Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const uuid = require('uuid');

router.post('/', async (req, res) => {
    console.log('request:', req.body)
    let error;
    let status;
    try {
        const {invoice, token} = req.body;

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const idempotency_key = uuid();
        const charge = await stripe.charges.create({
            amount: invoice.price * 100,
            currency: "JPY",
            customer: customer.id,
            receipt_email: token.email,
            description: `Paid the invoice ${invoice.id}`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                    }
                }
            },
            {
                idempotency_key
            }
        );
        console.log("Charge:", { charge });
        status = "success"
    } catch (error){
        console.error("Error:", error)
        status = "failure"
    }

    res.json({ error, status });
})

module.exports = router;