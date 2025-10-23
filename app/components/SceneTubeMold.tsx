"use client"
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import ModelTubeMold from './ModelTubeMold';




export default function SceneTubeMold() {
    return (
        <Canvas >
            <directionalLight intensity={3} position={[0, 3, 2]}/>
            {/* <Environment
            preset='dawn'
            files="/kiara_1_dawn_1k.hdr"
            background
            /> */}
      
            <Suspense fallback={null}>
                <ModelTubeMold />
            </Suspense>
     
           
        </Canvas>
    );
}