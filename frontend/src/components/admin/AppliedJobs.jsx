import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { Briefcase, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const AppliedJobs = () => {
  const { appliedJobs, loading } = useGetAppliedJobs();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl px-6 py-10 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Your Applied Jobs
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-gray-500 animate-pulse">
              Loading applied jobs...
            </p>
          </div>
        ) : appliedJobs && appliedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {appliedJobs.map((job, index) => (
              <div
                key={index}
                className="flex flex-col justify-between h-full p-6 transition-all bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {job?.job?.title}
                    </h2>
                    <Badge className="px-2 py-1 text-xs text-indigo-700 bg-indigo-100">
                      {job?.job?.jobType || "N/A"}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      {job?.job?.company?.name || "Unknown Company"}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      {job?.job?.location || "Not specified"}
                    </span>
                    <span className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-indigo-500" />
                        Applied on{" "}
                        {job?.appliedAt || job?.createdAt
                            ? new Date(job.appliedAt || job.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : "Date not available"}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 text-gray-700">
                    <strong>Skills :</strong>{" "}
                    {job?.job?.requirements && job.job.requirements.length > 0
                        ? job.job.requirements.join(', ')
                        : "No skills listed"}
                  </div>
                </div>

                {/* View Job Button */}
                <div className="mt-5 text-right">
                  <Button
                    onClick={() =>
                      (window.location.href = `/description/${job?.job?._id}`)
                    }
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 border-indigo-500 hover:bg-indigo-600 hover:text-white"
                  >
                    View Job
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
              alt="No Jobs"
              className="w-40 h-40 mb-6 opacity-70"
            />
            <p className="text-lg text-gray-500">You haven’t applied to any jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
