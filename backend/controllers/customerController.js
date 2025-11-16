const Customer = require('../models/customer');
const Invoice = require('../models/invoice');

exports.getCustomer = async (req, res) => {
    try{
        const customers = await Customer.find();
        res.json(customers); 
    }
    catch (e) {
        res.status(500).json({ message: err.message });
    }
}

exports.getCustomerByPhone = async (req, res) => {

    try{
        
        const {phone} = req.query;

        const customerByPhone = await Customer.findOne({ phone: phone });
        res.json(customerByPhone);
    }
    catch (e) {
        res.status(500).json({ message: err.message });
    }

}

exports.saveCustomer = async (req, res) => {

    try{

        const {customer_name, email, phone, address } = req.body;

        const updatedPhone = `+91 ${phone}`;

        const existingCustomer = await Customer.findOne({ phone: updatedPhone });

        if (existingCustomer) {
            // If customer already exists with the same phone, return a message
            return res.status(400).json({ message: "Customer with this phone number already exists" });
        }

        
        const newCustomer = new Customer({customer_name, email, updatedPhone, address});

        const saveCustomer = await newCustomer.save();
        res.status(201).json(saveCustomer);
    }
    catch (e) {
        res.status(500).json({ message: err.message });
    }

}

exports.updateCustomer = async (req, res) => {

    try {
        
        const {cust_id, customer_name, email, phone, address } = req.body;

        const existingCustomer = await Customer.findOne({ phone: phone });

        if (existingCustomer) {
            // If customer already exists with the same phone, return a message
            return res.status(400).json({ message: "Customer with this phone number already exists" });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(cust_id, {customer_name, email, phone, address}, {new: true}); 

        res.status(200).json(updatedCustomer);

    } catch (e) {
        res.status(500).json({ message: err.message });
    }

}

exports.deleteCustomer = async (req, res) => {
    
    try {
        const customerId = req.params.id; 

        const deletedCustomer = await Customer.findByIdAndDelete(customerId);

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const deleteAssociatInvoice = await Invoice.deleteMany({ customer_id: customerId });
        
        res.status(200).json({
            message: 'Customer and associated invoices deleted successfully.',
            deleteAssociatInvoice
        });

    } catch (e) {
        res.status(500).json({ message: err.message });
    }


}
