import { Autocomplete, debounce, Stack, TextField, Typography } from '@mui/material';
import {  useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosInstance from './axiosInstance';
import AddPersonDrawer from './Components/AddPersonDrawer';
import FamilyTree from './Components/FamilyTree';

export default ({ currentUser }: any) => {
  const { family } = useParams();
  const [selectedFamilyName, setSelectedFailyName] = useState(family);
  const [familyNames, setFamilyNames] = useState([]);
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();
  const handleFamilyNameChange = (event: any) => {
    navigate(`/ancestree/${event.target.innerText}`);
  }
  const handleFamilyNameSearch = useCallback(debounce(
    async (event: any) => {
      if(event && event?.target?.value) {
        const { data: users } = await axiosInstance(`/people/familyNames?search=${event.target.value}`);
        
        setFamilyNames(users);
      }
    }, 500
  ), [setFamilyNames, axiosInstance])

  useEffect(() => {
    if (family && !['family', 'undefined'].includes(family)) {
      setSelectedFailyName(family);
    } else {
      navigate(`/ancestree/${currentUser.familyname}`, { replace: true });
    }
  }, [family])
  
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', margin: 5 }}>
        <Typography>{currentUser.name} {currentUser.familyname}</Typography>
      </div>
      <Stack spacing={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 15 }}>
        <AddPersonDrawer user={{ familyname: currentUser.familyname }} />
        <Autocomplete
          id="family-search"
          value={selectedFamilyName}
          options={familyNames}
          sx={{ width: 250 }}
          onChange={handleFamilyNameChange}
          onInputChange={handleFamilyNameSearch}
          renderInput={(params) => <TextField {...params} label="Family Name" />}
        />
      </Stack>
      <FamilyTree familyname={selectedFamilyName} />
    </div>
  )
}