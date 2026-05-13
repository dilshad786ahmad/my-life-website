const ClientFeedback = require("../schema/clientFeedbackSchema");
const Auth = require("../schema/authentication");

// --- CLIENT OPERATIONS ---

// Create or update their own feedback (Only 1 per user allowed, or just let them create it, but update if exists)
exports.createOrUpdateFeedback = async (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;
    const userId = req.userId; // from auth middleware

    // Check if user already has feedback
    let feedback = await ClientFeedback.findOne({ user: userId });

    if (feedback) {
      // Update existing
      feedback.name = name || feedback.name;
      feedback.email = email || feedback.email;
      feedback.rating = rating || feedback.rating;
      feedback.comment = comment || feedback.comment;
      feedback.status = "approved"; // Reset status to approved when user updates it
      await feedback.save();
      return res.status(200).json({ success: true, message: "Feedback updated successfully", data: feedback });
    } else {
      // Create new
      feedback = new ClientFeedback({
        user: userId,
        name,
        email,
        rating,
        comment,
      });
      await feedback.save();
      return res.status(201).json({ success: true, message: "Feedback submitted successfully", data: feedback });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get current user's feedback
exports.getMyFeedback = async (req, res) => {
  try {
    const userId = req.userId;
    const feedback = await ClientFeedback.findOne({ user: userId });
    
    if (!feedback) {
      return res.status(200).json({ success: true, data: null, message: "No feedback found for this user" });
    }
    
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Client deletes their own feedback (Soft Delete)
exports.clientDeleteFeedback = async (req, res) => {
  try {
    const userId = req.userId;
    const feedback = await ClientFeedback.findOne({ user: userId });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    feedback.status = "deleted";
    await feedback.save();

    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- PUBLIC OPERATIONS ---

// Get all approved feedbacks for the public page
exports.getPublicFeedbacks = async (req, res) => {
  try {
    const feedbacks = await ClientFeedback.find({ status: "approved" })
      .populate("user", "role")
      .sort({ createdAt: -1 });
      
    // Format response to include isAdmin flag and sort
    const formattedFeedbacks = feedbacks.map(fb => {
      const fbObj = fb.toObject();
      fbObj.isAdmin = fbObj.user && fbObj.user.role === "admin";
      return fbObj;
    });

    // Pin admin feedback to the top
    formattedFeedbacks.sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      return 0; // maintain createdAt descending order for others
    });

    res.status(200).json({ success: true, data: formattedFeedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- ADMIN OPERATIONS ---

// Admin: Get all feedbacks (with optional query filters: search, startDate, endDate, status, page, limit)
exports.adminGetAllFeedbacks = async (req, res) => {
  try {
    const { search, startDate, endDate, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await ClientFeedback.countDocuments(query);
    const feedbacks = await ClientFeedback.find(query)
        .populate("user", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    res.status(200).json({ 
      success: true, 
      count: feedbacks.length, 
      total,
      data: feedbacks,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        prev: pageNumber > 1,
        next: pageNumber < Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Admin: Update feedback (status, etc.)
exports.adminUpdateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await ClientFeedback.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({ success: true, message: "Feedback updated", data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Admin: Delete feedback
exports.adminDeleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await ClientFeedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
