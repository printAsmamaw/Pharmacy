const express = require("express");
const router = express.Router();
const opdController = require("../controllers/opdController");

// Define routes for OPD
router.post("/ward-registration", opdController.addWard);
router.get("/ward-data", opdController.getWards);
router.delete('/remove-data/:id', opdController.deleteWard);
router.get('/display-doctor-data', opdController.doctorData);
router.delete('/remove-doctor-data/:id', opdController.deleteDoctorsData);
router.get('/paid-patients', opdController.paidPatients);
router.post('/assign-ward', opdController.assingWard);
router.get("/patients/:slot_number", opdController.patientAssignedForDoctor);

module.exports = router;
