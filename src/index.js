import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from './home/Home';
import Video from './video/index';
import VideoMDN from './video/mdn.jsx';
import DataChannel from './video/dataChannel.jsx'
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/home",
        element: <Home />,
        children: [
            {
                path: "contact",
                element: <div>111</div>,
            },
            {
                path: "dashboard",
                element: <div>222</div>,
            },
        ]
    },
    {
        path: "/video", // 用了simple-peer库
        element: <Video />,
    },
    // {
    //     path: "/videoMDN", // mdn
    //     element: <VideoMDN />,
    // },
    {
        path: "/dataChannel", // mdn
        element: <DataChannel />,
    },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* <ContextProvider> */}
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
        {/* </ContextProvider> */}
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
