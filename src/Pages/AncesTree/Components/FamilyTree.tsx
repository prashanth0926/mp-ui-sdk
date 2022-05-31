import { Button, Menu, MenuItem, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { Tree, TreeNode } from 'react-organizational-chart'
import useApiCall from '../../../Hooks/ApiCall';
import useAxiosInstance from '../axiosInstance';
import AddPersonDrawer from "./AddPersonDrawer";
import FamilyNode from "./FamilyNode";

const Kids = ({ kids, fetchChildren }: any) => {

  if (!kids || !kids?.length) {
    return '';
  }

  return kids.map((kid: any, i: number) => {
    const sps = kid.spouse ? kid.spouse : (kid?.spouses || [{}])[0];
    const childs = (kid?.children && kid?.children?.length) ? kid.children : (sps?.children);

    return (
      <TreeNode key={kid.name+i} label={
        <FamilyNode person={kid} fetchChildren={fetchChildren} />
      }>
        {
          childs && childs.length ? (
            <Kids kids={childs} fetchChildren={fetchChildren} />
          ) : ''
        }
      </TreeNode>
    )
  })
}

export default ({ familyname }: any) => {
  const [fam, setFamily]: any = useState({ children: [] });
  const axiosInstance = useAxiosInstance();
  const fetchChildrenCall = useCallback(async (id: number) => {
    const { data: updatedData } = await axiosInstance(
      `/people/${id}?relations=mom,children,spouse,spouse.children,children.spouse,spouse.children.spouse,children.mom,spouse.children.mom`
    );

    if (!(updatedData?.children && updatedData?.children?.length) && !(updatedData?.spouse?.children && updatedData?.spouse?.children?.length)) {
      return;
    }

    const family = { ...fam };
    setFamily({ children: [] });

    const updData = (fam: any, updatedData: any) => {
      console.log('fff: ', fam);
      const d = (fam?.children || []).find((p: any) => p.id === updatedData.id);

      if (d) {
        fam.children = [
          ...(fam?.children || []).filter((p: any) => p.id !== updatedData.id),
          updatedData,
        ].sort((a, b) => a.name > b.name ? 1 : -1);
      } else {
        (fam?.children || []).forEach((child: any) => {
          if (child?.children && child.children.length) {
            updData(child, updatedData);
          } else {
            updData((child?.spouse || { children: [] }), updatedData);
          }
        });
      }
    }

    updData(family, updatedData);
    setFamily(family);
  }, [fam, setFamily])

  useEffect(() => {
    const setFamilyAsync = async () => {
      const { data } = await axiosInstance(`/people?familyname=${familyname}&familyHead=true`);
      setFamily({
        children: data,
      });
    }
    if (familyname) {
      setFamilyAsync();
    }
  }, [familyname])

  return (
    <div>
      {
        <div>
          <Tree label={<Typography variant="h6">{familyname}</Typography>}>
            <Kids kids={fam.children} fetchChildren={fetchChildrenCall} />
          </Tree>
        </div>
      }
    </div>
  )
}