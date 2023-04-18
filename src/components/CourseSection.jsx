import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"

export default function CourseSection({position, rotation, type}) {

    switch (type) {
        case "start":
            return <CourseStart position={position} rotation={rotation} />
        case "corner":
            return <CourseCorner position={position} rotation={rotation} />
        case "end":
            return <CourseEnd position={position} rotation={rotation} />
        default:
            return <CourseStraight position={position} rotation={rotation} />
    }
}

export function CourseStart(props) {
    
    const gltf = useGLTF('./glb/Course_Start.glb')
    // gltf.nodes.CourseStart

    const mesh = useMemo(() => {
        return gltf.nodes.CourseStart
    }, [gltf])

    return (
        <RigidBody
            {...props}
            type="fixed"
            colliders="trimesh"
            >
            <primitive
                object={gltf.scene}
                />
            <mesh 
                geometry={mesh.geometry}
                material={mesh.material}
                receiveShadow
                />
        </RigidBody>
    )
}

export function CourseStraight(props) {
        
    const gltf = useGLTF('./glb/Course_Straight.glb')
    
    const mesh = useMemo(() => {
        return gltf.nodes.CourseStraight
    }, [gltf])

    return (
        <RigidBody
            {...props}
            type="fixed"
            colliders="trimesh"
            >
            <mesh
                geometry={mesh.geometry}
                material={mesh.material}
                receiveShadow
                />
            {/* <CuboidCollider position={[0, -0.05, 0]} args={[1, 0.05, 0.5]} /> */}
        </RigidBody>
    )
}

export function CourseCorner(props) {
            
    const gltf = useGLTF('./glb/Course_Corner.glb')

    const mesh = useMemo(() => {
        return gltf.nodes.CourseTurn
    }, [gltf])

    return (
        <RigidBody
            {...props}
            type="fixed"
            colliders="trimesh"
            >
            <mesh
                geometry={mesh.geometry}
                material={mesh.material}
                receiveShadow
                />
        </RigidBody>
    )
}

export function CourseEnd(props) {

    const gltf = useGLTF('./glb/Course_End.glb')

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
        return gltf.nodes.CourseEnd
    }, [gltf])

    return (
        <RigidBody
            {...props}
            type="fixed"
            colliders="trimesh"
            >
            <mesh
                geometry={mesh.children[0].geometry}
                material={mesh.children[0].material}
                receiveShadow
                />
            <mesh
                geometry={mesh.children[1].geometry}
                material={mesh.children[1].material}
                receiveShadow
                />
        </RigidBody>
    )
}