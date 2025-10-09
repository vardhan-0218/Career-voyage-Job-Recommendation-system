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
import { setLoading, setUser } from '@/redux/authSlice';
// FIX: Import Eye and EyeOff for the password toggle icon
import { Loader2, Eye, EyeOff } from 'lucide-react'; 

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: '',
        role: '',
    });
    // FIX: Add state to toggle password visibility
    const [showPassword, setShowPassword] = useState(false); 
    
    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'An unexpected error occurred');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Clear input fields when the component unmounts or form is closed
    useEffect(() => {
        return () => {
            setInput({
                email: '',
                password: '',
                role: '',
            });
        };
    }, []);
    
    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center mx-auto max-w-7xl">
                <form onSubmit={submitHandler} className="w-1/2 p-4 my-10 border border-gray-200 rounded-md">
                    <h1 className="mb-5 text-xl font-bold">Login</h1>
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email here"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Password</Label>
                        {/* FIX: Use a flex container to place the icon inside/next to the input */}
                        <div className="relative"> 
                            <Input
                                // FIX: Dynamically set input type based on showPassword state
                                type={showPassword ? 'text' : 'password'}
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                // FIX: Add right padding to prevent text overlap with the icon
                                className="pr-10" 
                            />
                            {/* FIX: Toggle icon */}
                            <span 
                                className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
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
                                <Label>Candidate</Label>
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
                                <Label>Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Login
                        </Button>
                    )}
                    <span className="text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600">
                            Signup
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Login;