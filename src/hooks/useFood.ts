import {atom,useSetRecoilState,useRecoilValue} from 'recoil';

const foodsAtom = atom<number>({
    key: 'totalFoodAtom',
    default: 0
});

export const useFood = () => {  
    const foods = useRecoilValue(foodsAtom);
    const setFoodsState = useSetRecoilState(foodsAtom);
    const set = (newState:(number|((prev:number)=>number)))=>{
        setFoodsState((prev:number)=>(typeof(newState)==='function'?newState(prev):newState));
    }

    return {
        foods,
        serve:()=>{
            set(prev=>(prev-1 > 0 ?prev-1:0));
        },
        plate:()=>{
            set(prev=>prev+1)
        }
    }
    
}