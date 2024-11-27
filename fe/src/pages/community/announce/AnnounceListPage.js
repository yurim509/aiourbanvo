import React from 'react'
import AnnounceListComponent from '../../../components/community/announce/AnnounceListComponent'
import { Outlet } from 'react-router-dom'




const AnnounceListPage = () => {
    console.log('announce list ')
    return (
        <div>
            <AnnounceListComponent/>
           
        </div>
    )
}

export default AnnounceListPage