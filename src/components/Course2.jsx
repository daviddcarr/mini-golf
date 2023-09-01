import { useMemo, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { useControls } from "leva"

export default function CourseTwo(props) {

    const coursePhysics = useControls("Level Physics", {
        grassRestitution: { value: 0.5, min: 0, max: 1, step: 0.1 },
        grassFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
        wallRestitution: { value: 1, min: 0, max: 1, step: 0.1 },
        wallFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
      })

    const gltf = useGLTF('./glb/Course2.glb')

    const [ inHoleSound ] = useState(() => new Audio("./audio/ball_inHole.mp3"))

    const mesh = useMemo(() => {
        console.log(gltf.nodes)
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
                restitution={coursePhysics.grassRestitution}
                friction={coursePhysics.grassFriction}
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
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ endLevel }
                    args={[0.06, 0.05, 0.05]}
                    // position={[-0.565, -0.06, 0]}
                    position={[-4.57, -0.06, -2]}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                type="fixed"
                colliders="trimesh"
                restitution={coursePhysics.wallRestitution}
                friction={coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.CourseStartWalls001.geometry}
                    material={mesh.CourseStartWalls001.material}
                    receiveShadow
                    />
            </RigidBody>
        </>
    )
}
