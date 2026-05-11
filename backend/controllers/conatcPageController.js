const ContactPageContent = require("../schema/contactPageContent");

// Helper Function: Ensure at least one document exists
const getOrCreateDoc = async () => {
    let doc = await ContactPageContent.findOne();
    if (!doc) doc = await ContactPageContent.create({});
    return doc;
};

// ==========================================
// 1. GLOBAL PAGE DATA CRUD (Main Headings/Descriptions)
// ==========================================

// READ: Pura page data fetch karna
exports.getPageContent = async (req, res) => {
    try {
        const content = await getOrCreateDoc();
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// UPDATE: Main headings aur descriptions edit karna
exports.updateMainContent = async (req, res) => {
    try {
        const { specializedHeading, specializedDesc, contactHeading, contactDesc } = req.body;
        
        const updatedContent = await ContactPageContent.findOneAndUpdate(
            {}, // Empty filter means update the first document found
            { 
                $set: {
                    "specializedSection.heading": specializedHeading,
                    "specializedSection.description": specializedDesc,
                    "contactSection.heading": contactHeading,
                    "contactSection.paragraph": contactDesc
                }
            },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, message: "Page text updated!", data: updatedContent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// ==========================================
// 2. SPECIALIZED CARDS CRUD
// ==========================================

// CREATE: Naya Card Add Karna
exports.addSolutionCard = async (req, res) => {
    try {
        const { iconName, title } = req.body;
        const updatedContent = await ContactPageContent.findOneAndUpdate(
            {}, 
            { $push: { "specializedSection.cards": { iconName, title } } },
            { new: true }
        );
        res.status(201).json({ success: true, message: "Card added!", data: updatedContent.specializedSection.cards });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: Kisi specific Card ko Edit Karna (Using Card ID)
exports.updateSolutionCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { iconName, title } = req.body;

        const updatedContent = await ContactPageContent.findOneAndUpdate(
            { "specializedSection.cards._id": cardId }, // Find specific card
            { 
                $set: { 
                    "specializedSection.cards.$.iconName": iconName,
                    "specializedSection.cards.$.title": title
                } 
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Card updated!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: Card Delete Karna
exports.deleteSolutionCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        await ContactPageContent.findOneAndUpdate(
            {}, 
            { $pull: { "specializedSection.cards": { _id: cardId } } }
        );
        res.status(200).json({ success: true, message: "Card deleted!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// ==========================================
// 3. CONTACT INFO ITEMS CRUD
// ==========================================

// CREATE: Naya Info Item Add Karna
exports.addContactInfoItem = async (req, res) => {
    try {
        const { iconName, label, value } = req.body;
        const updatedContent = await ContactPageContent.findOneAndUpdate(
            {}, 
            { $push: { "contactSection.infoItems": { iconName, label, value } } },
            { new: true }
        );
        res.status(201).json({ success: true, message: "Info item added!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// UPDATE: Kisi specific Info Item ko Edit Karna (Using Info ID)
exports.updateContactInfoItem = async (req, res) => {
    try {
        const { infoId } = req.params;
        const { iconName, label, value } = req.body;

        const updatedContent = await ContactPageContent.findOneAndUpdate(
            { "contactSection.infoItems._id": infoId }, // Find specific info item
            { 
                $set: { 
                    "contactSection.infoItems.$.iconName": iconName,
                    "contactSection.infoItems.$.label": label,
                    "contactSection.infoItems.$.value": value
                } 
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Info item updated!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// DELETE: Info Item Delete Karna
exports.deleteContactInfoItem = async (req, res) => {
    try {
        const { infoId } = req.params;
        await ContactPageContent.findOneAndUpdate(
            {}, 
            { $pull: { "contactSection.infoItems": { _id: infoId } } }
        );
        res.status(200).json({ success: true, message: "Info item deleted!" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};