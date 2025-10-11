import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import Job from "../Job";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "../ui/button";

const SavedJob = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch only the saved jobs for the current logged-in user
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setSavedJobs(res.data.savedJobs || []);
        } else {
          toast.error(res.data.message || "Failed to fetch saved jobs.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // ✅ Remove a saved job for the logged-in user
  const removeSavedJob = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/saved/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job removed from saved list!");
        setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } else {
        toast.error(res.data.message || "Failed to remove job.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error removing job.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mx-auto my-10 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Saved Jobs ({savedJobs.length})
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading saved jobs...</p>
        ) : savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((job) => (
              <div key={job._id} className="relative group">
                <Job job={job} />

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute transition-all opacity-0 top-3 right-3 group-hover:opacity-100"
                  onClick={() => removeSavedJob(job._id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
              alt="No saved jobs"
              className="w-40 h-40 mb-6 opacity-70"
            />
            <p className="text-lg text-gray-500">No saved jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJob;
