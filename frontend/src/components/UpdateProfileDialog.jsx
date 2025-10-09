// File: UpdateProfileDialog.jsx (Final Code with Animation Removal Attempt)

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, User, Code, FileText } from 'lucide-react'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        location: user?.location || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "", 
        jobType: user?.jobType || "", 
        file: null, 
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("location", input.location);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("jobType", input.jobType); 
        
        if (input.file) {
            formData.append("file", input.file);
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Error updating profile.');
        } finally{
            setOpen(false);
            setLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={open}>
                {/* FIX: Added 'duration-0' and 'animate-none' to try and override the default transition and entrance animation */}
                <DialogContent 
                    className="sm:max-w-[550px] bg-[#FAFAFA] max-h-[90vh] overflow-y-auto p-6 pt-6 pb-6 duration-0 animate-none" 
                    onInteractOutside={() => setOpen(false)}
                >
                    
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-800">Update Your Profile</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitHandler} className="space-y-6">
                        
                        {/* 1. Personal Information Section */}
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-[#6A38C2] mb-3 border-b pb-2">
                                <User className="w-5 h-5"/> Personal Details
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className='space-y-1'>
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input id="phoneNumber" name="phoneNumber" type="text" value={input.phoneNumber} onChange={changeEventHandler} />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" type="text" value={input.location} onChange={changeEventHandler} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Career & Bio Section */}
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-[#6A38C2] mb-3 border-b pb-2">
                                <Code className="w-5 h-5"/> Skills & Preferences
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className='space-y-1 sm:col-span-2'>
                                    <Label htmlFor="bio">Bio / Summary</Label>
                                    <Input id="bio" name="bio" type="text" value={input.bio} onChange={changeEventHandler} placeholder="A short description about yourself" />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="skills">Skills (e.g., React, Node, SQL)</Label>
                                    <Input id="skills" name="skills" type="text" value={input.skills} onChange={changeEventHandler} placeholder="Separate skills with a comma (e.g., HTML, CSS, JavaScript)" />
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="jobType">Preferred Job Type</Label>
                                    <Input id="jobType" name="jobType" type="text" value={input.jobType} onChange={changeEventHandler} placeholder="e.g., Full-Time, Remote, Internship" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Files Upload Section */}
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="flex items-center gap-2 font-semibold text-lg text-[#6A38C2] mb-3 border-b pb-2">
                                <FileText className="w-5 h-5"/> Documents & Photos
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className='space-y-1'>
                                    <Label htmlFor="file_photo">Profile Photo</Label>
                                    <Input id="file_photo" name="file" type="file" accept="image/*" onChange={fileChangeHandler} />
                                    <p className="text-xs text-gray-500">Upload a new photo (optional).</p>
                                </div>
                                <div className='space-y-1'>
                                    <Label htmlFor="file_resume">Resume (PDF)</Label>
                                    <Input id="file_resume" name="file" type="file" accept="application/pdf" onChange={fileChangeHandler} />
                                    <p className="text-xs text-gray-500">Upload new resume (optional).</p>
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter className="pt-4">
                            {
                                loading ? (
                                    <Button className="w-full"> 
                                        <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Updating... 
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5f32ad]">Save All Changes</Button>
                                )
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog;