import React, { useEffect, useState } from 'react'
import GymMyList from '../../../components/facilities/gym/GymMyList'
import { Outlet } from 'react-router-dom'

const GymMyListPage = () => {
    const [uno, setUno] = useState();
    const [page, setPage] = useState(1);
    const [size] = useState(10);
  
    useEffect(() => {
      const storedUno = localStorage.getItem('uno');
      if (storedUno) setUno(Number(storedUno));
    }, []);
  
    return (
        <>
            <GymMyList uno={uno} />
            <Outlet/>
        </>
    )
}

export default GymMyListPage