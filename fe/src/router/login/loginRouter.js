import { lazy, Suspense } from "react"

const loginRouter = () => {

    const Loading = <div>....</div>
    const LoginPage = lazy(() => import("../../pages/login/LoginPage"))
    const FindPw = lazy(() => import("../../pages/login/FindPwPage"))

    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><LoginPage /></Suspense>
        },
        {
            path: "findPw",
            element: <Suspense fallback={Loading}><FindPw /></Suspense>
        },
    ]
}
export default loginRouter