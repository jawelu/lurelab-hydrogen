"use client"
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DragonModel from './Model';



export default function App() {
    return (
        <Canvas
            camera={{ position: [2, 0, 12.25], fov: 15 }}
            style={{
                backgroundColor: '#E0E0E0',
                width: '100vw',
                height: '60vh',
            }}
        >
            <ambientLight intensity={1.25} />
            {/* <ambientLight intensity={0.1} /> */}
            <directionalLight intensity={0.4} />
            <Suspense fallback={null}>

                <DragonModel position={[0, 0, 0]} />
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
}