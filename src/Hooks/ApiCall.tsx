import { useEffect, useState } from "react";

export default (instance: any, options: any) => {
  const [data, setRes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const makeApiCall = async () => {
      try {
        const { data } = await instance(options);
        setRes(data);
      } catch (error) {
        setRes(null);
      }
      setLoading(false);
    }

    makeApiCall();
  }, []);

  return { data, loading };
}