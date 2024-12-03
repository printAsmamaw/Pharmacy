const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
// Patient Routes


router.get('/all-patient', patientController.getAll);
router.get('/patients', patientController.getAllPatients); // Get all patients
router.get('/patients-pay-for-card', patientController.getPatientPay);
router.get('/patient/:id', patientController.getPatientById); // Get a specific patient
router.post('/add-patient', patientController.addPatient);
// In your routes file
router.post('/payment-for-card', patientController.addPaymentForCard);

router.put('/update-status', patientController.updatePatientStatus); // Update patient status
// Employee ID Generation Route
router.get('/generate-patient-id', patientController.createEmployeeId);
router.get('/search', patientController.searchPatients);
router.get('/all-doctors', patientController.getAllDoctors);
router.post('/evaluation', patientController.setEvaluation);
router.get('/evaluation/:patientId', patientController.getEvaluation);
router.post("/patient-orders", patientController.addPatientOrders);
router.get('/invoices', patientController.getInvoices);
router.get('/payment-details/:patient_id', patientController.getPaymentDetails);
router.post('/update-issue', patientController.updateOrder);
router.post('/confirm-payment', patientController.addPatientPayments);
router.get('/paid-payments', patientController.getPiadPatient);
router.get("/:patientId/details", patientController.getPatientDetails);
router.post('/update-stock', patientController.updateShelfQuantity);
router.post('/:patientId/update-issue', patientController.updateIssueStatus);
router.post('/:patientId/counseled-items', patientController.addCounseledItems);
router.put('/update-evaluation-issue', patientController.EvaluationUpdateIssue);
router.delete('/delete-temporary-data/:patientId', patientController.deleteTemporaryData);
router.delete('/orders/:patientId', patientController.deleteordersData);
router.delete('/:patientId/update-evaluation-data', patientController.updateEvaluationStatus);

module.exports = router;
