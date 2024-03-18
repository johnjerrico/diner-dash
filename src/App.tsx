import {Control} from 'components/control';
import {Kitchen} from 'src/components/kitchen';
import {useReadUniversalTime} from 'hooks/useUniversalTime'
function App() {
  const universalTime = useReadUniversalTime()
  return (
    <div className="container justify-center items-center mx-auto h-screen flex flex-col">
      <Control className="container h-14"></Control>
      <div className="container mt-2 space-x-2 flex h-full">
          <div className="grow h-14"></div>
          <div className="flex-none w-1/4 h-full">
            <Kitchen className="mt-2" play={universalTime.isTicking}></Kitchen>
          </div>
      </div>
    </div>
  );
}

export default App
