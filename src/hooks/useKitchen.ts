import {useRef, useEffect} from 'react';
import {atom,useSetRecoilState,useRecoilValue} from 'recoil';
import {cloneDeep} from 'lodash';
import {DateTime} from 'luxon';

type Config = {
    tick: number;
    numerator: number;
    denominator: number;
}
type Chef = {
    id:number;
    name:string; 
    capacity: number; 
}

type Food = {
    id:number;
    prepTime: number;
    prep:{
        current:DateTime;
        start:()=>void
        stop:()=>void
    }
}

type Ticket = {
    pic:Chef;
    tasks:Array<Food>;
}

type Timer = {
    latest?:DateTime;
    id:number;
}


const ticketsAtom = atom<Array<Ticket>>({
    key: 'ticketAtom',
    default:[

    ]
})

const newFood = (id:number,cfg:Config) => {
        const ref = useRef<Timer>({id:0});
        let howLongWillItRun = "00:00:00";
        const prepTime = Math.round(Math.random()*10);
        if (prepTime/10 > 0) {
            howLongWillItRun = "00:"+prepTime+":00";
        } else {
            howLongWillItRun = "00:0"+prepTime+":00";
        }
        const base = DateTime.fromSQL(howLongWillItRun);
        let current = (ref.current.latest === undefined)?base:ref.current.latest;
        useEffect(()=>{
            return()=>{
                clearTimeout(ref.current.id);
            }
        })
        return {
            id: id,
            prepTime: prepTime,
            prep: {
                current: current, 
                start:()=>{
                    ref.current.id = setInterval(()=>{
                        current  = current.minus({seconds:cfg.tick * cfg.denominator/cfg.numerator})
                        ref.current.latest = current;
                        if (current.toSeconds() < 0){
                           clearTimeout(ref.current.id); 
                        }   

                    },cfg.tick)
                },
                stop:()=>{
                    clearTimeout(ref.current.id)
                }
            }
        }
} 
export const useKitchen = (cfg:Config) => {
    const tickets = useRecoilValue(ticketsAtom);
    const setRecoilState = useSetRecoilState(ticketsAtom);
    const set = (newState:(Array<Ticket>|((prev:Array<Ticket>)=>Array<Ticket>)))=>{
        setRecoilState((prev:Array<Ticket>)=>(typeof(newState)==='function' ?newState(prev):newState));
    };
    useEffect(()=>{
        return () => {
            tickets.forEach((ticket:Ticket)=>{
                ticket.tasks.forEach((food:Food)=>{
                    food.prep.stop();
                })
            })
        }
    },[tickets])
    return {
        tickets,
        hire:()=>{
            set((prev:Array<Ticket>)=>[...prev,{
                pic: {
                    id: prev.length,
                    name: "a"+ prev.length,
                    capacity: Math.round(Math.random() * 10)
                },
                tasks: [],
            }])
        },
        fire:()=>{
            set((prev:Array<Ticket>)=>{
                return prev.filter(
                    item => item.pic.id !== prev.length-1
                )
            })
        },
        cook:(id:number)=>{
            set((prev:Array<Ticket>)=>{
                const search:Array<Ticket> = prev.filter(
                    item => item.pic.id === id
                );
                const current:Ticket = cloneDeep(search[0]);
                current.tasks = [...current.tasks,newFood(current.tasks.length,cfg)]
                return [
                    ...prev.filter(item => item.pic.id !== id),
                    current
                ]
            })
        }
    }
}