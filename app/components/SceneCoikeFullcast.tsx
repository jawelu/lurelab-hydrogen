"use client"
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import ModelCoikeFullcast from './ModelCoikeFullcast';





export default function SceneCoikeFullcast() {
    return (
        <Canvas style={{ width: '100%', height: '100%'}}>
            <directionalLight intensity={3} position={[0, 3, 2]}/>
            {/* <Environment
            preset='dawn'
            files="/kiara_1_dawn_1k.hdr"
            background
            /> */}
            <Suspense fallback={null}>
                <ModelCoikeFullcast />
            </Suspense>
        </Canvas>
    );
}