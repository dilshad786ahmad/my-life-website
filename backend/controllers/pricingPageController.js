const PricingPageContent = require("../schema/pricingPageContent");

// Helper Function: Seed Data if empty
const getOrCreateDoc = async () => {
    let doc = await PricingPageContent.findOne();

    return doc;
};

// ==========================================
// 1. GET ALL PRICING PAGE CONTENT
// ==========================================
exports.getPageContent = async (req, res) => {
    try {
        const content = await getOrCreateDoc();
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// 2. HEADER CRUD
// ==========================================
exports.updateHeader = async (req, res) => {
    try {
        const { title, subtitle, highlightText } = req.body;
        const updatedContent = await PricingPageContent.findOneAndUpdate(
            {}, 
            { $set: { "header.title": title, "header.subtitle": subtitle, "header.highlightText": highlightText } },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, message: "Header updated!", data: updatedContent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// ==========================================
// 3. BASIC PLANS CRUD
// ==========================================
exports.addBasicPlan = async (req, res) => {
    try {
        const updatedContent = await PricingPageContent.findOneAndUpdate(
            {}, { $push: { basicPlans: req.body } }, { new: true }
        );
        res.status(201).json({ success: true, message: "Plan added!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateBasicPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        await PricingPageContent.findOneAndUpdate(
            { "basicPlans._id": planId },
            { $set: { "basicPlans.$": req.body } },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Plan updated!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteBasicPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        await PricingPageContent.findOneAndUpdate(
            {}, { $pull: { basicPlans: { _id: planId } } }
        );
        res.status(200).json({ success: true, message: "Plan deleted!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

// ==========================================
// 4. STANDARD SOLUTIONS CRUD
// ==========================================
exports.addStandardSolution = async (req, res) => {
    try {
        await PricingPageContent.findOneAndUpdate(
            {}, { $push: { standardSolutions: req.body } }, { new: true }
        );
        res.status(201).json({ success: true, message: "Solution added!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateStandardSolution = async (req, res) => {
    try {
        const { solutionId } = req.params;
        await PricingPageContent.findOneAndUpdate(
            { "standardSolutions._id": solutionId },
            { $set: { "standardSolutions.$": req.body } },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Solution updated!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteStandardSolution = async (req, res) => {
    try {
        const { solutionId } = req.params;
        await PricingPageContent.findOneAndUpdate(
            {}, { $pull: { standardSolutions: { _id: solutionId } } }
        );
        res.status(200).json({ success: true, message: "Solution deleted!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

// ==========================================
// 5. ENTERPRISE SYSTEMS CRUD
// ==========================================
exports.addEnterpriseSystem = async (req, res) => {
    try {
        await PricingPageContent.findOneAndUpdate(
            {}, { $push: { enterpriseSystems: req.body } }, { new: true }
        );
        res.status(201).json({ success: true, message: "Enterprise plan added!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.updateEnterpriseSystem = async (req, res) => {
    try {
        const { systemId } = req.params;
        await PricingPageContent.findOneAndUpdate(
            { "enterpriseSystems._id": systemId },
            { $set: { "enterpriseSystems.$": req.body } },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Enterprise plan updated!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteEnterpriseSystem = async (req, res) => {
    try {
        const { systemId } = req.params;
        await PricingPageContent.findOneAndUpdate(
            {}, { $pull: { enterpriseSystems: { _id: systemId } } }
        );
        res.status(200).json({ success: true, message: "Enterprise plan deleted!" });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
