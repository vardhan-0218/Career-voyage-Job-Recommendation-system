import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating status");
        }
    }

    const applicationsList = applicants?.applications || [];

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicationsList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-gray-500">
                                No applicants yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        applicationsList.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname || "NA"}</TableCell>
                                <TableCell>{item?.applicant?.email || "NA"}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || "NA"}</TableCell>
                                
                                {/* Skills from applicant profile */}
                                <TableCell>
                                    {item?.applicant?.profile?.skills && item.applicant.profile.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {item.applicant.profile.skills.map((skill, idx) => (
                                                <Badge key={idx}>{skill}</Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        "No Skills Available"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {item?.applicant?.profile?.resume ? (
                                        <a
                                            className="text-blue-600 cursor-pointer"
                                            href={item.applicant.profile.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.applicant.profile.resumeOriginalName || "Resume"}
                                        </a>
                                    ) : (
                                        "NA"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item?.applicant?.createdAt ? item.applicant.createdAt.split("T")[0] : "NA"}
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, index) => (
                                                <div
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    key={index}
                                                    className="flex items-center my-2 cursor-pointer w-fit"
                                                >
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable;
