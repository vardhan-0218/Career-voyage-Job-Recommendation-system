import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import LatestJobCards from "../LatestJobCards"
import Job from '../Job';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const SavedJob = () => {
  const [savedJobs, setSavedJobs] = useState([]);

useEffect(() => {
      const fetchSavedJobs = async () => {
          try {
              // FIX: Use axios and withCredentials instead of fetch and Authorization header
              const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
                  withCredentials: true
              });

              if (res.data.success) {
                  // FIX: Access the array via res.data.savedJobs as defined in the controller
                  setSavedJobs(res.data.savedJobs);
              } else {
                  throw new Error(res.data.message || 'Failed to fetch saved jobs.');
              }
          } catch (error) {
              console.error(error);
          }
      };

      fetchSavedJobs();
  }, []);
  
  return (
      <div>
          <Navbar />
          <div className="mx-auto my-10 max-w-7xl">
              <h1 className="my-10 text-xl font-bold">Saved Jobs ({savedJobs.length})</h1>
              <div className="grid grid-cols-3 gap-4">
                  {savedJobs.map((job) => (
                      <Job key={job._id} job={job} />
                  ))}
              </div>
          </div>
      </div>
  );
};

export default SavedJob;
