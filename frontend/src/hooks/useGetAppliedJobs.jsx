import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const { allAppliedJobs } = useSelector((store) => store.job); // ✅ get applied jobs from redux
  const [loading, setLoading] = useState(true); // ✅ add loading state
  const [error, setError] = useState(null); // ✅ optional error tracking

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application || []));
        }
      } catch (error) {
        console.log("Error fetching applied jobs:", error);
        setError(error);
      } finally {
        setLoading(false); // ✅ always stop loading
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);

  // ✅ return what the component needs
  return { appliedJobs: allAppliedJobs || [], loading, error };
};

export default useGetAppliedJobs;
