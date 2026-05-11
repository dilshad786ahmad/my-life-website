const mongoose = require("mongoose");

const clientFeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Client",
  },
  company: {
    type: String,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "deleted"],
    default: "approved", // Default to approved for immediate visibility unless moderated
  },
}, { timestamps: true });

module.exports = mongoose.model("ClientFeedback", clientFeedbackSchema);
