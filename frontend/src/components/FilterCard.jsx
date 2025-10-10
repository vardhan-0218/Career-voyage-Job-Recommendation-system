import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Button } from './ui/button';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi", "Bengaluru", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["software developer", "Frontend Developer", "Backend Developer", "Fullstack Developer"]
    },
];

const FilterCard = () => {
    const [locationFilter, setLocationFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        // Send filters as an object instead of a combined string
        dispatch(setSearchedQuery({
            location: locationFilter.toLowerCase(),
            industry: industryFilter.toLowerCase()
        }));
    }, [locationFilter, industryFilter, dispatch]);

    const clearFilters = () => {
        setLocationFilter('');
        setIndustryFilter('');
    }

    return (
        <div className='w-full p-3 bg-white rounded-md'>
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-bold'>Filter Jobs</h1>
                <Button variant="ghost" className="p-1 text-xs text-red-500 h-fit hover:text-red-700" onClick={clearFilters}>
                    Clear
                </Button>
            </div>
            <hr className='mt-3' />

            {filterData.map((data) => {
                const isLocation = data.filterType === "Location";
                const currentValue = isLocation ? locationFilter : industryFilter;
                const changeHandler = isLocation ? setLocationFilter : setIndustryFilter;

                return (
                    <div key={data.filterType} className="my-4">
                        <h1 className='text-lg font-bold'>{data.filterType}</h1>
                        <RadioGroup value={currentValue} onValueChange={changeHandler}>
                            {data.array.map((item, idx) => {
                                const itemId = `id${data.filterType}-${idx}`;
                                return (
                                    <div key={itemId} className='flex items-center my-2 space-x-2'>
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label htmlFor={itemId}>{item}</Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>
                );
            })}
        </div>
    )
}

export default FilterCard;
