import { useRef, useState, useMemo, useEffect } from "react"
import { Vector3 } from "three"
import {
    RigidBody,
} from "@react-three/rapier"
import { useGLTF, useCamera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import { useGame } from "../hooks/useGame"

import { useControls } from "leva"

export default function Ball() {

    const [ cameraMode ] = useGame(state => [ state.cameraMode ])
    // const { camera } = useCamera()

    const ballRef = useRef()
    const planeRef = useRef()
    const arrowRef = useRef()

    const [isDragging, setIsDragging] = useState(false)
    const [forceVector, setForceVector] = useState(null)
    const [cameraOffset, setCameraOffset] = useState(new Vector3(0, 2, 5))

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
        mass: { value: 0.3, min: 0, max: 10, step: 0.1 },
        forceMultiplier: { value: 6, min: 0, max: 10, step: 0.1 },
    })

    const arrowGltf = useGLTF("./glb/arrow.glb")

    const handlePointerDown = (event) => {
        // When user clicks on sphere, start tracking pointer movement
        setIsDragging(true)
    }

    const handlePointerMove = (event) => {
        // Track pointer movement here if user has clicked on sphere and hasn't released pointer and update force vector
        if (isDragging && ballRef.current) {
            console.log("pointer move")
            const ballPosition = ballRef.current.translation()
            const ballPositionVector = new Vector3(ballPosition.x, ballPosition.y, ballPosition.z)
            const pointerPosition = event.point

            const forceDirection = ballPositionVector.clone().sub(pointerPosition)

            forceDirection.y = 0

            const maxForce = 50
            if (forceDirection.length() > maxForce) {
                forceDirection.normalize().multiplyScalar(maxForce)
            }

            setForceVector(forceDirection)
        }
    }

    useEffect(() => {
        const handlePointerUp = (event) => {    
            // Stop tracking pointer movement and apply force to sphere
            setIsDragging(false)
            
            if (ballRef.current && forceVector) {
                const force = forceVector.clone().multiplyScalar(forceMultiplier)
                console.log("forceVector", forceVector)
                ballRef.current.applyImpulse(force, true)
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

            const arrowScale = forceVector.length() * 2
            arrowRef.current.scale.set(1, 1, arrowScale)
        } else {
            arrowRef.current.scale.set(1, 1, 1)
        }
    }

    useFrame(({camera}) => {
        // Keep plane position in sync with ball position
        if (ballRef.current && planeRef.current.position) {
            const ballPosition = ballRef.current.translation()
            planeRef.current.position.set(ballPosition.x, ballPosition.y + 0.01, ballPosition.z)
            arrowRef.current.position.set(ballPosition.x, ballPosition.y + 0.01, ballPosition.z)
        }
    
        updateArrow()

        if (cameraMode === "follow" && ballRef.current) {
            const ballPosition = ballRef.current.translation()
            const ballPositionVector = new Vector3(ballPosition.x, ballPosition.y, ballPosition.z)


            // const cameraPosition = ballPositionVector.clone().add(new Vector3(0, 5, 5))
            const cameraLookAt = ballPositionVector.clone()
            camera.lookAt(cameraLookAt)

            // add cameraOffset to ball position to get new camera position
            const cameraPosition = ballPositionVector.clone().add(cameraOffset)

            camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        } else {
            setCameraOffset(camera.position.clone())
        }
    })

    return (
        <>
            <RigidBody
                ref={ballRef}
                colliders="ball"
                restitution={restitution} // Bounciness 0 = no bounce, 1 = full bounce
                friction={friction}
                linearDamping={linearDamping}
                angularDamping={angularDamping}
                mass={mass}
                >
                <mesh
                    onPointerDown={cameraMode === "follow" && handlePointerDown}                    
                    >
                    <sphereGeometry args={[0.5]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            <mesh
                ref={planeRef}
                onPointerMove={cameraMode === "follow" && handlePointerMove}
                rotation={[-Math.PI / 2, 0, 0]}
                visible={false}
            >
                <circleGeometry args={[12, 16]} />
                <meshStandardMaterial color="pink" />
            </mesh>
            <primitive 
                object={arrowGltf.scene}
                ref={arrowRef}
                />
        </>
    )
}
