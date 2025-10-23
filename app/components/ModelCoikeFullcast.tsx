import React, { Suspense, useRef, useState, useEffect } from 'react';
import { useGLTF, Text, Html, Center, Billboard} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from "three";

export default function ModelCoikeFullcast() {
      const mesh = useRef<THREE.Mesh>(null);
    const { nodes, scene } = useGLTF("/scene/coike-fullcast.glb")
    const {viewport} = useThree()
    const [textLoaded, setTextLoaded] = useState(false)

      const box = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        scene.position.sub(center); // 将模型中心移到原点

    useEffect(() => {
        // console.log('Model mounted, text should load')
        setTextLoaded(true)
    }, [])

    useFrame( () => {
            if (mesh.current) {
           mesh.current.rotation.x += 0.002; // 绕 X 轴旋转
mesh.current.rotation.y += 0.002; // 绕 Y 轴旋转
// mesh.current.rotation.z += 0.001; // 绕 Z 轴旋转
        }
    })

      

    return (
        <group >
            <Billboard position={[0, 0, 0.5]}>
                <Html center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        color: 'white',
                        fontSize: '48px',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {/* We have 3D model<br/>for all lure mold */}
                    </div>
                </Html>
            </Billboard>
            <mesh {...nodes["coike-fullcast"]} scale={0.05} ref={mesh}>
                 {/* <meshStandardMaterial color="red" /> */}
            </mesh>

            {/* <primitive ref={mesh} object={scene} scale={0.02} /> */}
        </group>
    )
}
