import {  Suspense } from "react"
import { Navigate } from "react-router-dom"
import MileagePage from "../../pages/mileage/MileagePage"
import ManualPayment from "../../components/mileage/ManualPayment"
import AutomaticPayment from "../../components/mileage/AutomaticPayment"

const mileageRouter = () => {
    const Loading = <div>....</div>;

    return [
        {
            path: "mileage/*", // 상위 경로에 `*` 추가
            element: <Suspense fallback={Loading}><MileagePage /></Suspense>,
            children: [
                {
                    path: "manual",
                    element: <ManualPayment />,
                },
                {
                    path: "auto",
                    element: <AutomaticPayment />,
                },
            ],
        },
        {
            path: "*",
            element: <Navigate replace to="/mileage" />, // 리다이렉트 경로 수정
        },
    ];
};

export default mileageRouter;
