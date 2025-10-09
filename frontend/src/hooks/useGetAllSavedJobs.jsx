// File: useGetAllSavedJobs.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant'; 

const useGetAllSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  const fetchSavedJobs = async () => {
      try {
          const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
              withCredentials: true
          });

          if (res.data.success) {
              // The savedJobs array now contains fully populated Job objects (including company)
              setSavedJobs(res.data.savedJobs); 
          } else {
              throw new Error(res.data.message || 'Failed to fetch saved jobs.');
          }
      } catch (error) {
          console.error(error);
      }
  };

  useEffect(() => {
      fetchSavedJobs();
  }, []);

  return { savedJobs, fetchSavedJobs };
};

export default useGetAllSavedJobs;