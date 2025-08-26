import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js"; // Update the path if necessary


// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// how much job was created by admin until now
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
  
export const recommendJobs = async (req, res) => {
    try {
        const userId = req.id; // middleware authentication
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        const { location, profile } = user;
        const { skills, jobType } = profile;

        // Building the query
        const query = {
            $and: []
        };

        // Filter by location
        if (location) {
            query.$and.push({ location: { $regex: location, $options: "i" } });
        }

        // Filter by skills
        if (skills && skills.length > 0) {
            query.$and.push({
                requirements: {
                    $in: skills.map(skill => new RegExp(skill, "i"))
                }
            });
        }

        // Filter by job type
        if (jobType) {
            query.$and.push({ jobType: { $regex: jobType, $options: "i" } });
        }

        // If no filters, match all jobs
        if (query.$and.length === 0) delete query.$and;

        const recommendedJobs = await Job.find(query).populate('company').sort({ createdAt: -1 });

        if (!recommendedJobs || recommendedJobs.length === 0) {
            return res.status(404).json({
                message: "No recommended jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs: recommendedJobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).populate("SavedJobs");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ savedJobs: user.SavedJobs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id; // Populated by isAuthenticated middleware

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if job is already saved
        if (user.SavedJobs.includes(jobId)) {
            return res.status(400).json({ message: "Job already saved." });
        }

        // Save the job
        user.SavedJobs.push(jobId);
        await user.save();

        return res.status(200).json({ message: "Job saved successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
