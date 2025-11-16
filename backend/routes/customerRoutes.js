const express = require('express');
const {getCustomer, getCustomerByPhone, getCustomerByID, saveCustomer, updateCustomer, deleteCustomer} = require('../controllers/customerController');

const router = express.Router();

router.get('/', getCustomer);
router.get('/by_phone', getCustomerByPhone);
router.get('/:id', getCustomerByID)
router.post('/', saveCustomer);
router.put('/', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;