import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const jobText = `${job.title} ${job.description} ${job.location}`.toLowerCase();

                // Check location
                const locationMatch = searchedQuery.location
                    ? job.location.toLowerCase().includes(searchedQuery.location)
                    : true; // if location filter not applied, ignore

                // Check industry (partial word match)
                const industryMatch = searchedQuery.industry
                    ? searchedQuery.industry.split(" ").some(word => jobText.includes(word))
                    : true; // if industry filter not applied, ignore

                // BOTH filters must match
                return locationMatch && industryMatch;
            });

            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='mx-auto mt-5 max-w-7xl'>
                <div className='flex gap-5'>
                    <div className='w-1/5'>
                        <FilterCard />
                    </div>
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                        {filterJobs.length <= 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className='grid grid-cols-3 gap-4'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        key={job._id}>
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
