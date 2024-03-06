import {DateTime} from 'luxon';


type Config ={
    className: string;
    time: DateTime;
}
export const Clock = (cfg:Config) => {
    return(<div className={cfg.className}>
        <h2 className="w-52">{cfg.time !== undefined ? cfg.time.toFormat('dd-MM-yyyy T'): ''}</h2>
    </div>);
}