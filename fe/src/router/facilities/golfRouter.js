import GolfPage from '../../pages/facilities/golf/GolfPage';
import GolfReservePage from '../../pages/facilities/golf/GolfReservePage';
// import GolfModifyPage from '../../pages/facilities/golf/GolfModifyPage';
import { Suspense, lazy } from 'react';

const Loading = <div>....</div>
const GolfList = lazy(() => import("../../pages/facilities/golf/GolfListPage"))
const GolfModify = lazy(() => import("../../pages/facilities/golf/GolfModifyPage"))

const golfRouter = [
    {
        path: "golf",
        element: <GolfPage />,
        children: [
            {
                path: "list",
                element: <Suspense fallback={Loading}><GolfList /></Suspense>
            },
            {
                path: "reserve",
                element: <GolfReservePage />
            },
            {
                path: "detail/:uno",
                element: <Suspense fallback={Loading}><GolfModify /></Suspense>
            },

        ]
    },
];


export default golfRouter