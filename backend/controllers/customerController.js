const Customer = require('../models/customer');

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
        
        const newCustomer = new Customer({customer_name, email, phone, address});

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

        const updatedCustomer = await Customer.findByIdAndUpdate(cust_id, {customer_name, email, phone, address}, {new: true}); 

        res.status(200).json(updatedCustomer);

    } catch (e) {
        res.status(500).json({ message: err.message });
    }

}

exports.deleteCustomer = async (req, res) => {
    
    try {
        
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCustomer);

    } catch (e) {
        res.status(500).json({ message: err.message });
    }


}
