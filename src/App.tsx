import {Control} from 'components/control';
import {Chef} from 'src/components/chef';
import {useReadUniversalTime} from 'hooks/useUniversalTime'
function App() {
  const universalTime = useReadUniversalTime()
  
  return (
    <div className="container justify-center items-center mx-auto flex flex-col">
      <Control className="container h-14"></Control>
      <div className="container mt-2 space-x-2 flex h-full pb-10">
          <div className="grow h-14"></div>
          <div className="flex-none w-1/4 h-full">
            <Chef play={universalTime.isTicking}></Chef>
          </div>
      </div>
    </div>
  );
}

export default App
