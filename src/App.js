import './App.css'

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import { Physics, Debug } from '@react-three/rapier'
//import { useControls } from 'leva'

import { useGame } from './hooks/useGame'
import Ball from './components/Ball'
import Course from './components/Courses'
import Loading from './components/Loading'

function App() {

  const [ 
    cameraMode, 
    setCameraMode, 
    toggleCameraMode, 
    strokeCount,
    currentLevel,
    gameState
  ] = useGame((state) => [ 
    state.cameraMode,
    state.setCameraMode, 
    state.toggleCameraMode, 
    state.strokeCount,
    state.currentLevel,
    state.gameState
  ])

  const [ orbitTarget, setOrbitTarget ] = useState([0, 0, 0])
  const [ modeSwitched, setModeSwitched ] = useState(false)
  const [ cameraFollowPosition, setCameraFollowPosition ] = useState([0.25, 0.25, 0])

  return (
    <>
      <main className="h-screen">

        <Suspense fallback={<Loading />}>

          <Canvas
            camera={{ position: [0.25, 0.25, 0] }}
            shadows={true}
            >
            <Sky sunPosition={[2, 2, 2]} />
            <Environment 
              files={"green_sanctuary_1k.hdr"}
              />
            <directionalLight 
              position={[2, 2, 2]} 
              intensity={1} 
              castShadow 
              />

            <OrbitControls 
              makeDefault 
              enabled={cameraMode === 'free'} 
              target={orbitTarget}
              />

            <Physics
              timeSet="vary"
              >

              <Course 
                number={currentLevel} 
                setOrbitTarget={setOrbitTarget} 
                cameraFollowPosition={cameraFollowPosition} 
                setCameraFollowPosition={setCameraFollowPosition} />

            </Physics>

          </Canvas>

          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="flex justify-between absolute bottom-0 w-full p-4 items-center">
              <button
                className="bg-gray-700 hover:bg-purple-600 text-white p-2 rounded-md pointer-events-auto"
                onClick={() => {
                  toggleCameraMode()
                  setModeSwitched(true)
                }}
                >
                {cameraMode === 'free' ? 'Play Mode' : 'Free Camera'}
              </button>
              { !modeSwitched && <div className="bg-blue-400 text-white p-2 rounded-md">
                <p><strong>Tip:</strong> Click and drag on the ball in play mode to start!</p>
              </div> }
              <div className="bg-white p-2 rounded-md">
                <p>Stroke Count: { gameState[currentLevel-1].strokes }</p>
              </div>
            </div>


            <div className="absolute top-1/2 -translate-y-1/2 left-0 bg-black bg-opacity-50 py-2 rounded-r">
                <ul className="">
                  { gameState.map((level, index) => {
                      return (
                        <li key={index} className={`${ currentLevel === index + 1 ? 'text-black bg-white text-xl -mr-2 rounded-r' : 'text-white text-md'} p-2`}>
                          <span className="relative -top-1">{ level.strokes }</span> / <span className="relative top-1">{ level.par }</span>
                        </li>
                      )
                  }) }
                </ul>
            </div>
          </div>

        </Suspense>

      </main>
    </>
  );
}

export default App;
