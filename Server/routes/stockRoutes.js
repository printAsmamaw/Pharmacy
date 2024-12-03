const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Route to get all medicine stocks
router.get('/medicine-stocks', stockController.getAllStocks);
router.get('/get-store-descriptions-ByUserId', stockController.getStoreDescriptionsByUserId);

// Route to save medicine shelf data
// router.post('/medicine-shelf', stockController.saveMedicineShelf);
// Route to create a store description and link medicine shelf
router.post('/store-description', stockController.createStoreDescription);
// Route to fetch all store descriptions
router.get('/get-store-descriptions', stockController.getAllStoreDescriptions);
router.get('/shelf_stocks/:id', stockController.getStockData);
router.put('/approve/:id', stockController.updatetheStatusApprove);
router.put('/return/:id', stockController.updatethestatuswithpending);
router.put('/update-status/:id', stockController.updateStoreDescription);
router.put('/approve-quantity/:id', stockController.updateQuantity);
router.get('/view-avalaibale', stockController.getMedicine);
router.get('/get-medicine-shelf', stockController.getMedicineShelf);
// Route for fetching counseled items
router.get('/get-counseled-items', stockController.getCounseledItems);
router.post('/approve-all', stockController.addStoreWithdraw);
router.get('/aproved-products', stockController.getWithdrawals);
router.get('/shelf-products', stockController.getShelfProducts);

module.exports = router;
