const TeamMember = require('../schema/teamMemberSchema');

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single team member
exports.getTeamMemberById = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.status(200).json(teamMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create team member (Admin only)
exports.createTeamMember = async (req, res) => {
    try {
        let { name, role, bio, socialLinks, skills, achievements, projects, email, phone, location } = req.body;
        
        // Parse JSON strings if sent via FormData
        if (typeof socialLinks === 'string') socialLinks = JSON.parse(socialLinks);
        if (typeof skills === 'string') skills = JSON.parse(skills);
        if (typeof achievements === 'string') achievements = JSON.parse(achievements);
        if (typeof projects === 'string') projects = JSON.parse(projects);

        let imageUrl = req.body.image; // Fallback to URL if provided
        if (req.files && req.files['image']) {
            imageUrl = `http://localhost:5000/uploads/${req.files['image'][0].filename}`;
        }

        // Handle project images mapping
        if (req.files && req.files['projectImages'] && projects) {
            let fileIndex = 0;
            projects = projects.map(project => {
                // If project had a local temporary file reference or needs an update
                if (project.hasNewImage && fileIndex < req.files['projectImages'].length) {
                    project.image = `http://localhost:5000/uploads/${req.files['projectImages'][fileIndex].filename}`;
                    fileIndex++;
                }
                delete project.hasNewImage; // Clean up flag
                return project;
            });
        }

        const newMember = new TeamMember({
            name, role, image: imageUrl, bio, socialLinks, skills, achievements, projects, email, phone, location
        });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update team member (Admin only)
exports.updateTeamMember = async (req, res) => {
    try {
        let data = { ...req.body };
        
        // Parse JSON strings if sent via FormData
        if (typeof data.socialLinks === 'string') data.socialLinks = JSON.parse(data.socialLinks);
        if (typeof data.skills === 'string') data.skills = JSON.parse(data.skills);
        if (typeof data.achievements === 'string') data.achievements = JSON.parse(data.achievements);
        if (typeof data.projects === 'string') data.projects = JSON.parse(data.projects);

        if (req.files && req.files['image']) {
            data.image = `http://localhost:5000/uploads/${req.files['image'][0].filename}`;
        }

        // Handle project images mapping
        if (req.files && req.files['projectImages'] && data.projects) {
            let fileIndex = 0;
            data.projects = data.projects.map(project => {
                if (project.hasNewImage && fileIndex < req.files['projectImages'].length) {
                    project.image = `http://localhost:5000/uploads/${req.files['projectImages'][fileIndex].filename}`;
                    fileIndex++;
                }
                delete project.hasNewImage;
                return project;
            });
        }

        const updatedMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );
        if (!updatedMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete team member (Admin only)
exports.deleteTeamMember = async (req, res) => {
    try {
        const deletedMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
