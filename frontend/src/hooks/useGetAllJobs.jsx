// File: useGetAllJobs.jsx
import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux' // <-- ADD useSelector

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    // FIX: Get searchedQuery from Redux store
    const { searchedQuery } = useSelector(store => store.job); 
    
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                // FIX: Use the variable from useSelector
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[searchedQuery]) // <-- IMPORTANT: Add searchedQuery as a dependency
}

export default useGetAllJobs