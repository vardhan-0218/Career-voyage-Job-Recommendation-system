import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff } from 'lucide-react'; 

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        location: "",
        role: "",
        file: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // FIX: State to manage the password match error message
    const [passwordMatchError, setPasswordMatchError] = useState(""); 

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        
        // Update input state
        const updatedInput = { ...input, [name]: value };
        setInput(updatedInput);

        // FIX: Check for password match immediately on change
        if (name === 'password' || name === 'confirmPassword') {
            const password = name === 'password' ? value : input.password;
            const confirmPassword = name === 'confirmPassword' ? value : input.confirmPassword;
            
            if (confirmPassword && password !== confirmPassword) {
                setPasswordMatchError("Passwords do not match.");
            } else {
                setPasswordMatchError("");
            }
        }
    }
    
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // Final validation check
        if (input.password !== input.confirmPassword) {
            setPasswordMatchError("Passwords do not match.");
            return;
        }
        if (!input.password) {
            toast.error("Password is required.");
            return;
        }
        if (!input.role) {
            toast.error("Please select a role.");
            return;
        }
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("location", input.location);
        formData.append("role", input.role);
        
        // Profile image is appended only if it exists (making it optional from frontend perspective)
        if (input.file) {
            formData.append("file", input.file);
        } 

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    
    // Helper function to render password input fields with toggle icon
    const renderPasswordInput = (name, value, placeholder, showState, toggleFunc) => (
        <div className="relative my-2">
            <Label>{name}</Label>
            <Input
                type={showState ? "text" : "password"}
                value={value}
                name={name === "Password" ? "password" : "confirmPassword"}
                onChange={changeEventHandler}
                placeholder={placeholder}
                // Setting input as required field
                required
                className="pr-10" 
            />
            <span 
                className="absolute right-3 top-1/2 transform translate-y-0.5 cursor-pointer text-gray-500"
                onClick={toggleFunc}
            >
                {showState ? (
                    <EyeOff className="w-4 h-4" />
                ) : (
                    <Eye className="w-4 h-4" />
                )}
            </span>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center mx-auto max-w-7xl'>
                <form onSubmit={submitHandler} className='w-1/2 p-4 my-10 border border-gray-200 rounded-md'>
                    <h1 className='mb-5 text-xl font-bold'>Sign Up</h1>
                    
                    {/* Full Name */}
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter the Username"
                            required
                        />
                    </div>
                    
                    {/* Email */}
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter the email here"
                            required
                        />
                    </div>
                    
                    {/* Phone Number */}
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Enter contact number here"
                            required
                        />
                    </div>
                    
                    {/* Password Input (with Toggle) - Required field set inside renderPasswordInput */}
                    {renderPasswordInput("Password", input.password, "Enter password here", showPassword, () => setShowPassword(prev => !prev))}
                    
                    {/* Confirm Password Input (with Toggle) - Required field set inside renderPasswordInput */}
                    {renderPasswordInput("Confirm Password", input.confirmPassword, "Confirm password", showConfirmPassword, () => setShowConfirmPassword(prev => !prev))}
                    
                    {/* FIX: Password Match Error Message */}
                    {passwordMatchError && (
                        <p className="mt-0 text-sm text-red-500">{passwordMatchError}</p>
                    )}
                    
                    {/* Location */}
                    <div className='my-2'>
                    <Label>Location</Label>
                    <Input
                            type="text"
                            value={input.location}
                            name="location"
                            onChange={changeEventHandler}
                            placeholder="Enter your location here"
                            required
                        />
                    </div>
                    
                    {/* Role Selection & Profile Image */}
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Candidate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            {/* FIX: Removed Label */}
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    
                    {/* Login Link */}
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup;