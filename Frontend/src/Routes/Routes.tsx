import Main from "@/Layout/Main";
import HomePage from "@/Pages/HomePage/HomePage";
import Registration from "@/Pages/Registration/Registration";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Main/>,
        children:[
            {
                path:'',
                element:<HomePage/>
            },
            {
                path:'/registration',
                element:<Registration/>
            }

        ]

    }
])