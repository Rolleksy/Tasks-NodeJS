const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');

// Get all parts
router.get('/parts', partController.getAllParts);

// Create a new part
router.post('/parts', partController.createPart);

// Delete a part by ID
router.delete('/parts/:id', partController.deletePart);

module.exports = router;
