import {useRef} from 'react';
import {atom,useSetRecoilState,useRecoilValue} from 'recoil';
import {cloneDeep} from 'lodash';
import {DateTime} from 'luxon';
import { useEffectOnce } from './useEffectOnce';

export enum Process {
    Prep=1,
    Serve,

}
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

type Timer = {
    id?:number;
    latest?:DateTime;
}
type Food = {
    id:string;
    prepTime: number;
    prep:{
        current?:DateTime;
        start:()=>void
        stop:()=>void
    }
}

type Ticket = {
    pic:Chef;
    tasks:Array<Food>;
}

const ticketsAtom = atom<Array<Ticket>>({
    key: 'ticketAtom',
    default:[]
});

let prevState:Process;
const chefNames:Array<string> = [
    "jason",
    "mark",
    "atom",
    "boy",
    "leo",
    "lucas",
    "cena",
    "john",
    "carmack"
]
export const useChef = (cfg:Config) => {    
    const tickets = useRecoilValue(ticketsAtom);
    const setRecoilState = useSetRecoilState(ticketsAtom);
    const set = (newState:(Array<Ticket>|((prev:Array<Ticket>)=>Array<Ticket>)))=>{
        setRecoilState((prev:Array<Ticket>)=>(typeof(newState)==='function' ?newState(prev):newState));
    };
    let refs = useRef<{[id:string]:Timer}>({})
    const newFood = (ticket:Ticket) => {
            let howLongWillItRun = "00:00:00";
            const prepTime = Math.round(Math.random()*10)+5;
            if (prepTime / 10 >= 1) {
                howLongWillItRun = "00:"+prepTime+":00";
            } else {
                howLongWillItRun = "00:0"+prepTime+":00";
            }
            const base = DateTime.fromSQL(howLongWillItRun);
            const taskId = ticket.pic.id + "_" + ticket.tasks.length;
            const food:Food = {
                id: taskId,
                prepTime: prepTime,
                prep: {
                    start:()=>{
                        let current = (refs.current[taskId] !== undefined && refs.current[taskId].latest !== undefined) ? refs.current[taskId].latest: base;
                        refs.current[taskId] = {
                            id:setInterval(()=>{
                                current  = current?.minus({seconds:cfg.tick * cfg.denominator/cfg.numerator})
                                set((prev:Array<Ticket>)=>{
                                    const tickets:Array<Ticket> = cloneDeep(prev);
                                    const searchTicket:Array<Ticket> = tickets.filter(
                                        item => item.pic.id === ticket.pic.id
                                    );
                                    const currentTicket:Ticket = searchTicket[0];
                                    if (current !== undefined && current.minute == 0){
                                        clearTimeout(refs.current[taskId]?.id); 
                                        currentTicket.tasks = currentTicket.tasks.filter(
                                            item => item.id !== taskId
                                        )
                                        delete refs.current[taskId];
                                    } else {
                                        const currentTask = currentTicket.tasks.find(
                                            item => item.id === taskId
                                        )
                                        if (currentTask !== undefined)
                                            currentTask.prep.current = current;
                                        if (refs.current[taskId] !== undefined)
                                            refs.current[taskId].latest = current;
                                    }
                                    return [
                                        ...tickets
                                    ] 
                                });
                            },cfg.tick)
                        } 
                    },
                    stop:()=>{
                        if (refs.current[taskId] !== undefined)
                        clearTimeout(refs.current[taskId].id)
                    }
                }
            }
            if (prevState === Process.Prep){
                food.prep.start();
            }
            return food
    }
    useEffectOnce(()=>{
        return () => {
            tickets.forEach((ticket:Ticket)=>{
                ticket.tasks.forEach((food:Food)=>{
                    food.prep.stop();
                })
            })
        }
    });
    return {
        tickets,
        hire:()=>{
            let pick:number = Math.round(Math.random()*(chefNames.length-1));
            let name:string = chefNames[pick];
            console.log(name,chefNames,chefNames.length,pick)
            set((prev:Array<Ticket>)=>[...prev,{
                pic: {
                    id: prev.length,
                    name: name,
                    capacity: Math.round(Math.random() * 10) + 5
                },
                tasks: [],
            }])
        },
        fire:()=>{
            set((prev:Array<Ticket>)=>{
                const search = prev.find(item=>item.pic.id === prev.length-1)
                search?.tasks.forEach((food:Food)=>{
                    food.prep.stop();
                });
                return prev.filter(
                    item => item.pic.id !== prev.length-1
                )
            })
        },
        order:(id:number)=>{
            set((prev:Array<Ticket>)=>{
                const tickets = cloneDeep(prev)
                const search = tickets.find(
                    item => item.pic.id === id
                );
                if (search !== undefined && search.tasks.length < search.pic.capacity){
                    search.tasks = [...search.tasks,newFood(search)]
                }
                return [
                    ...tickets
                ]
            })
        },
        process:(kind:Process)=>{
            if (prevState !== kind && prevState !== undefined){
                tickets.forEach((ticket:Ticket)=>{
                    ticket.tasks.forEach((task:Food)=>{
                        switch (kind) {
                            case Process.Prep:
                                task.prep.start(); 
                                break; 
                            default:
                                task.prep.stop();
                                break;
                        }
                    }); 
                });
            }
            prevState = kind;
        }
    }
}