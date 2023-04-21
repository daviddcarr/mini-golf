import { useMemo, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { useControls } from "leva"

export default function CourseSection({position, rotation, type}) {

    const coursePhysics = useControls("Level Physics", {
        grassRestitution: { value: 0.5, min: 0, max: 1, step: 0.1 },
        grassFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
        wallRestitution: { value: 1, min: 0, max: 1, step: 0.1 },
        wallFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
      })


    switch (type) {
        case "start":
            return <CourseStart position={position} rotation={rotation} coursePhysics={coursePhysics} />
        case "corner":
            return <CourseCorner position={position} rotation={rotation} coursePhysics={coursePhysics} />
        case "end":
            return <CourseEnd position={position} rotation={rotation} coursePhysics={coursePhysics} />
        default:
            return <CourseStraight position={position} rotation={rotation} coursePhysics={coursePhysics} />
    }
}

export function CourseStart(props) {
    
    const gltf = useGLTF('./glb/Course_Start.glb')

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
                    geometry={mesh.CourseStartGreen.geometry}
                    material={mesh.CourseStartGreen.material}
                    receiveShadow
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
                geometry={mesh.CourseStartWalls.geometry}
                material={mesh.CourseStartWalls.material}
                receiveShadow
                />
            </RigidBody>
        </>
    )
}

export function CourseStraight(props) {
        
    const gltf = useGLTF('./glb/Course_Straight.glb')
    
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
                    geometry={mesh.CourseStraightGreen.geometry}
                    material={mesh.CourseStraightGreen.material}
                    receiveShadow
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
                    geometry={mesh.CourseStraightWalls.geometry}
                    material={mesh.CourseStraightWalls.material}
                    receiveShadow
                    />
            </RigidBody>
        </>

    )
}

export function CourseCorner(props) {
            
    const gltf = useGLTF('./glb/Course_Corner.glb')

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
                    geometry={mesh.CourseTurnGreen.geometry}
                    material={mesh.CourseTurnGreen.material}
                    receiveShadow
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
                    geometry={mesh.CourseTurnWalls.geometry}
                    material={mesh.CourseTurnWalls.material}
                    receiveShadow
                    />
            </RigidBody>
        </>
    )
}

export function CourseEnd(props) {

    const gltf = useGLTF('./glb/Course_End.glb')

    const [ inHoleSound ] = useState(() => new Audio("./audio/ball_inHole.mp3"))

    const mesh = useMemo(() => {
        return gltf.nodes
    }, [gltf])

    const endLevel = (event) => {

        const collidedBody = event.colliderObject
        
        if (collidedBody.name === "player") {
            inHoleSound.currentTime = 0
            inHoleSound.volume = 0.5
            inHoleSound.play()
        }

    }

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
                    geometry={mesh.CourseEndGreen.children[0].geometry}
                    material={mesh.CourseEndGreen.children[0].material}
                    receiveShadow
                    />
                <mesh
                    geometry={mesh.CourseEndGreen.children[1].geometry}
                    material={mesh.CourseEndGreen.children[1].material}
                    receiveShadow
                    />
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ endLevel }
                    args={[0.06, 0.05, 0.05]}
                    position={[-0.565, -0.06, 0]}
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
                    geometry={mesh.CourseEndWalls.geometry}
                    material={mesh.CourseEndWalls.material}
                    receiveShadow
                    />
            </RigidBody>
        </>
    )
}