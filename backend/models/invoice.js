const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoice_number : {type: String, require: true},
    customer_id : {type: String, require: true},
    date : {type: Date, require: true},
    due_date : {type: Date, require: true},
    items : {type: Array, require: true},
    amount : {type: Number, require: true},
    status : {type: String, require: true},
    note : {type: String, require: true}
}, { timestamps: true });


module.exports = mongoose.model('invoice', invoiceSchema);