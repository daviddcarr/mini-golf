import { useRef } from "react"
import {
    RigidBody
} from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"

export default function Player() {

    const player = useRef()

    return (
        <RigidBody
            ref={player}
            colliders="ball"
            position={[0, 1, 0]}
            restitution={0.2}
            friction={1}

            linearDamping={0.5}
            angularDamping={0.5}
            >
            <mesh>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
    )
}
