import {MutableRefObject, useRef, useEffect} from 'react';
import {atom,useSetRecoilState,useRecoilValue} from 'recoil';
import {DateTime} from 'luxon';

type UniversalTime = {
    isTicking: boolean;
    current: DateTime; 
}
type Duration = {
    type: string; 
    value: number;
}

type Config = {
    numerator: number;
    denominator: number;
    tick: number;
    duration: Duration;
}

const beginOfTime:DateTime = DateTime.fromObject({
    year:2024,
    month:1,
    day:1,
    hour:0,
    minute:0,
    second:0
});

const universalTimeAtom = atom<UniversalTime>({
    key: 'universalTimeAtom',
    default: {
        isTicking: false,
        current:beginOfTime
    }
});

export const useUniversalTime = (cfg:Config ) => {
    const timer:MutableRefObject<number> = useRef<number>(0);
    const universalTime = useRecoilValue(universalTimeAtom);
    const setRecoilState = useSetRecoilState(universalTimeAtom);
    const set = (newState:(UniversalTime|((prev:UniversalTime)=>UniversalTime)))=>{
        setRecoilState((prev:UniversalTime)=>(typeof(newState)==='function' ?newState(prev):newState));
    };
    useEffect(
        ()=>{
            return ()=>{
                if (timer.current !== null && timer.current !== undefined){
                    clearInterval(timer.current);
                }
            }
        },
        [timer]
    )
    return {
        universalTime,
        start: ()=>{
            let startOfTime:any = null;
            timer.current = setInterval(()=>{
                set((prev:UniversalTime)=>{
                    if (startOfTime === null) {
                        startOfTime = DateTime.fromMillis(prev.current.toMillis());
                    }
                    let isTicking:boolean  = prev.isTicking;
                    let update:DateTime = prev.current.plus({second:cfg.tick * cfg.denominator/cfg.numerator});
                    let timediff:number = 0;
                    switch (cfg.duration.type){
                        case 'years': timediff = update.year - startOfTime.year; break;
                        case 'months': timediff = update.month - startOfTime.month; break;
                        default: timediff = update.day - startOfTime.day; break;
                    }
                    if (timediff > cfg.duration.value) {
                        isTicking = false; 
                        update = update.set({hour: 0,minute: 0,second: 0});
                        stop();
                    } 
                    return {
                        isTicking: isTicking, 
                        current: update
                    }

                })
            },cfg.tick)
        },
        stop: ()=>{
            clearInterval(timer.current);
            set((prev:UniversalTime)=>({isTicking:false,current:prev.current}))
        },
        reset: ()=>{
            clearInterval(timer.current);
            set({current: beginOfTime,isTicking:false});
        }
    }   
}