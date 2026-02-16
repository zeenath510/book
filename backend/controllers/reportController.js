const Report = require("../models/Report");

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
    const { targetType, targetId, reason } = req.body;

    try {
        const report = await Report.create({
            reporter: req.user._id,
            targetType,
            targetId,
            reason,
        });

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reporter", "name email")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/resolve
// @access  Private/Admin
const resolveReport = async (req, res) => {
    const { status } = req.body; // 'resolved' or 'dismissed'

    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        report.status = status;
        await report.save();

        res.json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { createReport, getReports, resolveReport };
