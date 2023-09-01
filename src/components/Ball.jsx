import { useRef, useState, useEffect } from "react"
import { Vector3 } from "three"
import {
    RigidBody,
} from "@react-three/rapier"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import { useGame } from "../hooks/useGame"

import { useControls } from "leva"

export default function Ball({ setOrbitTarget }) {

    const [ 
        cameraMode, 
        setCameraMode, 
        cameraPosition,
        setCameraPosition,
        isHidden,
        setIsHidden,
        addStroke 
    ] = useGame(state => [ 
        state.cameraMode, 
        state.setCameraMode, 
        state.cameraPosition,
        state.setCameraPosition,
        state.isHidden,
        state.setIsHidden,
        state.addStroke 
    ])

    const ballRef = useRef()
    const planeRef = useRef()
    const arrowRef = useRef()

    const [isDragging, setIsDragging] = useState(false)
    const [forceVector, setForceVector] = useState(null)
    //const [cameraOffset, setCameraOffset] = useState(new Vector3(0, 2, 5))
    const [freeCameraSet, setFreeCameraSet] = useState(false)

    const [ hitSound ] = useState(() => new Audio("./audio/ball_hitPutter.mp3"))
    const [ hitWallSound ] = useState(() => new Audio("./audio/ball_hitWall.mp3"))

    const {
        restitution,
        friction,
        linearDamping,
        angularDamping,
        mass,
        forceMultiplier,
    } = useControls("Ball Physics", {
        restitution: { value: 0.2, min: 0, max: 1, step: 0.1 },
        friction: { value: 1, min: 0, max: 1, step: 0.1 },
        linearDamping: { value: 0.2, min: 0, max: 1, step: 0.1 },
        angularDamping: { value: 0.2, min: 0, max: 1, step: 0.1 },
        mass: { value: 1, min: 0, max: 10, step: 0.1 },
        forceMultiplier: { value: 0.0005, min: 0, max: 2, step: 0.0001 },
    })

    const arrowGltf = useGLTF("./glb/Arrow.glb")
    const ballGltf = useGLTF("./glb/Ball.glb")

    const resetPosition = () => {
        console.log("Reset Ball Position")
        setCameraMode("follow")
        setCameraPosition(new Vector3(0.25, 0.25, 0))
        setCameraMode("free")
        setFreeCameraSet(true)
        ballRef.current.setTranslation({x:0, y:0.01, z:0})
        ballRef.current.setLinvel({x:0, y:0, z:0})
        ballRef.current.setAngvel({x:0, y:0, z:0})
    }

    useEffect(() => {
        if (isHidden) {
            resetPosition()
        }
    }, [isHidden])


    const handlePointerDown = (event) => {
        // When user clicks on sphere, start tracking pointer movement
        const vel = ballRef.current.linvel()
        const velVector = new Vector3(vel.x, vel.y, vel.z)
        if (cameraMode !== "free" && ballRef.current && velVector.length() < 0.01) {
            setIsDragging(true)
        }
    }

    const handlePointerMove = (event) => {
        // Track pointer movement here if user has clicked on sphere and hasn't released pointer and update force vector
    
        if (cameraMode !== "free" && isDragging && ballRef.current) {
            const ballPosition = ballRef.current.translation()
            const ballPositionVector = new Vector3(ballPosition.x, ballPosition.y, ballPosition.z)
            const pointerPosition = event.point

            //const forceDirection = ballPositionVector.clone().sub(pointerPosition)
            const forceDirection = pointerPosition.sub(ballPositionVector.clone())

            forceDirection.y = 0
            
            const maxForce = 50
            if (forceDirection.length() > maxForce) {
                forceDirection.normalize().multiplyScalar(maxForce)
            }

            forceDirection.y = 0

            setForceVector(forceDirection)
        }
    }
    
    useEffect(() => {
        resetPosition()
    }, [])


    useEffect(() => {
        const handlePointerUp = (event) => {    
            // Stop tracking pointer movement and apply force to sphere
            setIsDragging(false)
            
            if (cameraMode === "follow" && ballRef.current && forceVector) {
                const force = forceVector.clone().multiplyScalar(forceMultiplier)

                ballRef.current.applyImpulse(force, true)

                hitSound.currentTime = 0
                hitSound.volume = forceVector.length()
                hitSound.play()

                addStroke()
            }

            setForceVector(null)
        }

        const canvas = document.querySelector("canvas")

        if (canvas) {
            canvas.addEventListener("pointerup", handlePointerUp)

            return () => {
                canvas.removeEventListener("pointerup", handlePointerUp)
            }
        }
    }, [forceVector])

    const updateArrow = () => {
        if (ballRef.current && forceVector && arrowRef.current && isDragging) {
            const arrowDirection = forceVector.clone().normalize().negate()
            arrowGltf.scene.lookAt(arrowGltf.scene.position.clone().add(arrowDirection))

            const arrowScale = forceVector.length() * 100

            arrowRef.current.scale.set(1, 1, arrowScale)
        } else {
            arrowRef.current.scale.set(1, 1, 1)
        }
    }

    useFrame(({camera}) => {
        // Keep plane position in sync with ball position
    
        if (ballRef.current) {
            const ballPosition = ballRef.current.translation()
            const ballPositionVector = new Vector3(ballPosition.x, ballPosition.y, ballPosition.z)
            
            if (planeRef.current.position) {
                planeRef.current.position.set(ballPosition.x, ballPosition.y + 0.01, ballPosition.z)
                arrowRef.current.position.set(ballPosition.x, ballPosition.y, ballPosition.z)
            }

            updateArrow()

            if (cameraMode === "follow") {
                const cameraLookAt = ballPositionVector.clone()
                camera.lookAt(cameraLookAt)

                // add cameraOffset to ball position to get new camera position
                //const cameraPosition = ballPositionVector.clone().add(cameraOffset)
                //camera.position.lerp(cameraPosition, 0.1)

                camera.position.lerp(cameraPosition, 0.1)

                console.log("Camera Position", cameraPosition)

                setFreeCameraSet(false)
            } else {
                //setCameraOffset(camera.position.clone().sub(ballPositionVector))

                if ( !freeCameraSet ) {
                    setOrbitTarget(ballPositionVector)
                }

                setFreeCameraSet(true)

                setCameraPosition(camera.position)
                console.log("Camera Position", cameraPosition)
            }

            if ( ballRef.current.translation().y < -4 ) {
                resetPosition()
                camera.position.set(0.25, 0.25, 0)
                camera.lookAt(0, 0, 0)           
                //camera={{ position: [0.25, 0.25, 0] }}
                    
            }

        }
    })

    const playBounceSound = (event) => {
        // Detect what was hit and play sound if it was a wall
        const collidedBody = event.colliderObject
        
        if (collidedBody.name === "wall") {
            const vel = ballRef.current.linvel()
            const velVector = new Vector3(vel.x, vel.y, vel.z)

            hitWallSound.currentTime = 0
            hitWallSound.volume = Math.min(velVector.length(), 1.0)
            hitWallSound.play()
        }
    }

    return (
        <>

            <RigidBody
                ref={ballRef}
                colliders="ball"
                name="player"
                ccd={true}
                restitution={restitution} // Bounciness 0 = no bounce, 1 = full bounce
                friction={friction}
                linearDamping={linearDamping}
                angularDamping={angularDamping}
                mass={mass}
                position={[0, 0.01, 0]}
                onCollisionEnter={playBounceSound}
                >
                <mesh
                    geometry={ballGltf.nodes.GolfBall_LowPoly.geometry}
                    material={ballGltf.nodes.GolfBall_LowPoly.material}
                    castShadow
                    onPointerDown={cameraMode === "follow" && handlePointerDown}
                    />
            </RigidBody>

            <mesh
                ref={planeRef}
                onPointerMove={cameraMode === "follow" && handlePointerMove}
                rotation={[-Math.PI / 2, 0, 0]}
                visible={false}
            >
                <circleGeometry args={[1, 12]} />
                <meshStandardMaterial color="pink" />
            </mesh>

            <primitive 
                object={arrowGltf.scene}
                ref={arrowRef}
                visible={isDragging}
                />
        </>
    )
}
