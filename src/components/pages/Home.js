"use client";
import React from 'react'
import SideBar from '../commanComp/SideBar'
import NotFoundProject from '../commanComp/NotFoundProject'
import ProjectManage from '../commanComp/ProjectManage';

export default function Home() {
  return (<>
    {/* <NotFoundProject /> */}
    <ProjectManage />
  </>
  )
}