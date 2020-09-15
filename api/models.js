const db = require('../database/dbConfig');

const getInvoices = () => {
    return db('invoices')
}

const addInvoice = (invoice) => {
    return db('invoices')
            .returning('id')
            .insert(invoice)
            .then(ids => ({id: ids[0]}))
}

const removeInvoice = (invoiceId) => {
    return db('invoices')
            .where({id: invoiceId})
            .del()
}

module.exports = {
    getInvoices,
    addInvoice,
    removeInvoice
}