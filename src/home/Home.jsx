import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

function Home() {

    const [count, setCount] = useState(0);
    const [age, setAge] = useState(10);

    /**
        // 1 触发组件重新渲染
        // 2 组件函数执行
        // 3 组件渲染后呈现到屏幕上
        // 4 useeffect hook执行
        异步执行的 Hook，不会阻塞浏览器的渲染过程，因此不会影响页面的即时显示
     */
    useEffect(() => {
    }, [count]);

    /**
        // 1 触发组件重新渲染
        // 2 组件函数执行
        // 3 useLayoutEffect hook执行
        // 4 组件渲染后呈现到屏幕上
         Hook 是同步执行的，它可能会影响页面的即时显示，尤其是在执行较慢的操作时
     */
    useLayoutEffect(() => {
    }, [age]);

    const onCount = () => {
        setCount(count + 1);
    };
    const onAge = () => {
        setAge(age + 1);
    };

    return (
        <div>
            <div>count: {count}</div>
            <div>count: {age}</div>
            <button onClick={onCount}>onCount</button>
            <button onClick={onAge}>onAge</button>
            <Outlet />
        </div>
    );
}

export default Home
