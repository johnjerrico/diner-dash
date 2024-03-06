import { useEffect, useRef } from 'react'; 

export const useEffectOnce = (callback:()=>void) => {
    const shouldRun = useRef(true); 
    useEffect(()=>{
        if (shouldRun.current) {
            shouldRun.current = false;
            callback();
        }
    },[callback]);
}