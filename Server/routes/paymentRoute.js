const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');

router.get('/patient-sales-report', paymentController.getPaymentReport);
router.get('/patient-card-sales-report', paymentController.getSalesForPatientCard);
router.post('/doctors', paymentController.addDoctors);

module.exports = router;
