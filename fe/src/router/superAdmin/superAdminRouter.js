import { Children, lazy, Suspense } from "react"
import { Navigate } from "react-router-dom"

const superAdminRouter = () => {

    const Loading = <div>....</div>
    const UserManage = lazy(() => import("../../pages/superAdmin/UserManagePage"))
    const UserManageAddRole = lazy(() => import("../../components/superAdmin/UserManageAddRoleComponent"))
    const EntryTest = lazy(() => import("../../pages/superAdmin/EntryTestPage"))

    return [
        {
            path: "",
            element: <Navigate replace to="/superAdmin/userManage" />
        },
        {
            path: "userManage",
            element: <Suspense fallback={Loading}><UserManage /></Suspense>,
        },
        {
            path: "userManage/addRole/:uno",
            element: <Suspense fallback={Loading}><UserManageAddRole /></Suspense>,
        },
        {
            path: "entryTest",
            element: <Suspense fallback={Loading}><EntryTest /></Suspense>,
        },
    ]
}
export default superAdminRouter