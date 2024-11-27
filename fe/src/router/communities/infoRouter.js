import InfoMainComponents from '../../components/community/info/InfoMainComponents';
import UnifiedMapComponent from '../../components/community/info/InfoMainComponents';
import InfoPage from '../../pages/community/info/InfoPage';



const infoRouter = [
    {
        path: "info",
        element: <InfoPage />,
        children: [
            {
                path: "jobs",
                element: <InfoMainComponents />
            },
        ]
    },
];


export default infoRouter