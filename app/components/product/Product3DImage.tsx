"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Plus, Minus, RotateCcw, Cuboid, Video, Pause, Play } from "lucide-react";

type ProductMedia = {
    mediaContentType: "IMAGE" | "MODEL_3D" | "VIDEO";
    previewImage?: { url: string; altText?: string };
    sources?: { url: string; format: string; mimeType?: string }[];
};

type ProductMediaViewerProps = {
    media: ProductMedia[];
    width?: string;
    height?: string;
};

const Model3D: React.FC<{ url: string; scale: number }> = ({ url, scale }) => {

    const group = useRef<THREE.Group>(null);
    const { scene } = useGLTF(url);
    scene.scale.setScalar(scale)

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center); // 将模型中心移到原点

    return <primitive ref={group} object={scene} scale={scale} />;
};

const ModelSkeleton = () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 animate-pulse">
        <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-transparent animate-spin" />
    </div>
);

const ProductMediaViewer: React.FC<ProductMediaViewerProps> = ({
    media,
    width = "100%",
    height = "500px",
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hovered, setHovered] = useState(false);

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);


    const toggleVideo = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsVideoPlaying(true);
        } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        }
    };

    // ✅ 每个模型都有独立状态
    const [modelStates, setModelStates] = useState<
        Record<number, { scale: number; orbitRef?: any }>
    >({});

    // 初始化每个模型的默认状态
    useEffect(() => {
        setModelStates((prev) => {
            const updated = { ...prev };
            media.forEach((_, i) => {
                if (!updated[i]) updated[i] = { scale: 0.025 };
            });
            return updated;
        });
    }, [media]);

    const currentState = modelStates[currentIndex];
    const currentMedia = media[currentIndex];
    
    const handlePrev = () =>
        setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

    const handleNext = () =>
        setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));

    const handleZoomIn = () =>
        setModelStates((prev) => ({
            ...prev,
            [currentIndex]: {
                ...prev[currentIndex],
                scale: Math.min(prev[currentIndex].scale * 1.2, 0.25),
            },
        }));

    const handleZoomOut = () =>
        setModelStates((prev) => ({
            ...prev,
            [currentIndex]: {
                ...prev[currentIndex],
                scale: Math.max(prev[currentIndex].scale / 1.2, 0.005),
            },
        }));

    const handleReset = () =>
        setModelStates((prev) => {
            const orbit = prev[currentIndex].orbitRef;
            if (orbit) {
                orbit.reset();
            }
            return {
                ...prev,
                [currentIndex]: { ...prev[currentIndex], scale: 0.025 },
            };
        });

    return (
        <div
            className="relative w-full group select-none overflow-hidden rounded-2xl shadow-md"
            style={{ width, height }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* 主展示内容 */}
            <div className="w-full h-full bg-gray-100">
                {currentMedia.mediaContentType === "IMAGE" &&
                    currentMedia.previewImage?.url && (
                        <img
                            src={currentMedia.previewImage.url}
                            alt={currentMedia.previewImage.altText || ""}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    )}

                {currentMedia.mediaContentType === "MODEL_3D" &&
                    currentMedia.sources?.length && (
                        <Suspense fallback={<ModelSkeleton />}>
                            <Canvas
                                key={currentIndex}
                                camera={{ position: [2, 0, 12.25], fov: 15 }}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <ambientLight intensity={1.25} />
                                <directionalLight intensity={0.4} />
                                <Model3D
                                    url={
                                        currentMedia.sources.find((s) => s.format === "glb")?.url ||
                                        ""
                                    }
                                    scale={currentState?.scale}
                                />
                                <OrbitControls
                                    ref={(ref) => {
                                        if (ref && modelStates[currentIndex]?.orbitRef !== ref) {
                                            setModelStates((prev) => ({
                                                ...prev,
                                                [currentIndex]: { ...prev[currentIndex], orbitRef: ref },
                                            }));
                                        }
                                    }}
                                    enableZoom={false} // ❌ 禁止滚轮缩放
                                />
                            </Canvas>

                            {/* ✅ 控制区 */}
                            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                                {/* 3D 标签 */}
                                <div className="flex items-center bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
                                    <Cuboid className="w-4 h-4 mr-1 text-brand-navy" />
                                    3D Model
                                </div>

                                {/* 控制按钮组 */}
                                <div className="flex bg-white/80 backdrop-blur-sm rounded-full shadow">
                                    <button
                                        onClick={handleZoomOut}
                                        className="p-1.5 hover:bg-gray-100 rounded-l-full"
                                        title="Zoom Out"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="w-px bg-gray-300" />
                                    <button
                                        onClick={handleZoomIn}
                                        className="p-1.5 hover:bg-gray-100"
                                        title="Zoom In"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <div className="w-px bg-gray-300" />
                                    <button
                                        onClick={handleReset}
                                        className="p-1.5 hover:bg-gray-100 rounded-r-full"
                                        title="Reset View"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Suspense>
                    )}

                {currentMedia.mediaContentType === "VIDEO" && currentMedia.sources?.length && (
                    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                        {/* 视频本体 */}
                        <video
                            ref={videoRef}
                            src={currentMedia.sources[0].url}
                            poster={currentMedia.previewImage?.url}
                            className={`w-full h-full object-contain transition-opacity duration-500 ${isVideoPlaying ? "opacity-100" : "opacity-80"
                                }`}
                            controls={false}
                            preload="metadata"
                        />

                        {/* ✅ 封面层（暂停时显示） */}
                        {!isVideoPlaying && currentMedia.previewImage?.url && (
                            <img
                                src={currentMedia.previewImage.url}
                                alt={currentMedia.previewImage.altText || "Video preview"}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                            />
                        )}

                        {/* 播放/暂停按钮 */}
                        <button
                            onClick={toggleVideo}
                            className="absolute inset-0 m-auto w-14 h-14 flex items-center justify-center bg-white/60 rounded-full hover:bg-white transition"
                        >
                            {isVideoPlaying ? (
                                <Pause className="w-6 h-6 text-gray-800" />
                            ) : (
                                <Play className="w-6 h-6 text-gray-800" />
                            )}
                        </button>
                    </div>
                )}

            </div>

            {/* Hover 时显示左右切换按钮 */}
            {hovered && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}
        </div>
    );
};

export default ProductMediaViewer;



// "use client";

// import React, { Suspense, useRef, useState, useEffect } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import * as THREE from "three";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Minus,
//   RotateCcw,
//   Cuboid,
//   Play,
//   Pause,
// } from "lucide-react";

// type ProductMedia = {
//   mediaContentType: "IMAGE" | "MODEL_3D" | "VIDEO";
//   previewImage?: { url: string; altText?: string };
//   sources?: { url: string; format: string; mimeType?: string }[];
// };

// type ProductMediaViewerProps = {
//   media: ProductMedia[];
//   width?: string;
//   height?: string;
// };

// const Model3D: React.FC<{ url: string; scale: number }> = ({ url, scale }) => {
//   const group = useRef<THREE.Group>(null);
//   const { scene } = useGLTF(url);
//   scene.scale.setScalar(scale);

//   // 居中
//   const box = new THREE.Box3().setFromObject(scene);
//   const center = new THREE.Vector3();
//   box.getCenter(center);
//   scene.position.sub(center);

//   return <primitive ref={group} object={scene} />;
// };

// const ModelSkeleton = () => (
//   <div className="flex items-center justify-center w-full h-full bg-gray-100 animate-pulse">
//     <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-transparent animate-spin" />
//   </div>
// );

// const ProductMediaViewer: React.FC<ProductMediaViewerProps> = ({
//   media,
//   width = "100%",
//   height = "500px",
// }) => {

//     console.log('mediamedia', media)
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [hovered, setHovered] = useState(false);
//   const [modelStates, setModelStates] = useState<
//     Record<number, { scale: number; orbitRef?: any }>
//   >({});
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);

//   const videoRef = useRef<HTMLVideoElement>(null);

//   // 初始化每个模型默认状态
//   useEffect(() => {
//     setModelStates((prev) => {
//       const updated = { ...prev };
//       media.forEach((_, i) => {
//         if (!updated[i]) updated[i] = { scale: 0.025 };
//       });
//       return updated;
//     });
//   }, [media]);

//   const currentState = modelStates[currentIndex];
//   const currentMedia = media[currentIndex];

//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));

//   const handleZoomIn = () =>
//     setModelStates((prev) => ({
//       ...prev,
//       [currentIndex]: {
//         ...prev[currentIndex],
//         scale: Math.min(prev[currentIndex].scale * 1.2, 0.25),
//       },
//     }));

//   const handleZoomOut = () =>
//     setModelStates((prev) => ({
//       ...prev,
//       [currentIndex]: {
//         ...prev[currentIndex],
//         scale: Math.max(prev[currentIndex].scale / 1.2, 0.005),
//       },
//     }));

//   const handleReset = () =>
//     setModelStates((prev) => {
//       const orbit = prev[currentIndex].orbitRef;
//       if (orbit) orbit.reset();
//       return { ...prev, [currentIndex]: { ...prev[currentIndex], scale: 0.025 } };
//     });

//   const toggleVideo = () => {
//     if (!videoRef.current) return;
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//       setIsVideoPlaying(true);
//     } else {
//       videoRef.current.pause();
//       setIsVideoPlaying(false);
//     }
//   };

//   return (
//     <div
//       className="relative w-full group select-none overflow-hidden rounded-2xl shadow-md"
//       style={{ width, height }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* 主展示内容 */}
//       <div className="w-full h-full bg-gray-100 flex items-center justify-center">
//         {currentMedia.mediaContentType === "IMAGE" && currentMedia.previewImage?.url && (
//           <img
//             src={currentMedia.previewImage.url}
//             alt={currentMedia.previewImage.altText || ""}
//             className="w-full h-full object-cover transition-opacity duration-300"
//           />
//         )}

//         {currentMedia.mediaContentType === "MODEL_3D" && currentMedia.sources?.length && (
//           <Suspense fallback={<ModelSkeleton />}>
//             <Canvas
//               key={currentIndex}
//               camera={{ position: [2, 0, 12.25], fov: 15 }}
//               style={{ width: "100%", height: "100%" }}
//             >
//               <ambientLight intensity={1.25} />
//               <directionalLight intensity={0.4} />
//               <Model3D
//                 url={currentMedia.sources.find((s) => s.format === "glb")?.url || ""}
//                 scale={currentState?.scale}
//               />
//               <OrbitControls
//                 ref={(ref) => {
//                   if (ref && modelStates[currentIndex]?.orbitRef !== ref) {
//                     setModelStates((prev) => ({
//                       ...prev,
//                       [currentIndex]: { ...prev[currentIndex], orbitRef: ref },
//                     }));
//                   }
//                 }}
//                 enableZoom={false}
//               />
//             </Canvas>
//           </Suspense>
//         )}

//         {currentMedia.mediaContentType === "VIDEO" && currentMedia.sources?.length && (
//           <div className="relative w-full h-full bg-black flex items-center justify-center">
//             <video
//               ref={videoRef}
//               src={currentMedia.sources[0].url}
//               poster={currentMedia.previewImage?.url}
//               className="w-full h-full object-contain"
//               controls={false}
//             />
//             <button
//               onClick={toggleVideo}
//               className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-white/50 rounded-full hover:bg-white transition"
//             >
//               {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Hover 时显示左右切换按钮 */}
//       {hovered && (
//         <>
//           <button
//             onClick={handlePrev}
//             className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>
//           <button
//             onClick={handleNext}
//             className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProductMediaViewer

