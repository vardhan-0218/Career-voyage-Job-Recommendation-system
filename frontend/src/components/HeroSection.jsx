import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import Image from '@/assets/careervoyage.png';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }
    const style={
        maxWidth: "150px",
        animation: "logoBounce 2s infinite",
        display: "block",
        margin: "0 auto",
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <img style={style} src={Image} alt="Website-Logo"/>
               {/* <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>*/}
                <h1 className='text-5xl font-bold'>Get your  <span className='text-[#6A38C2]'>Dream Job,</span><br/>Unlock your career potential</h1>
                <p>Explore our listings and find the perfect match for your intrest ,skills and aspirations. </p>
                <div className='flex bg-[#FFFFFF] w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection