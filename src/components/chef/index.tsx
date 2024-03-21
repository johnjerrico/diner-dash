import {useEffect} from 'react';
import {useChef,Process} from 'src/hooks/useChef';

export const Chef = (props:{className:string,play:boolean}) => {
    const {tickets,fire,hire,order,process} = useChef({
        numerator: 1000,
        denominator: 60,
        tick: 100,
    })
    useEffect(()=>{
        if (props.play){
            process(Process.Prep);
        }else{
            process(Process.Serve);
        }
    })
    return (<div className={[props.className,"flex flex-col"].join(" ")}>
        <div className="flex items-center justify-end w-full h-8 space-x-1">
            <label>Chefs</label>
            <button className="h-8 w-8 rounded-full bg-neutral-950 text-white hover:bg-neutral-600" onClick={fire}> -</button>
            <button className="h-8 w-8 rounded-full bg-neutral-950 text-white hover:bg-neutral-600" onClick={hire}>+</button>
        </div>
        <div className="flex-1 pb-10">
            {
                tickets.map((ticket,idx) => {
                    return(<div key={idx} className="flex flex-col w-full mt-2 p-1 border border-black border-solid">
                        <div className="flex-none flex">
                            <span className="flex-none w-20 border-r mr-2">{ticket.pic.name[0].toUpperCase() +ticket.pic.name.slice(1) } </span>
                            <span className="flex-none w-28">{"Capacity : " + ticket.pic.capacity }</span>
                        </div>
                        <div className="grow flex flex-col w-full mt-2 ">
                            <div className="min-h-10 flex flex-wrap justify-center items-center space-x-1">
                            {
                                ticket.tasks.map((item,idx)=>(
                                    <div  key={idx} className="bg-neutral-950 rounded-full w-8 h-8 text-center ">
                                        <span className="inline-block align-middle text-white">{item.prep.current === undefined ?item.prepTime:item.prep.current.minute}</span>
                                    </div>
                                ))
                            }
                            </div>
                            <button className="border-black border-solid border h-8 w-full hover:bg-neutral-100 mt-2 mb-2" onClick={()=>order(ticket.pic.id)}>cook</button>
                        </div>
                    </div>);
                })
            }
        </div>
    </div>)
}