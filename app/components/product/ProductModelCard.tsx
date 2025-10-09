// 'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';

type ProductModelCardProps = {
  modelUrl: string;   // glb 文件地址
  title?: string;
  height?: string;    // 高度可配置
};

// 封装加载模型的组件
function Model({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={1} />;
}

export default function ProductModelCard({ modelUrl, title, height = '350px' }: ProductModelCardProps) {

  return (
    <div className="rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative w-full" style={{ height }}>
        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading 3D...</div>}>
          <Canvas camera={{ position: [0, 0, 2.5] }}>
            {/* 环境光 */}
            {/* <ambientLight intensity={0.6} /> */}
            {/* 方向光 */}
            {/* <directionalLight position={[5, 5, 5]} intensity={1} /> */}
            {/* 模型 */}
            <Model modelUrl={modelUrl} />
            {/* 控制交互 */}
            {/* <OrbitControls enableZoom={true} /> */}
            {/* 环境贴图 */}
            {/* <Environment preset="city" /> */}
          </Canvas>
        </Suspense>
      </div>

      {title && (
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
    </div>
  );
}
