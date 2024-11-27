import AnnounceListPage from '../../pages/community/announce/AnnounceListPage';
import AnnouncePage from '../../pages/community/announce/AnnouncePage';
import AnnounceAddPage from '../../pages/community/announce/AnnounceAddPage';
import AnnounceModifyPage from '../../pages/community/announce/AnnounceModifyPage';



const announceRouter = [
    {
        path: "announce",
        element: <AnnouncePage />,
        children: [
            {
                path: "list",
                element: <AnnounceListPage />
            },
            {
                path: "add",
                element: <AnnounceAddPage />
            },
            {
                path: "modify/:pno",
                element: <AnnounceModifyPage />
            },
        ]
    },
];


export default announceRouter