import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'; // <-- REQUIRED
import { toast } from 'sonner'; // <-- REQUIRED
import { JOB_API_END_POINT } from '@/utils/constant';

const Job = ({job}) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    const saveJobForLater = async (jobId) => {
        try {
            // FIX: Use axios and withCredentials for consistent API calls/auth
            const res = await axios.post(`${JOB_API_END_POINT}/save`, { jobId }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true // Use cookie for authentication
            });
    
            // FIX: Display a toast message based on the response success flag
            if (res.data.success) {
                toast.success(res.data.message || 'Job saved successfully!');
            } else {
                toast.error(res.data.message || 'Failed to save the job.');
            }
        } catch (error) {
            console.error(error);
            // FIX: Display error toast, handling potential error response structure
            toast.error(error.response?.data?.message || 'Error saving the job. Check if already saved.');
        }
    };    
    
    return (
        <div className='p-5 bg-white border border-gray-100 rounded-md shadow-xl'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='text-lg font-medium'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='my-2 text-lg font-bold'>{job?.title}</h1>
                <p className='text-sm text-gray-600'><b>Required :</b> {job?.requirements}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button className="bg-[#7209b7]" onClick={() => saveJobForLater(job?._id)}>Save For Later</Button>
            </div>
        </div>
    )
}

export default Job