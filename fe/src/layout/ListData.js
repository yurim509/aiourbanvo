import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ListData = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const f = async () => {
            const res = await axios.get("http://localhost:8080/score/list")
            setData(res.data);
            console.log(res.data);
        }
        f()
    }, [])
    return (
        <div>
            {data && data.map(i => (<div>성적 : {i.grade}</div>))}
        </div>
    )
}

export default ListData