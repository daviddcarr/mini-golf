import './App.css'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import { Physics, Debug, RigidBody, CuboidCollider } from '@react-three/rapier'
import { useControls } from 'leva'

import { useGame } from './hooks/useGame'
import Ball from './components/Ball'
import TestCourse from './components/TestCourse'
import CourseSection from './components/CourseSection'

function App() {

  const [ cameraMode, setCameraMode, toggleCameraMode, strokeCount ] = useGame((state) => [ state.cameraMode, state.setCameraMode, state.toggleCameraMode, state.strokeCount ])

  const [ orbitTarget, setOrbitTarget ] = useState([0, 0, 0])

  return (
    <>
      <main className="h-screen">

        <Canvas
          camera={{ position: [0.25, 0.25, 0] }}
          shadows={true}
          >
          <Sky sunPosition={[2, 2, 2]} />
          <Environment preset="sunset" />
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

            {/* <Debug /> */}

            <Ball setOrbitTarget={setOrbitTarget} />

            <CourseSection type="start" position={[0, 0, 0]} />
            <CourseSection type="straight" position={[-2, 0, 0]} />
            <CourseSection type="corner" position={[-4, 0, 0]} />
            <CourseSection type="corner" position={[-4, 0, -2]} rotation={[0, Math.PI, 0]} />
            <CourseSection type="end" position={[-6, 0, -2]} />


          </Physics>

        </Canvas>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="flex justify-between absolute bottom-0 w-full p-4 items-center">
            <button
              className="bg-gray-700 hover:bg-purple-600 text-white p-2 rounded-md pointer-events-auto"
              onClick={toggleCameraMode}
              >
              {cameraMode === 'free' ? 'Play Mode' : 'Free Camera'}
            </button>
            <div className="bg-white p-2 rounded-md">
              <p>Stroke Count: { strokeCount }</p>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

export default App;
