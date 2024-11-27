import React, { useEffect, useState } from 'react'
import GolfMyList from '../../../components/facilities/golf/GolfMyList'
import { Outlet } from 'react-router-dom'

const GolfMyListPage = () => {
  const [uno, setUno] = useState();
  const [page, setPage] = useState(1);
  const [size] = useState(10);

  useEffect(() => {
    const storedUno = localStorage.getItem('uno');
    if (storedUno) setUno(Number(storedUno));
  }, []);


  return (
    <>
      {/* <GolfMyList /> */}
      <GolfMyList uno={uno} page={page} size={size} />
      <Outlet/>
        </>
  )
}

export default GolfMyListPage