import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import LatestJobCards from "../LatestJobCards"
import Job from '../Job';

const SaveJob = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
      const fetchSavedJobs = async () => {
          try {
              const response = await fetch('http://localhost:3000/api/v1/job/saved', {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
              });

              if (!response.ok) {
                  throw new Error('Failed to fetch saved jobs.');
              }

              const data = await response.json();
              setSavedJobs(data);
          } catch (error) {
              console.error(error);
          }
      };

      fetchSavedJobs();
  }, []);

  return (
      <div>
          <Navbar />
          <div className="max-w-7xl mx-auto my-10">
              <h1 className="font-bold text-xl my-10">Saved Jobs ({savedJobs.length})</h1>
              <div className="grid grid-cols-3 gap-4">
                  {savedJobs.map((job) => (
                      <Job key={job._id} job={job} />
                  ))}
              </div>
          </div>
      </div>
  );
};

export default SaveJob;
