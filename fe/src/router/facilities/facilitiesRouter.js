import { createBrowserRouter } from 'react-router-dom';
import golfRouter from './golfRouter'
import gymRouter from './gymRouter'
import studyRouter from './studyRouter'
import FacilitiesPage from '../../pages/facilities/FacilitiesPage';

const facilitiesRouter = [
    {
        path: "facilities",
        element: <FacilitiesPage/>,
        children: [
            ...golfRouter,
            ...gymRouter,
            ...studyRouter
        ]
    }
];

export default facilitiesRouter