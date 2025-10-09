import { User } from "../models/user.model.js"; // Ensure correct import
import { Job } from "../models/job.model.js"; // Ensure correct import

export const saveJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id; // NOTE: Assuming middleware sets req.user.id

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // FIX: Changed savedJobs to SavedJobs to match user.model.js
      if (user.SavedJobs.includes(jobId)) { 
          return res.status(400).json({ message: 'Job already saved' });
      }

      // FIX: Changed savedJobs to SavedJobs to match user.model.js
      user.SavedJobs.push(jobId);
      await user.save();
      // FIX: Changed savedJobs to SavedJobs to match user.model.js
      return res.status(200).json({ message: 'Job saved successfully', savedJobs: user.SavedJobs }); 
  } catch (error) {
      console.error('Error saving job:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSavedJobs = async (req, res) => {
  const userId = req.user.id; // NOTE: Assuming middleware sets req.user.id

  try {
      // FIX: Changed savedJobs to SavedJobs to match user.model.js
      const user = await User.findById(userId).populate('SavedJobs'); 
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // FIX: Changed savedJobs to SavedJobs to match user.model.js
      return res.status(200).json(user.SavedJobs);
  } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};