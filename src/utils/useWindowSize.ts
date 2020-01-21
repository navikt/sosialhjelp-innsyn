import {useEffect, useState} from "react";

export const isBrowser = typeof window !== `undefined` ? true : false;

const getWindowSize = () => {
    return isBrowser
        ? {
            height: window.innerHeight,
            width: window.innerWidth
        }
        : {width: 1000, height: 600};
};

export interface WindowSize {
    width: number;
    height: number;
}

const useWindowSize = (callback?: (size: WindowSize) => void) => {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    const onResize = (event: any) => {
        if (event.target) {
            const {innerWidth, innerHeight} = event.target as Window;
            const size = {height: innerHeight, width: innerWidth};
            setWindowSize(size);
            if (callback) {
                callback(size);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onResize, {passive: true});
        return () => {
            window.removeEventListener('resize', onResize);
        };
    });

    return windowSize;
};

export default useWindowSize;
