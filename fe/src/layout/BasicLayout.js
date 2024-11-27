import React from 'react'
import MenuComponent from '../components/menu/MenuComponent'
import '../css/_modules/basiclayout.css';

const BasicLayout = ({ children }) => {
    return (
        <>
            <div className='basic-layout'>
                <MenuComponent />
                <div className='content'>{children}</div>
            </div>
        </>
    )
}

export default BasicLayout