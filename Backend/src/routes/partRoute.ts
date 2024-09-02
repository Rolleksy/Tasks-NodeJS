import { Router } from 'express';
import PartController from '../controllers/partController';

const router = Router();
const partController = new PartController();


// Get all parts
router.get('/parts', partController.getAllParts);

// Create a new part
router.post('/parts', partController.createPart);

// Delete a part by ID
router.delete('/parts/:id', partController.deletePart);

export default router;
