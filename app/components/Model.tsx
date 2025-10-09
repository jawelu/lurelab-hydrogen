// "use client"
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function DragonModel({ ...props }) {

    const group = useRef('');
    const { nodes, materials, animations, scene } = useGLTF("https://jawelu.myshopify.com/cdn/shop/3d/models/o/44b8326eb30f9d61/coike-fullcast.glb");

    return (
        // <group ref={group} {...props} dispose={null}>

        //      {/* <primitive  scale={[0.02, 0.02, 0.02]} object={nodes.Ankle_L_0105} />

        //     <primitive  scale={[0.02, 0.02, 0.02]} object={materials} /> */}

        //     <primitive object={scene} scale={0.025} /> 
        // </group>

         <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes['coike-fullcast']?.geometry} material={materials.Material} scale={0.025} />
    </group>
    );
}

// useGLTF.preload("https://jawelu.myshopify.com/cdn/shop/3d/models/o/44b8326eb30f9d61/coike-fullcast.glb");