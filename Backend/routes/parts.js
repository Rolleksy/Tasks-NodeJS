const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');

router.get('/parts', partController.getAllParts);
router.post('/parts', partController.createPart);
router.delete('/parts/:id', partController.deletePart);

module.exports = router;
