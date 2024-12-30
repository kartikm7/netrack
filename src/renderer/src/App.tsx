import { useEffect, useState } from 'react'


interface trackedData {
  time: string,
  len: number,
  src: string,
  dst: string
}

function App(): JSX.Element {
  const [state, setState] = useState<trackedData>()
  useEffect(() => {
    async function tracker(): Promise<void> {
      // TODO: Add toast to verify the process has started
      console.log(await window.api.netracker(5))
      window.api.onTrackerData(data => {
        console.log(data)
        setState(JSON.parse(data))
      })
    }
    tracker()
  }, [])

  // TODO: Figure out chart
  return (
    <div className='h-screen w-full bg-black'>
      {JSON.stringify(state)}
    </div>
  )
}

export default App
