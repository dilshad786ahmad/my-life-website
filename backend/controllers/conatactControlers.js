const ContactSubmission = require("../schema/conatctSchema");

// 1. CREATE: Public user message bhejega
exports.submitContactForm = async (req, res) => {
    try {
        const newSubmission = new ContactSubmission(req.body);
        await newSubmission.save();
        res.status(201).json({ success: true, message: "Message sent successfully! 🚀" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 2. READ: Admin saare messages dekhega (Filter aur Newest first ke sath)
exports.getAllSubmissions = async (req, res) => {
    try {
        const { status } = req.query; // URL se status uthayega, e.g., ?status=new

        let filter = {};

        // Agar status query mein hai, toh filter mein add karo
        if (status && ["new", "read", "replied"].includes(status)) {
            filter.status = status;
        }

        const submissions = await ContactSubmission.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length, // Ye frontend par dikhane ke kaam aayega
            data: submissions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 3. UPDATE: Admin status ya notes change karega
exports.updateSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        // Validation: Check ki status enum ke hisab se sahi hai ya nahi
        if (status) {
            const allowedStatus = ["new", "read", "replied"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status! Sirf new, read, ya replied hi chalega."
                });
            }
        }

        const updatedData = await ContactSubmission.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: status,
                    adminNotes: adminNotes
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedData) {
            return res.status(404).json({ success: false, message: "Lead nahi mili!" });
        }

        res.status(200).json({
            success: true,
            message: "Lead updated successfully! 🎯",
            data: updatedData
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 4. DELETE: Admin message delete karega
exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ContactSubmission.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ success: false, message: "Already deleted" });

        res.status(200).json({ success: true, message: "Submission deleted! 🗑️" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};