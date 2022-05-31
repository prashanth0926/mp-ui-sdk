import { Button, Drawer, Menu, MenuItem, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useCallback, useState } from "react";
import useAxiosInstance from '../axiosInstance';
import AddPerson from "./AddPerson";

export default ({ person, fetchChildren }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPerson, setSelectedPerson]: any = useState({});
  const [selectedMethod, setSelectedMethod]: any = useState('');
  const axiosInstance = useAxiosInstance();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFetchChildren = useCallback((person: any) => () => {
    handleClose();

    // if (person.gender === 'female') {
    //   fetchChildren(person?.id || -1);
    // } else {
    //   fetchChildren(person?.spouse?.id || -1);
    // }

    fetchChildren(person.id);
  }, [fetchChildren, handleClose]);
  const handleDrawerOpen = useCallback((person: any, method: string) => () => {
    handleClose();
    setSelectedPerson(person);
    setSelectedMethod(method);
    setDrawerOpen(true);
  }, [handleClose, setDrawerOpen, setSelectedPerson]);

  const handleAddChild = useCallback(async (usr: any) => {
    setDrawerOpen(false);
    const id = selectedPerson.gender === 'female' ? selectedPerson.id : selectedPerson.spouse.id;
    await axiosInstance({
      method: 'POST',
      url: '/people',
      data: {
        ...usr,
        mom: {
          id,
        }
      }
    });
    fetchChildren(selectedPerson.id);
  }, [setDrawerOpen, selectedPerson, fetchChildren])

  const handleAddMom = useCallback(async (usr: any) => {
    setDrawerOpen(false);
    await axiosInstance({
      method: 'POST',
      url: '/people',
      data: {
        ...usr,
        children: [{
          id: person.id,
        }],
      }
    });
  }, [setDrawerOpen, selectedPerson])

  const handleUpdate = useCallback(async (usr: any) => {
    setDrawerOpen(false);
    await axiosInstance({
      method: 'POST',
      url: '/people',
      data: {
        id: person.id,
        ...usr,
      }
    });
  }, [setDrawerOpen, selectedPerson])

  const handleUpdateSpouse = useCallback(async (usr: any) => {
    setDrawerOpen(false);
    const spous = person?.spouse ? person.spouse : {};
    await axiosInstance({
      method: 'POST',
      url: '/people',
      data: {
        ...spous,
        ...usr,
        spouse: {
          id: person.id,
        },
        spouses: [{
          id: person.id,
        }]
      }
    });
    fetchChildren(selectedPerson.id);
  }, [setDrawerOpen, selectedPerson, fetchChildren])

  const getPersonProps = () => {
    switch (selectedMethod) {
      case 'ADD_CHILD': return {
        user: { familyname: selectedPerson.familyname },
        callback: handleAddChild,
      };
      case 'UPDATE_SPOUSE': return {
        user: selectedPerson?.spouse || {},
        callback: handleUpdateSpouse,
      };
      case 'UPDATE_DETAILS': return {
        user: selectedPerson,
        callback: handleUpdate,
      };
      case 'ADD_MOM': return {
        user: { familyname: selectedPerson.familyname, gender: 'female' },
        callback: handleAddMom,
      }
      default: return {
        user: {},
        callback: () => {},
      }
    }
  }

  return (
    <div>
      <Button onClick={handleClick} variant="outlined">{person.name} {person?.spouse?.name ? '+' : ''} {person?.spouse?.name || ''}</Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem disabled={!person?.spouse?.id} onClick={handleFetchChildren(person)}>Fetch Children</MenuItem>
        <MenuItem onClick={handleDrawerOpen(person, 'UPDATE_DETAILS')}>Update details</MenuItem>
        <MenuItem onClick={handleDrawerOpen(person, 'ADD_CHILD')}>Add Child</MenuItem>
        <MenuItem disabled={!!person?.mom?.id} onClick={handleDrawerOpen(person, 'ADD_MOM')}>Add Mom</MenuItem>
        <MenuItem onClick={handleDrawerOpen(person, 'UPDATE_SPOUSE')}>Update Spouse</MenuItem>
      </Menu>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() =>setDrawerOpen(false)}
      >
        <Box style={{ padding: 15 }}>
          <AddPerson {...getPersonProps()} />
        </Box>
      </Drawer>
    </div>
  )
}