import { useMemo, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { useControls } from "leva"

export default function CourseThree(props) {

    const coursePhysics = useControls("Level Physics", {
        grassRestitution: { value: 0.5, min: 0, max: 1, step: 0.1 },
        grassFriction: { value: 0.6, min: 0, max: 1, step: 0.1 },
        wallRestitution: { value: 1, min: 0, max: 1, step: 0.1 },
        wallFriction: { value: 0.5, min: 0, max: 1, step: 0.1 },
      })

    const gltf = useGLTF('./glb/Course4.glb')

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
                    geometry={mesh.Course4Green.geometry}
                    material={mesh.Course4Green.material}
                    receiveShadow
                    />
                {/* <mesh
                    geometry={mesh.Course4Green.children[1].geometry}
                    material={mesh.Course4Green.children[1].material}
                    receiveShadow
                    /> */}
                <CuboidCollider
                    sensor
                    onIntersectionEnter={ endLevel }
                    args={[0.06, 0.05, 0.05]}
                    // position={[-0.565, -0.06, 0]}
                    position={[-2, -0.06, -4.567]}
                    />
            </RigidBody>    
            <RigidBody
                {...props}
                position={[0, 0, 0]}
                type="fixed"
                colliders="trimesh"
                restitution={coursePhysics.wallRestitution}
                friction={coursePhysics.wallFriction}
                name="wall"
                >
                <mesh
                    geometry={mesh.Course4Walls.geometry}
                    material={mesh.Course4Walls.material}
                    receiveShadow
                    />
            </RigidBody>
        </>
    )
}
