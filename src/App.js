import './App.css'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, Debug, RigidBody, CuboidCollider } from '@react-three/rapier'
import { useControls } from 'leva'

import { useGame } from './hooks/useGame'
import Ball from './components/Ball'

function App() {

  const [ cameraMode, setCameraMode, toggleCameraMode ] = useGame((state) => [ state.cameraMode, state.setCameraMode, state.toggleCameraMode ])

  const {
    grassRestitution,
    grassFriction,
    wallRestitution,
    wallFriction,
  } = useControls("Level Physics", {
    grassRestitution: { value: 0.5, min: 0, max: 1, step: 0.1 },
    grassFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
    wallRestitution: { value: 1, min: 0, max: 1, step: 0.1 },
    wallFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
  })

  return (
    <>
      <main className="h-screen">

        <Canvas
          camera={{ position: [0, 2, 5] }}
          >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls makeDefault enabled={cameraMode === 'free'} />

          <Physics>

            <Debug />

            <Ball />



            <RigidBody
              type="fixed"
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1, 0]}
              friction={grassFriction}
              restitution={grassRestitution}
              >
              <mesh>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="green" />
              </mesh>
            </RigidBody>

            <RigidBody
              type="fixed"
              rotation={[0, 0, 0]}
              position={[50, 0, 0]}
              friction={wallFriction}
              restitution={wallRestitution}
              >
              <mesh>
                <boxGeometry args={[2, 3, 100]} />
                <meshStandardMaterial color="grey" />
              </mesh>
            </RigidBody>
            <RigidBody
              type="fixed"
              rotation={[0, 0, 0]}
              position={[-50, 0, 0]}
              friction={wallFriction}
              restitution={wallRestitution}
              >
              <mesh>
                <boxGeometry args={[2, 3, 100]} />
                <meshStandardMaterial color="grey" />
              </mesh>
            </RigidBody>

            <RigidBody
              type="fixed"
              rotation={[0, Math.PI / 2, 0]}
              position={[0, 0, 50]}
              friction={wallFriction}
              restitution={wallRestitution}
              >
              <mesh>
                <boxGeometry args={[2, 3, 100]} />
                <meshStandardMaterial color="grey" />
              </mesh>
            </RigidBody>
            <RigidBody
              type="fixed"
              rotation={[0, Math.PI / 2, 0]}
              position={[0, 0, -50]}
              friction={wallFriction}
              restitution={wallRestitution}
              >
              <mesh>
                <boxGeometry args={[2, 3, 100]} />
                <meshStandardMaterial color="grey" />
              </mesh>
            </RigidBody>


            <RigidBody
              type="fixed"
              rotation={[Math.PI / 4, 0, 0]}
              position={[0, -1, 4]}
              friction={wallFriction}
              restitution={wallRestitution}
              >
              <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            </RigidBody>

          </Physics>


        </Canvas>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="flex justify-between absolute bottom-0  p-4">
            <button
              className="bg-gray-700 hover:bg-purple-600 text-white p-2 rounded-md pointer-events-auto"
              onClick={toggleCameraMode}
              >
              {cameraMode === 'free' ? 'Play Mode' : 'Free Camera'}
            </button>

          </div>
        </div>

      </main>
    </>
  );
}

export default App;
