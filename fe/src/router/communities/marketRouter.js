

import MarketListPage from '../../pages/community/market/MarketListPage';
import MarketPage from '../../pages/community/market/MarketPage';
import MarketAddPage from '../../pages/community/market/MarketAddPage';
import MarketModifyPage from '../../pages/community/market/MarketModifyPage';
import ChatPage from '../../pages/community/chat/ChatPage';




const marketRouter = [
    {
        path: "market",
        element: <MarketPage />,
        children: [
            {
                path: "list",
                element: <MarketListPage />
            },
            {
                path: "add",
                element: <MarketAddPage />
            },
            {
                path: "modify/:mno",
                element: <MarketModifyPage />
            },
            {
                path: "chat/:mno",
                element:<ChatPage/>
            }
        ]
    },
];


export default marketRouter