import { lazy, Suspense } from "react"
import { Navigate } from "react-router-dom"

const userRouter = () => {

    const Loading = <div>....</div>
    const UserList = lazy(() => import("../../pages/user/ListPage"))
    const UserAdd = lazy(() => import("../../pages/user/AddPage"))
    const UserModify = lazy(() => import("../../pages/user/ModifyPage"))
    const UserApproval = lazy(() => import("../../pages/user/ApprovalPage"))

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><UserList /></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="/user/list" />
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><UserAdd /></Suspense>
        },
        {
            path: "list/modify/:uno",
            element: <Suspense fallback={Loading}><UserModify /></Suspense>
        },
        {
            path: "approval",
            element: <Suspense fallback={Loading}><UserApproval /></Suspense>
        },
    ]
}
export default userRouter