import {useKitchen} from 'hooks/useKitchen';

export const Kitchen = (cfg:{className:string}) => {
    const {tickets,fire,hire,cook} = useKitchen()
    return (<div className={[cfg.className,"flex flex-col"].join(" ")}>
        <div className="flex items-center justify-end w-full h-8 space-x-1">
            <label>Chefs</label>
            <button className="h-8 w-8 rounded-full bg-neutral-950 text-white hover:bg-neutral-600" onClick={fire}> -</button>
            <button className="h-8 w-8 rounded-full bg-neutral-950 text-white hover:bg-neutral-600" onClick={hire}>+</button>
        </div>
        <div className="flex-1">
            <div className="h-[32rem] overflow-x-hidden overflow-y-scroll">
                {
                    tickets.map((ticket,idx) => {
                        return(<div key={idx} className="flex flex-col w-full mt-2 p-1 border border-black border-solid">
                            <div className="flex-none flex">
                                <span className="flex-none w-20 border-r mr-2">{"Chef - " + ticket.pic.name } </span>
                                <span className="flex-none w-28">{"Capacity : " + ticket.pic.capacity }</span>
                            </div>
                            <div className="flex-1 flex flex-row w-full text-center space-x-1 mt-2 pt-5 pb-5">
                                {
                                    ticket.tasks.map((item,idx)=>(
                                        <div  key={idx} className="bg-neutral-950 rounded-full w-8 h-8">
                                            <span className="inline-block align-middle">{item.prepTime}</span>
                                        </div>
                                    ))
                                }
                                <button className="border-black border-solid border w-full hover:bg-neutral-100" onClick={()=>cook(ticket.pic.id)}>cook</button>
                            </div>
                        </div>);
                    })
                }
            </div>
        </div>
    </div>)
}