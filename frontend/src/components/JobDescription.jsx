import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [isApplied, setIsApplied] = useState(false);

    const { id: jobId } = useParams();
    const dispatch = useDispatch();

    // -----------------------------
    // Apply Job Handler
    // -----------------------------
    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply");
        }
    };

    // -----------------------------
    // Fetch Single Job
    // -----------------------------
    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch]);

    // -----------------------------
    // Update isApplied when job or user changes
    // -----------------------------
    useEffect(() => {
        if (singleJob && user) {
            setIsApplied(singleJob.applications?.some(app => app.applicant === user._id) || false);
        } else {
            setIsApplied(false);
        }
    }, [singleJob, user]);

    return (
        <div className='mx-auto my-10 max-w-7xl'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-xl font-bold'>{singleJob?.title || "Loading..."}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge variant="ghost" className='font-bold text-blue-700'>
                            {singleJob?.postion || 0} Positions
                        </Badge>
                        <Badge variant="ghost" className='text-[#F83002] font-bold'>
                            {singleJob?.jobType || "N/A"}
                        </Badge>
                        <Badge variant="ghost" className='text-[#7209b7] font-bold'>
                            {singleJob?.salary || "N/A"} LPA
                        </Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>

            <h1 className='py-4 font-medium border-b-2 border-b-gray-300'>Job Description</h1>
            <div className='my-4'>
                <h1 className='my-1 font-bold'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title || "N/A"}</span></h1>
                <h1 className='my-1 font-bold'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location || "N/A"}</span></h1>
                <h1 className='my-1 font-bold'>Requirements: <span className='pl-4 font-normal text-gray-800'>{singleJob?.requirements || "N/A"}</span></h1>
                <h1 className='my-1 font-bold'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description || "N/A"}</span></h1>
                <h1 className='my-1 font-bold'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience || 0} yrs</span></h1>
                <h1 className='my-1 font-bold'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary || "N/A"} LPA</span></h1>
                <h1 className='my-1 font-bold'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length || 0}</span></h1>
                <h1 className='my-1 font-bold'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt ? singleJob.createdAt.split("T")[0] : "N/A"}</span></h1>
            </div>
        </div>
    );
};

export default JobDescription;
