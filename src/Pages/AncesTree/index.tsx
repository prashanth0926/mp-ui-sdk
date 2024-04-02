import { Typography } from '@mui/material';
import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import useApiCall from '../../Hooks/ApiCall';
import useAxiosInstance from './axiosInstance';
import AddPerson from './Components/AddPerson';
import Home from './Home';
import RefreshLoadingIcon from './Components/RefreshLoadingIcon';

declare const window: {
  _env_: Record<string, string>,
};

const Ancestree = () => {
  const [userExists, setUserExists] = useState(false);
  const axiosInstance = useAxiosInstance();
  const { data: currentUser, loading }: any = useApiCall(axiosInstance, {
    method: 'GET',
    url: '/people/current',
  });
  const addPersonCallback = useCallback(async (person: any) => {
    try {
      const { data: usr }: any = await axiosInstance({
        method: 'POST',
        url: '/people',
        data: person,
      });

      if (usr?.id) {
        setUserExists(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [axiosInstance]);

  useEffect(() => {
    const updateData = async (currentTime: number) => {
      const { data: loadedData } = await axios({
        method: 'GET',
        url: window._env_.LOAD_DATA_URL,
      });

      console.log('loadD: ', loadedData);
      
      const { data: eventData } = await axios({
        method: 'POST',
        baseURL: window._env_.API_URL,
        url: '/event',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`},
        data: {
          type: 'load-app',
          message: `${currentUser.name} ${currentUser.familyname} has accessed Ancestree`,
          details: {
            ips: [loadedData.ip],
          }
        },
      });

      console.log('evntD: ', eventData);
      localStorage.setItem('load-data', currentTime.toString()); 
    };
    const run = async () => {
      const currentTime = new Date().getTime();
      const loadDataTime = parseInt(localStorage.getItem('load-data') || '0');
      if (currentTime > loadDataTime + (60 * 60 * 1000)) {
        await updateData(currentTime);
      }
    };

    if (currentUser?.id) {
      setUserExists(true);
      run();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ marginTop: '10%' }}>
        <RefreshLoadingIcon size="3em" isLoading={loading} />
      </div>
    )
  }

  return (
    <div>
      {
        userExists ? (
          <Home currentUser={currentUser} />
        ) : (
          <div>
            <Typography variant='h4' style={{ textAlign: 'center', margin: '25px 0' }}>Add Person</Typography>
            <AddPerson user={currentUser} callback={addPersonCallback} />
          </div>
        )
      }
    </div>
  )
}

export default Ancestree;