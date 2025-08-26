// hooks/useGetAllSavedJobs.js
import { useEffect, useState } from 'react'

const useGetAllSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  const fetchSavedJobs = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/v1/job/saved', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
          });

          if (!response.ok) {
              throw new Error('Failed to fetch saved jobs.');
          }

          const data = await response.json();
          setSavedJobs(data);
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
