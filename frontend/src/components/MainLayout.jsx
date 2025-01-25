import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <>
    
    <LeftSidebar/>
    <Outlet/>
    </>

  )
}

export default MainLayout