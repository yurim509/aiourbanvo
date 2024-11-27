import { createBrowserRouter } from 'react-router-dom';
import CommunityPage from '../../pages/community/CommunityPage';
import infoRouter from './infoRouter';
import announceRouter from './announceRouter';
import marketRouter from './marketRouter';
import boardRouter from './boardRouter';


const communityRouter = [
    {
        path: "communities",
        element: <CommunityPage />,
        children: [
            ...boardRouter,
            ...marketRouter,
            ...announceRouter,
            ...infoRouter
        ]
    }
];

export default communityRouter