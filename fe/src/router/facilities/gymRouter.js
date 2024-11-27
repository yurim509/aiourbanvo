import GymProgramAdd from '../../components/facilities/gym/GymProgramAdd';
import GymModify from '../../components/facilities/gym/GymModify';
import GymPage from '../../pages/facilities/gym/GymPage';
import { Suspense, lazy } from 'react';
import MembershipPurchasePage from '../../pages/facilities/gym/membership/MembershipPurchasePage';
import AdminCreateMembershipPage from '../../pages/facilities/gym/membership/AdminCreateMembershipPage';

const Loading = <div>....</div>
const GymList = lazy(() => import("../../pages/facilities/gym/GymListPage"))
const GymProgramDetail = lazy(() => import("../../pages/facilities/gym/GymProgramDetailPage"))



const gymRouter = [
    {
        path: "gym",
        element: <GymPage />,
        children: [
            {
                path: "list",
                element: <Suspense fallback={Loading}><GymList /></Suspense>
            },
            {
                path: "add",
                element: <GymProgramAdd />
            },
            {
                path: "detail/:programId",
                element: <Suspense fallback={Loading}><GymProgramDetail /></Suspense>
            },
            {
                path: "detail/modify/:programId",
                element: <Suspense fallback={Loading}><GymModify /></Suspense>
            },
            {
                path: "membership",
                element: <MembershipPurchasePage/>
            },
            // {
            //     path: "membership/holding",
            //     element: <GymMembershipStat/>
            // },
            {
                path: "membership/create",
                element: <AdminCreateMembershipPage/>
            }
            // {
            //     path: "signup",
            //     element: <GymSignUpPage />,
            //     children: [
            //         {
            //             path: "day-pass",
            //             element: <DayPassPurchasePage />
            //         },
            //         {
            //             path: "membership",
            //             element: <MembershipPurchasePage />
            //         },
            //         {
            //             path: "create",
            //             element: <AdminCreateMembershipPage />
            //         },
            //     ]
            // },
            // {
            //     path: "membership/state",
            //     element: <GymMembershipState />
            // },
        ]
    },
];


export default gymRouter