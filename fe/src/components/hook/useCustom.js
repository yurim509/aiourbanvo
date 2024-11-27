import React, { useState } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

const getNum = (param, defaultValue) => {
    if (!param) {
        return defaultValue
    } else {
        return parseInt(param)
    }
}
const useCustom = () => {
    const navigate = useNavigate()
    const [queryParam] = useSearchParams()
    const page = getNum(queryParam.get('page'), 1)
    const size = getNum(queryParam.get('size'), 10)
    const queryDefault = createSearchParams({ page, size }).toString()

    const moveToList = (pageParam = {}) => {
        // console.log("moveToList: ", pageParam)
        let queryStr = ""
        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString()
            console.log("moveToList querYsTRY : ", queryStr)
        } else queryStr = queryDefault
        navigate({ pathname: '../list', search: queryStr })
    }

    const moveToPath = (path, pageParam = {}) => {
        let queryStr = ""
        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            queryStr = createSearchParams({ page: pageNum, size: sizeNum }).toString()
        } else queryStr = queryDefault
        navigate({ pathname: path, search: queryStr })
    }




    return { page, size, moveToList, moveToPath }
}

export default useCustom