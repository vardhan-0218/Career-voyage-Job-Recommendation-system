import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { Loader2 } from "lucide-react";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Job from '../Job';
import { motion } from 'framer-motion';

const JobRecommendation = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const {allJobs} = useSelector(store=>store.job);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/recommend`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setJobs(res.data.jobs);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch recommended jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10">
                <h1 className="font-bold text-xl my-10">Recommended Jobs for You {/*{user?.fullname}*/}</h1>
                {jobs.length === 0 ? (
                    <p>No jobs found based on your profile.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4'">
                        {jobs.map((job) => (
                          <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            key={job?._id}>
                            <Job job={job} />
                          </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRecommendation;
