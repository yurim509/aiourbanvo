import React from 'react'
import CommunityListComponent from '../../../components/community/board/BoardListComponents'
import CommunityAddComponents from '../../../components/community/board/BoardAddComponents'
import { Outlet } from 'react-router-dom'
import BoardAddComponents from '../../../components/community/board/BoardAddComponents'



const BoardAddPage = () => {
    console.log('borad add')
    return (
        <div>
            <BoardAddComponents/>
            <Outlet/>
        </div>
    )
}

export default BoardAddPage