import * as THREE from 'three'
import { useMemo, useState, useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import { RigidBody, CuboidCollider, BallCollider } from "@react-three/rapier"
import { useControls } from "leva"
import { useSpring, a } from '@react-spring/three'

import { useGame } from '../hooks/useGame'
import Ball from './Ball'

export default function Course({position, rotation, number, setOrbitTarget, cameraFollowPosition, setCameraFollowPosition}) {

    const [ inHoleSound ] = useState(() => new Audio("./audio/ball_inHole.mp3"))


    const [
        cameraMode,
        setCameraMode,
        currentLevel,
        setNextLevel,
        gameState,
        setCameraPosition,
        setIsHidden,
    ] = useGame(state => [
        state.cameraMode,
        state.setCameraMode,
        state.currentLevel,
        state.setNextLevel,
        state.gameState,
        state.setCameraPosition,
        state.setIsHidden,
    ])

    const endLevel = (event) => {

        const collidedBody = event.colliderObject
        
        
        if (collidedBody.name === "player") {
            inHoleSound.currentTime = 0
            inHoleSound.volume = 0.5
            inHoleSound.play()
            
            
            if (currentLevel < 9) {
                console.log("Course Complete, triggering next level")
                setIsHidden(true)
                setNextLevel();
            }
        }

    }

    const coursePhysics = useControls("Level Physics", {
        grassRestitution: { value: 0.5, min: 0, max: 1, step: 0.1 },
        grassFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
        wallRestitution: { value: 1, min: 0, max: 1, step: 0.1 },
        wallFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
      })


    switch (number) {
        case 1:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseOne position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        case 2:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseTwo position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
                )
        case 3:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseThree position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
                )
        case 4:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseFour position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        case 5:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseFive position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        case 6:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseSix position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        case 7:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseSeven position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        case 8:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseEight position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        case 9:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseNine position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
        /**/
        
        default:
            return (
                <>
                    <Ball setOrbitTarget={setOrbitTarget} />
                    <CourseOne position={position} rotation={rotation} coursePhysics={coursePhysics} endLevel={endLevel} />
                </>
            )
    }
}

export function CourseFlag({position, rotation}) {

    const gltf = useGLTF('./glb/Goal_Flag.glb')

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes
    }, [gltf])

    const [ raised, setRaised ] = useState(false)

    const flagRaiseHeight = 0.5;

    const RaiseFlag = (e) => {
        const collidedBody = e.colliderObject
        
        if (collidedBody.name === "player") {
            setRaised(true)
        }
    }

    const LowerFlag = (e) => {
        const collidedBody = e.colliderObject
        
        if (collidedBody.name === "player") {
            setRaised(false)
        }
    }

    const flagSpring = useSpring({
        position: raised ? [position[0], position[1] + flagRaiseHeight, position[2]] : [position[0], position[1], position[2]],
        rotation: raised ? [rotation[0], rotation[1] + Math.PI * 2, rotation[2]] : [rotation[0], rotation[1], rotation[2]],
    });

    return (

        <>
            <a.mesh
                position={flagSpring.position}
                rotation={flagSpring.rotation}
                geometry={mesh.Goal_Flag.geometry}
                material={mesh.Goal_Flag.material}
                receiveShadow
                />
            <BallCollider
                sensor
                args={[0.5]}
                position={position}
                onIntersectionEnter={RaiseFlag}
                onIntersectionExit={LowerFlag}
                />
        </>
    )
}

export function CourseOne(props) {

    const gltf = useGLTF('./glb/Course1.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-2.5, 1, 0),
    ]

    const mesh = useMemo(() => {
        return gltf.nodes
    }, [gltf])
    
    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.CourseEndGreen001.geometry}
                    material={mesh.CourseEndGreen001.material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-4.52, -0.08, 0]}
                    />
                {/* Course Camera Triggers */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    args={[1.5, 0.5, 0.5]}
                    position={[-4, 0.25, 0]}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.CourseEndWalls001.geometry}
                    material={mesh.CourseEndWalls001.material}
                    receiveShadow
                    />
            </RigidBody>
            <CourseFlag position={[-4.52, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

export function CourseTwo(props) {

    const gltf = useGLTF('./glb/Course2.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-0.8, 1, -1.2),
        new THREE.Vector3(-3.2, 1, -0.8),
    ]

    const mesh = useMemo(() => {
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.CourseStartGreen001.children[0].geometry}
                    material={mesh.CourseStartGreen001.children[0].material}
                    receiveShadow
                    />
                <mesh
                    geometry={mesh.CourseStartGreen001.children[1].geometry}
                    material={mesh.CourseStartGreen001.children[1].material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-4.57, -0.08, -2]}
                    />
                {/* Course Camera Triggers */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    args={[1, 0.5, 1]}
                    position={[-2, 0.25, 0]}
                    />
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    args={[1, 0.5, 1]}
                    position={[-2, 0.25, -2]}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.CourseStartWalls001.geometry}
                    material={mesh.CourseStartWalls001.material}
                    receiveShadow
                    />
            </RigidBody>
            <CourseFlag position={[-4.57, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

export function CourseThree(props) {

    const gltf = useGLTF('./glb/Course3.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-0.8, 1, -1.2),
        new THREE.Vector3(-0.8, 1, -2.2),
    ]

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course3Green.geometry}
                    material={mesh.Course3Green.material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    // position={[-0.565, -0.06, 0]}
                    position={[-2, -0.08, -4.567]}
                    />
                {/* Course Camera Triggers */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    args={[1, 0.5, 1]}
                    position={[-2, 0.25, 0]}
                    />
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    args={[1, 0.5, 1]}
                    position={[-2, 0.25, -2]} 
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                position={[-2, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course3Walls.geometry}
                    material={mesh.Course3Walls.material}
                    receiveShadow
                    />
            </RigidBody>
            <CourseFlag position={[-2, 0, -4.567]} rotation={[0, 0, 0]} />
        </>
    )
}

export function CourseFour(props) {

    const gltf = useGLTF('./glb/Course4.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-0.8, 1, -1.2),
        new THREE.Vector3(-2.8, 1, -1.2),
    ]

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course4Green.geometry}
                    material={mesh.Course4Green.material}
                    receiveShadow
                    />
                {/* <mesh
                    geometry={mesh.Course4Green.children[1].geometry}
                    material={mesh.Course4Green.children[1].material}
                    receiveShadow
                    /> */}
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    // position={[-0.565, -0.06, 0]}
                    position={[-4.567, -0.08, 0]}
                    />
                {/* Course Camera Triggers */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    args={[1, 0.5, 1]}
                    position={[-2, 0.25, 0]}
                    />
                <CuboidCollider
                    sensor
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    args={[1, 0.5, 1]}
                    position={[-4, 0.25, 0]}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course4Walls.geometry}
                    material={mesh.Course4Walls.material}
                    receiveShadow
                    />
            </RigidBody>
            <RigidBody
                {...props}
                position={[-2, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                >
                <mesh
                    geometry={mesh.Course4RockFormation.geometry}
                    material={mesh.Course4RockFormation.material}
                    receiveShadow
                    />
            </RigidBody>
            <CourseFlag position={[-4.567, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

// Course 9
export function CourseNine(props) {

    const gltf = useGLTF('./glb/Course5.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-2, 1, 1),
        new THREE.Vector3(-5.05,  0.75, 1.3),
        new THREE.Vector3(-6, 0.6, -0.4)
    ]

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course5Green.children[0].geometry}
                    material={mesh.Course5Green.children[0].material}
                    receiveShadow
                    />
                <mesh
                    geometry={mesh.Course5Green.children[1].geometry}
                    material={mesh.Course5Green.children[1].material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-7, -0.58, -0.5665]}
                    />
                {/* Course Camera Triggers */}
                <BallCollider
                    sensor
                    args={[1]}
                    position={[-2, 0.25, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    />
                <BallCollider
                    sensor
                    args={[1]}
                    position={[-5.05, -0.99, 2.99]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    />
                <BallCollider
                    sensor
                    args={[1.5]}
                    position={[-7, -0.58, -0.5665]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[3])}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course5Walls.geometry}
                    material={mesh.Course5Walls.material}
                    receiveShadow
                    />
            </RigidBody>
            <CourseFlag position={[-7, -0.5, -0.5665]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

// Course 7
export function CourseSeven(props) {

    const gltf = useGLTF('./glb/Course6.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-2.567, 0.3688, -0.8),
        new THREE.Vector3(-4.85,  0.75, -0.8),
    ]

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course6Green.geometry}
                    material={mesh.Course6Green.material}
                    receiveShadow
                    />
                {/* <mesh
                    geometry={mesh.Course6Green.children[1].geometry}
                    material={mesh.Course6Green.children[1].material}
                    receiveShadow
                    /> */}
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-5.567, -0.36, 0]}
                    />
                {/* Course Camera Triggers */}
                <BallCollider
                    sensor
                    args={[1]}
                    position={[-2.567, 0, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    />
                <BallCollider
                    sensor
                    args={[1.5]}
                    position={[-5.567, -0.36, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    />

            </RigidBody>    
            <RigidBody
                {...props}
                position={[-5, -0.25, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course6Walls.geometry}
                    material={mesh.Course6Walls.material}
                    receiveShadow
                    />
            </RigidBody>
            <RigidBody
                {...props}
                position={[-2, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="metal"
                >
                <mesh
                    geometry={mesh.Course6Ramp.geometry}
                    material={mesh.Course6Ramp.material}
                    receiveShadow
                    />
            </RigidBody>
            <CourseFlag position={[-5.567, -0.28, 0]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

// Course 5
export function CourseFive(props) {

    const gltf = useGLTF('./glb/Course7.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-1.299, 1.015, 0),
        new THREE.Vector3(-3.5,  0.75, -0.8),
    ]

    const tunnelRef = useRef()

    useFrame((state) => {
        const speed = 0.5
        const time = state.clock.getElapsedTime()
        let rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(time * speed, 0, 0))

        tunnelRef.current.setNextKinematicRotation(rotation);

    })
    
    const mesh = useMemo(() => {
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course7Green.geometry}
                    material={mesh.Course7Green.material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-5.567, -0.61, 0]}
                    />
                {/* Course Camera Triggers */}
                <BallCollider
                    sensor
                    args={[1]}
                    position={[-2.4789, 0.41536, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    />
                <BallCollider
                    sensor
                    args={[1.5]}
                    position={[-5.567, -0.61, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    />
                
            </RigidBody>    
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course7Walls.geometry}
                    material={mesh.Course7Walls.material}
                    receiveShadow
                    />
            </RigidBody>
            <group
                position={[-2.4789, 0.41536, 0]}
                >
                <RigidBody
                    ref={tunnelRef}
                    type="kinematicPosition"
                    colliders="trimesh"
                    restitution={props.coursePhysics.wallRestitution}
                    friction={props.coursePhysics.wallFriction}
                    name="wall"
                    >
                    <mesh
                        geometry={mesh.Course7SpinningTunnel.geometry}
                        material={mesh.Course7SpinningTunnel.material}
                        receiveShadow
                        />
                </RigidBody>
            </group>
            <CourseFlag position={[-5.567, -0.53, 0]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

// Course 6
export function CourseSix(props) {

    const gltf = useGLTF('./glb/Course8.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-1.3, 0.75, 0.8),
        new THREE.Vector3(-2.9, 0.75, 0.8),
        new THREE.Vector3(-3.7, 0.5, 0.8),
    ]

    const bladesRef = useRef()

    useFrame((state) => {
        const speed = 0.5
        const time = state.clock.getElapsedTime()
        let rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(time * speed, 0, 0))

        bladesRef.current.setNextKinematicRotation(rotation);

    })
    
    const mesh = useMemo(() => {
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course8Green.geometry}
                    material={mesh.Course8Green.material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-4.567, -0.36, 0]}
                    />
                {/* Course Camera Triggers */}
                <CuboidCollider
                    sensor
                    args={[0.5, 0.25, 0.5]}
                    position={[-1.5, 0, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    />
                <CuboidCollider
                    sensor
                    args={[0.5, 0.25, 0.5]}
                    position={[-2.5, -0.125, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    />
                <BallCollider
                    sensor
                    args={[1]}
                    position={[-4.567, -0.36, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[3])}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course8Walls.geometry}
                    material={mesh.Course8Walls.material}
                    receiveShadow
                    />
            </RigidBody>
            <group
                position={[-1.7879, 0.72585, 0]}
                >
                <RigidBody
                    ref={bladesRef}
                    type="kinematicPosition"
                    colliders="trimesh"
                    restitution={props.coursePhysics.wallRestitution}
                    friction={props.coursePhysics.wallFriction}
                    name="metal"
                    >
                    <mesh
                        geometry={mesh.Course8Blades.geometry}
                        material={mesh.Course8Blades.material}
                        receiveShadow
                        />
                </RigidBody>
            </group>
            <CourseFlag position={[-4.567, -0.28, 0]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}

// Course 8
export function CourseEight(props) {

    const gltf = useGLTF('./glb/Course9.glb')

    const [ setCameraPosition ] = useGame(state => [state.setCameraPosition])
    const cameraPositions = [
        new THREE.Vector3(0.25, 0.25, 0),
        new THREE.Vector3(-1, 0.5, 0.6),
        new THREE.Vector3(-2,  0.75, 0.8),
    ]

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes
    }, [gltf])

    return (
        <>
            
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.grassRestitution}
                friction={props.coursePhysics.grassFriction}
                >
                <mesh
                    geometry={mesh.Course9Green.geometry}
                    material={mesh.Course9Green.material}
                    receiveShadow
                    />
                 <mesh
                    geometry={mesh.Course9LoopGreen.geometry}
                    material={mesh.Course9LoopGreen.material}
                    receiveShadow
                    />
                {/* Course End Trigger */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ props.endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-2.567, -0.08, 0]}
                    />
                {/* Course Camera Triggers */}
                <BallCollider
                    sensor
                    args={[0.6]}
                    position={[-1, 0.5, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[1])}
                    />
                <BallCollider
                    sensor
                    args={[1]}
                    position={[-2.567, -0.08, 0]}
                    onIntersectionEnter={() => setCameraPosition(cameraPositions[2])}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={props.coursePhysics.wallRestitution}
                friction={props.coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course9Walls.geometry}
                    material={mesh.Course9Walls.material}
                    receiveShadow
                    />
                <mesh
                    geometry={mesh.Course9LoopWalls.geometry}
                    material={mesh.Course9LoopWalls.material}
                    receiveShadow
                    />
            </RigidBody>
        
            <CourseFlag position={[-2.567, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        </>
    )
}