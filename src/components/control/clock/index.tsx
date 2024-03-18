import {DateTime} from 'luxon';


type Config ={
    className: string;
    time: DateTime;
}
export const Clock = (props:Config) => {
    return(<div className={props.className}>
        <h2 className="w-52">{props.time !== undefined ? props.time.toFormat('dd-MM-yyyy T'): ''}</h2>
    </div>);
}