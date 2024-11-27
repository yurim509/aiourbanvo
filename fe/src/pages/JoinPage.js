import React from 'react'
import JoinComponent from '../components/main/JoinComponent'
import BasicLayout from '../layout/BasicLayout'

const JoinPage = () => {
    return (
        <BasicLayout>
            <div className='joinBackground'>
                <JoinComponent />
            </div>
        </BasicLayout>
    )
}

export default JoinPage