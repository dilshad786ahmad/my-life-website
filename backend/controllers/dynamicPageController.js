const DynamicPage = require("../schema/dynamicPageSchema");

// Seed default pages if they don't exist
const seedDefaults = async (slug) => {
    let page = await DynamicPage.findOne({ slug });
    if (!page) {
        if (slug === "get-started") {
            page = await DynamicPage.create({
                slug: "get-started",
                title: "Get Started with ModernCorp",
                heroSubtitle: "Your journey to scaling your enterprise begins here.",
                sections: [
                    {
                        heading: "Step 1: Consultation",
                        paragraph: "We begin with a deep dive into your business architecture and requirements.",
                        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
                        features: ["Expert analysis", "Tailored roadmaps", "Cost estimation"]
                    },
                    {
                        heading: "Step 2: Implementation",
                        paragraph: "Our engineers deploy scalable solutions tailored for high performance.",
                        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
                        features: ["Agile sprints", "Zero downtime deployment", "Secure infrastructure"]
                    }
                ]
            });
        } else if (slug === "learn-more") {
            page = await DynamicPage.create({
                slug: "learn-more",
                title: "Why Choose ModernCorp?",
                heroSubtitle: "Discover the technology and methodology behind our success.",
                sections: [
                    {
                        heading: "Cutting-Edge Technology",
                        paragraph: "We leverage the latest frameworks to ensure your products are future-proof.",
                        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
                        features: ["React & Node.js", "Cloud-native architectures", "Microservices"]
                    },
                    {
                        heading: "Dedicated Support",
                        paragraph: "Our relationship doesn't end at deployment. We offer 24/7 monitoring and support.",
                        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
                        features: ["Proactive monitoring", "Dedicated account managers", "SLA guarantees"]
                    }
                ]
            });
        }
    }
    return page;
};

exports.getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        let page = await seedDefaults(slug); // Auto-seed if missing
        
        if (!page) {
            return res.status(404).json({ success: false, message: "Page not found." });
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
