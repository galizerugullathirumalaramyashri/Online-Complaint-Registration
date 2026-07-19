const Complaint = require("../models/Complaint");

exports.getReportSummary = async (req, res, next) => {
  try {
    const statusCounts = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const byCategory = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const byDepartment = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const resolutionData = await Complaint.aggregate([
      {
        $match: {
          status: { $in: ["Resolved", "Closed"] }
        }
      },
      {
        $project: {
          resolutionHours: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageResolutionHours: {
            $avg: "$resolutionHours"
          }
        }
      }
    ]);

    const statuses = {
      Pending: 0,
      Assigned: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
      Rejected: 0,
      Reopened: 0
    };

    statusCounts.forEach((item) => {
      statuses[item._id] = item.count;
    });

    const totalComplaints = await Complaint.countDocuments();

    res.json({
      totalComplaints,
      pendingCount: statuses.Pending,
      statusCounts: statuses,
      byCategory,
      byDepartment,
      averageResolutionHours: resolutionData[0]
        ? Number(resolutionData[0].averageResolutionHours.toFixed(2))
        : 0
    });
  } catch (error) {
    next(error);
  }
};