import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllAdminJobs } from "@/redux/jobSlice";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllAdminJobs());
  }, [dispatch]);

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const removeJob = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Job removed successfully!");
        dispatch(fetchAllAdminJobs()); // refresh the table
      } else {
        toast.error(res.data.message || "Failed to remove job.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error removing job.");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filterJobs.map((job) => (
          <TableRow key={job._id}>
            <TableCell>{job?.company?.name}</TableCell>
            <TableCell>{job?.title}</TableCell>
            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger>
                  <MoreHorizontal />
                </PopoverTrigger>
                <PopoverContent className="w-32">
                  <div
                    onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-4" />
                    <span>Edit</span>
                  </div>
                  <div
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className="flex items-center gap-2 mt-2 cursor-pointer"
                  >
                    <Eye className="w-4" />
                    <span>Applicants</span>
                  </div>
                  <div
                    onClick={() => removeJob(job._id)}
                    className="flex items-center gap-2 mt-2 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4" />
                    <span>Remove</span>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminJobsTable;
