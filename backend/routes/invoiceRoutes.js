const express = require('express');
const {getInvoice, saveInvoice, updateInvoicePaymentStatus, getInvoiceById, getLastInvoiceNumber} = require('../controllers/invoiceController');

const router = express.Router();

router.get('/', getInvoice);
router.post('/', saveInvoice);
router.put('/update_status', updateInvoicePaymentStatus);
router.get('/by_id', getInvoiceById);
router.get('/last_invoice_number', getLastInvoiceNumber);
module.exports = router;