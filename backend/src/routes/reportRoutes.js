const express = require('express');
const router = express.Router();
const { getReports, deleteReport, createReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReport); 
router.get('/', protect, admin, getReports);
router.delete('/:id', protect, admin, deleteReport);

module.exports = router;