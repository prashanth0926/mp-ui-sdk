import { Button, Drawer } from "@mui/material"
import { Box } from "@mui/system";
import { useCallback, useState } from "react"
import AddPerson from "./AddPerson";
import useAxiosInstance from '../axiosInstance';

export default ({ user }: any) => {
  const [open, setOpen] = useState(false);
  const axiosInstance = useAxiosInstance();
  const handleAddPerson = useCallback(async (person: any) => {
    await axiosInstance({
      method: 'POST',
      url: '/people',
      data: {
        ...(user || {}),
        ...person,
      }
    });
    setOpen(false);
  }, [setOpen]);

  return (
    <div style={{ margin: 15 }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>Add Person</Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box style={{ padding: 15 }}>
          <AddPerson callback={handleAddPerson} user={user || {}} />
        </Box>
      </Drawer>
    </div>
  )
}