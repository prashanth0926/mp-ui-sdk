import { Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import useApiCall from '../../Hooks/ApiCall';
import useAxiosInstance from './axiosInstance';
import AddPerson from './Components/AddPerson';
import FamilyTree from './Components/FamilyTree';
import Home from './Home';

export default () => {
  const [userExists, setUserExists] = useState(false);
  const axiosInstance = useAxiosInstance();
  const { data: currentUser, loading }: any = useApiCall(axiosInstance, {
    method: 'GET',
    url: '/people/current',
  });
  // const { data: users, loading: peopleLoading }: any =  useApiCall(axiosInstance, {
  //   method: 'GET',
  //   url: '/people',
  // });
  // const { data: roles, loading: rolesLoading }: any =  useApiCall(axiosInstance, {
  //   method: 'GET',
  //   url: '/roles',
  // });
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
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      setUserExists(true);
    }
  }, [currentUser]);

  return (
    <div>
      {
        loading ? (
          <Typography>Loading ...</Typography>
        ) : (
          userExists ? (
            <Home currentUser={currentUser} />
          ) : (
            <div>
              <Typography variant='h4' style={{ textAlign: 'center', margin: '25px 0' }}>Add Person</Typography>
              <AddPerson user={currentUser} callback={addPersonCallback} />
            </div>
          )
        )
      }
    </div>
  )
}