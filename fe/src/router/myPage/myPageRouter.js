import { lazy, Suspense } from "react"
import { Navigate } from "react-router-dom"

const myPageRouter = () => {

    const Loading = <div>....</div>
    const MyInfo = lazy(() => import("../../pages/myPage/MyInfoPage"))
    const Mileage = lazy(() => import("../../pages/myPage/MyMileagePage"))
    const Facilities = lazy(() => import("../../pages/myPage/MyFacilitiesPage"))
    const MyMileagePurchasePage = lazy(() => import("../../components/mileage/MyMileagePurchasePage"))
    const MyMileageUsagePage = lazy(() => import("../../components/mileage/MyMileageUsagePage"))
    const GolfMyList = lazy(()=> import ("../../pages/facilities/golf/GolfMyListPage"))
    const StudyMyList = lazy(()=> import ("../../pages/facilities/study/StudyMyListPage"))
    const GymMyList = lazy(()=> import ("../../pages/facilities/gym/GymMyListPage"))
    return [
        {
            path: "",
            element: <Navigate replace to="" />
        },
        {
            path: "myInfo",
            element: <Suspense fallback={Loading}><MyInfo /></Suspense>,
        },
        {
            path: "mileage",
            element: <Suspense fallback={Loading}><Mileage /></Suspense>,
            children: [
                {
                    path: "purchase",
                    element: <Suspense fallback={Loading}><MyMileagePurchasePage /></Suspense>,
                },
                {
                    path: "usage",
                    element: <Suspense fallback={Loading}><MyMileageUsagePage /></Suspense>,
                }
            ]
        },
       
        {
            path: "facilities",
            element: <Suspense fallback={Loading}><Facilities /></Suspense>,
            children: [
                {
                    path: "golf",
                    element: <Suspense fallback={Loading} ><GolfMyList/> </Suspense>
                },
                {
                    path: "study",
                    element: <Suspense fallback={Loading} ><StudyMyList/> </Suspense>
                },
                {
                    path: "gym",
                    element: <Suspense fallback={Loading} ><GymMyList/> </Suspense>
                },
            ]
        },
    ]
}
export default myPageRouter