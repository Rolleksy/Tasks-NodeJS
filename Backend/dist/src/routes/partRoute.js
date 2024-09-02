"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partController_1 = __importDefault(require("../controllers/partController"));
const router = (0, express_1.Router)();
const partController = new partController_1.default();
// Get all parts
router.get('/parts', partController.getAllParts);
// Create a new part
router.post('/parts', partController.createPart);
// Delete a part by ID
router.delete('/parts/:id', partController.deletePart);
exports.default = router;
