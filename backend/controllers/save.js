import { User } from "../models/user.model.js"; // Ensure correct import
import { Job } from "../models/job.model.js"; // Ensure correct import

export const saveJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.savedJobs.includes(jobId)) {
          return res.status(400).json({ message: 'Job already saved' });
      }

      user.savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
      console.error('Error saving job:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSavedJobs = async (req, res) => {
  const userId = req.user.id;

  try {
      const user = await User.findById(userId).populate('savedJobs');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user.savedJobs);
  } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};
