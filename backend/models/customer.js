const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customer_name : {type: String, require: true},
    email : {type: String},
    phone : {type: String, require: true},
    address : {type: String},
},{ timestamps: true });

module.exports = mongoose.model('customer', customerSchema);