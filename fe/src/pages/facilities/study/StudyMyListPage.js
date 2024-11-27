import React, { useEffect, useState } from 'react'
import StudyMyList from '../../../components/facilities/study/StudyMyList'
import { Outlet } from 'react-router-dom'

const StudyMyListPage = () => {
  const [uno, setUno] = useState();
  const [page, setPage] = useState(1);
  const [size] = useState(10);

  useEffect(() => {
    const storedUno = localStorage.getItem('uno');
    if (storedUno) setUno(Number(storedUno));
  }, []);

  return (
    <>
    <StudyMyList  uno={uno} page={page} size={size} />
    <Outlet/>
</>
  )
}

export default StudyMyListPage