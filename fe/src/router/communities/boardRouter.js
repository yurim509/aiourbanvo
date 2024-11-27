import BoardAddPage from "../../pages/community/board/BoardAddPage";
import BoardListPage from "../../pages/community/board/BoardListPage";
import BoardModifyPage from "../../pages/community/board/BoardModifyPage";
import BoardPage from "../../pages/community/board/BoardPage";


const boardRouter = [
    {
        path: "board",
        element: <BoardPage/>,
        children: [
            {
                path: "list",
                element: <BoardListPage />
            },
            {
                path: "add",
                element:<BoardAddPage/>
            },
            {
                path: "modify/:pno",
                element:<BoardModifyPage/>
            }

        ]
    },
];


export default boardRouter;