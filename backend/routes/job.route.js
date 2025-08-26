import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {getAdminJobs,getAllJobs,getJobById,postJob,recommendJobs,getSavedJobs,
    saveJob,}from '../controllers/job.controller.js';

const router = express.Router();

// Route for posting a job
router.route('/post').post(isAuthenticated, postJob);

// Route for getting all jobs
router.route('/get').get(isAuthenticated, getAllJobs);

// Route for getting all jobs created by an admin
router.route('/getadminjobs').get(isAuthenticated, getAdminJobs);

// Route for getting a specific job by ID
router.route('/get/:id').get(isAuthenticated, getJobById);

// Route for recommending jobs
router.get('/recommend', isAuthenticated, recommendJobs);

// Route for saving a job
router.post('/save', isAuthenticated, saveJob);

// Route for fetching saved jobs
router.get('/saved', isAuthenticated, getSavedJobs);

export default router;
