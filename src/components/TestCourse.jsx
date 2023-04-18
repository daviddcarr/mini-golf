import  { useGLTF }  from  "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

export default function TestCourse(props) {

    const gltf = useGLTF('./glb/Courses_Complete.glb')

    return (
        <RigidBody
            {...props}
            >
            <primitive
                object={gltf.scene}
                />
        </RigidBody>
    )
}