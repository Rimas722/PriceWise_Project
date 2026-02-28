const Report = require('../models/Report');

const createReport = async (req, res) => {
  try {
    const { price, reason, proofImage } = req.body;
    
    const Report = require('../models/Report'); 
    const report = new Report({
      price,
      reason,
      proofImage,
      reportedBy: req.user._id
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate({
        path: 'price',
        populate: { path: 'product shop' } 
      })
      .populate('reportedBy', 'name email');
      
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      await report.deleteOne();
      res.json({ message: 'Report dismissed' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getReports, deleteReport };