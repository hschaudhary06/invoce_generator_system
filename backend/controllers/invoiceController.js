const Invoice = require('../models/invoice');
const Customer = require('../models/customer');

exports.getInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find();

        // Use Promise.all to resolve all async operations inside map
        const enrichedInvoices = await Promise.all(
            invoices.map(async (invoice) => {
                const customer = await Customer.findOne({ _id: invoice.customer_id });

                // Attach customer data to each invoice (optional structure)
                return {
                    ...invoice.toObject(), // Convert Mongoose document to plain object
                    customer: customer ? customer.toObject() : null
                };
            })
        );

        res.status(200).json(enrichedInvoices);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.saveInvoice = async (req, res) => {
    try {

        const {invoice_number, customer_id, date, due_date, items, amount, status, note } = req.body;

        console.log(invoice_number, customer_id, date, due_date, items, amount, status, note);

        const newInvoice = new Invoice({invoice_number, customer_id, date, due_date, items, amount, status, note });

        const saveInvoice = await newInvoice.save();

        res.status(201).json(saveInvoice);
        
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.updateInvoicePaymentStatus = async (req, res) => {

    try {

        const {invoice_id, status} = req.body;

        const updatedPaymentStatus = await Invoice.findByIdAndUpdate(invoice_id, {status}, {new: true});

        res.status(200).json(updatedPaymentStatus);
        
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.getInvoiceById = async (req, res) => {

    try {

        const {id} = req.query;

        const invoicebyid = await Invoice.findById(id);

        const customer = await Customer.findOne({ _id: invoicebyid.customer_id });

        // Use Promise.all to resolve all async operations inside map
        const enrichedInvoiceById = {
            ...invoicebyid.toObject(), // Convert Mongoose document to plain object
            customer: customer ? customer.toObject() : null
        };

        res.status(200).json(enrichedInvoiceById);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }

}

exports.getLastInvoiceNumber = async (req, res) => {

    try {

        const lastInvoice = await Invoice.findOne().sort({_id: -1});

        if (!lastInvoice) {
            return res.json('INV-000');
        }

        res.status(200).json(lastInvoice.invoice_number);
        
    } catch (e) {
        res.status(500).json({ message: e.message })
    }

}