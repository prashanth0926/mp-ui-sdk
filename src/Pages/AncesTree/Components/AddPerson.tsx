import { Button, FormGroup, TextField, MenuItem, Stack, Autocomplete, debounce } from "@mui/material"
import { useCallback, useState } from "react"
import useAxiosInstance from "../axiosInstance";

export default ({ user, callback }: any) => {
  const axiosInstance = useAxiosInstance();
  const [usrs, setUsrs] = useState([]);
  const [usr, setUsr] = useState({
    name: '',
    familyname: '',
    gender: '',
    dob: '',
    ...user,
  });
  const handleChange = ({ target: { name, value } }: any) => {
    setUsr((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  };
  const handleSubmit = () => {
    callback(usr);
  }
  const isSubmitDisabled = () => {
    const { name, familyname, dob, gender } = (usr || {});
    return Object.values({ name, familyname, dob, gender }).some((v: any) => !v);
  }

  const handlePersonNameChange = (eve: any) => {
    const selUsr = usrs.find((u: any) => `${u.name} ${u.familyname}` === eve.target.innerText)
    setUsr(selUsr);
  }

  const handlePersonNameSearch = useCallback(debounce(
    async (event: any) => {
      if (event && event?.target?.value) {
        const { data } = await axiosInstance(`/people?search=${event.target.value}`);
      
        setUsrs(data);
        setUsr((prev: any) => ({
          ...prev,
          name: event.target.value,
        }))
      }
    }, 500
  ), [setUsrs, axiosInstance])
  
  return (
    <FormGroup style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stack spacing={3} style={{ minWidth: '25em' }} >
        <Autocomplete
          freeSolo
          value={(usr || {})['name']}
          options={usrs.map((u: any) => `${u.name} ${u.familyname}`)}
          onChange={handlePersonNameChange}
          onInputChange={handlePersonNameSearch}
          renderInput={(params) => <TextField required {...params} label="Name" />}
        />
        {/* <TextField required label="Name" variant="outlined" name="name" onChange={handleChange} value={usr['name']} /> */}

        <TextField required label="Family Name" variant="outlined" name="familyname" onChange={handleChange} value={(usr || {})['familyname']} />

        <TextField label="Maternal Family Name" variant="outlined" name="maternalfamilyname" onChange={handleChange} value={(usr || {})['maternalfamilyname']} />

        <TextField
          required
          label="Gender"
          select
          value={(usr || {})['gender']}
          name="gender"
          onChange={handleChange}
        >
          <MenuItem value="male">MALE</MenuItem>
          <MenuItem value="female">FEMALE</MenuItem>
        </TextField>
        
        <TextField
          required
          id="dob"
          label="Date of Birth"
          type="date"
          value={(usr || {})['dob']}
          name="dob"
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button disabled={isSubmitDisabled()} style={{ marginTop: 25 }} variant="outlined" onClick={handleSubmit}>Submit</Button>
      </Stack>
    </FormGroup>
  )
}