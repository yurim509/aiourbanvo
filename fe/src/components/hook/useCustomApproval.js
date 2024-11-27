import React, { useState } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

const getNum = (param, defaultValue) => {
    if (!param) {
        return defaultValue
    } else {
        return parseInt(param)
    }
}
const useCustomApproval = () => {
    const navigate = useNavigate()
    const [refresh, setRefresh] = useState(false)
    const [queryParam] = useSearchParams()
    const page = getNum(queryParam.get('page'), 1)
    const size = getNum(queryParam.get('size'), 10)
    const queryDefault = createSearchParams({ page, size }).toString()

    const moveToList = (pageParam = {}) => {
        let queryStr = ""
        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString()
        } else queryStr = queryDefault
        navigate({ pathname: '../approval', search: queryStr })
        setRefresh(!refresh)
    }


    return { page, size, moveToList }
}

export default useCustomApproval