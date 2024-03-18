import {Clock} from 'components/control/clock';
import {useState} from 'react';
import {useUniversalTime} from 'hooks/useUniversalTime';
export const Control = (props:{className:string})=>{
    const {universalTime,start,stop,reset}
     = useUniversalTime({
        numerator: 1000,
        denominator: 3600,
        tick: 1000,
        duration: {
            type: 'months',
            value:1
        }
    });
    const [play,setPlay] = useState(false);
    const [regression, setRegression] = useState(false)
    return(
        <div className={[props.className,"flex space-x-1"].join(" ")}>
             <div className="grow h-14 border-black border-solid border pl-5" >
                <h1>Calendar</h1>
                <Clock className="w-64 h-14" time={universalTime.current}></Clock>
            </div>
            <div className="w-1/4 flex space-x-1 ">
                <button className="flex-none w-14 h-14 border-black border-solid border hover:bg-neutral-100" 
                        onClick={()=>{
                            reset();
                            setPlay(false);
                        }}>Reset</button>
                <button className="flex-none w-14 h-14 border-black border-solid border hover:bg-neutral-100" 
                        onClick={()=>{ 
                            if (!play){
                                start()
                                setPlay(true);
                            }else {
                                stop();
                                setPlay(false);
                            }  
                        }}>{play ? "Stop": "Start"}</button>
                <button className="grow h-14 border-black border-solid border hover:bg-neutral-100" onClick={()=>{
                      if (!regression){
                        setRegression(true);
                    }else {
                        setRegression(false);
                    }  
                        }}>{regression ? "Regression Stop": "Regression Start"}</button>
            </div>
        </div>
    )
}