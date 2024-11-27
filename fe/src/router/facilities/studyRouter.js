import StudyPage from '../../pages/facilities/study/StudyPage';
import StudyReservePage from '../../pages/facilities/study/StudyReservePage';
// import StudyModifyPage from '../../pages/facilities/study/StudyModifyPage';
import { Suspense, lazy } from 'react';

const Loading = <div>....</div>
const StudyList = lazy(() => import("../../pages/facilities/study/StudyListPage"))
const StudyModify = lazy(() => import("../../pages/facilities/study/StudyModifyPage"))

const studyRouter = [
    {
        path: "study",
        element: <StudyPage />,
        children: [
            {
                path: "list",
                element: <Suspense fallback={Loading}><StudyList /></Suspense>
            },
            {
                path: "reserve",
                element: <StudyReservePage />
            },
            {
                path: "detail/:uno",
                element: <Suspense fallback={Loading}><StudyModify /></Suspense>
            },

        ]
    },
];


export default studyRouter