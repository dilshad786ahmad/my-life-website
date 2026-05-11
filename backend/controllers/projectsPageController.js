const ProjectsPageContent = require("../schema/projectsPageContent");

// Get Projects
exports.getProjectsPageContent = async (req, res) => {
    try {
        let content = await ProjectsPageContent.findOne();
        if (!content) {
            content = await ProjectsPageContent.create({
                header: {
                    description: "A showcase of my recent work across design and engineering."
                },
                projects: [
                    { title: "Quantum Dashboard", category: "Web Application", image: "https://images.unsplash.com/photo-1551288049-bbdac8626ad1", tags: ["React", "Analytics"], price: 1500 },
                    { title: "Nexus Brand", category: "Brand Identity", image: "https://images.unsplash.com/photo-1634942537034-2531766767d7", tags: ["Design", "Strategy"], price: 2000 }
                ]
            });
        }

        let filteredProjects = [...content.projects];
        const { search, category, sort } = req.query;

        if (search) {
            const query = search.toLowerCase();
            filteredProjects = filteredProjects.filter(p => 
                p.title.toLowerCase().includes(query) || 
                (p.description && p.description.toLowerCase().includes(query)) ||
                p.tags.some(t => t.toLowerCase().includes(query))
            );
        }

        if (category && category !== "All") {
            filteredProjects = filteredProjects.filter(p => p.category === category);
        }

        if (sort) {
            if (sort === "price-asc") {
                filteredProjects.sort((a, b) => a.price - b.price);
            } else if (sort === "price-desc") {
                filteredProjects.sort((a, b) => b.price - a.price);
            } else if (sort === "name-asc") {
                filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sort === "name-desc") {
                filteredProjects.sort((a, b) => b.title.localeCompare(a.title));
            }
        }

        // Send response with filtered projects
        res.status(200).json({ 
            success: true, 
            data: {
                ...content._doc,
                projects: filteredProjects
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Header
exports.updateProjectsHeader = async (req, res) => {
    try {
        const content = await ProjectsPageContent.findOneAndUpdate({}, { header: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Projects
exports.updateProjectsItems = async (req, res) => {
    try {
        const content = await ProjectsPageContent.findOneAndUpdate({}, { projects: req.body.projects }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
