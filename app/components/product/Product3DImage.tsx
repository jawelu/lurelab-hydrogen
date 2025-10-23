"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Cuboid,
  Pause,
  Play,
  Video,
  Image
} from "lucide-react";

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
  scene.scale.setScalar(scale);

  const box = new THREE.Box3().setFromObject(scene);
  const center = new THREE.Vector3();
  box.getCenter(center);
  scene.position.sub(center);

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

  const [videoStates, setVideoStates] = useState<Record<number, boolean>>({});
  const [videoProgress, setVideoProgress] = useState<Record<number, number>>({});
  const [videoScale, setVideoScale] = useState<Record<number, number>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const toggleVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play();
      setVideoStates((prev) => ({ ...prev, [index]: true }));
    } else {
      video.pause();
      setVideoStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index !== currentIndex) {
        setVideoProgress((prev) => ({ ...prev, [index]: video.currentTime }));
        video.pause();
        setVideoStates((prev) => ({ ...prev, [index]: false }));
      } else {
        const savedTime = videoProgress[index];
        if (savedTime && Math.abs(video.currentTime - savedTime) > 0.3) {
          video.currentTime = savedTime;
        }
      }
    });
  }, [currentIndex]);

  console.log("videoStates", videoStates);

  // ✅ 初始化每个视频的缩放比例
  useEffect(() => {
    setVideoScale((prev) => {
      const updated = { ...prev };
      media.forEach((_, i) => {
        if (!updated[i]) updated[i] = 1;
      });
      return updated;
    });
  }, [media]);

  // ✅ 模型控制状态
  const [modelStates, setModelStates] = useState<
    Record<number, { scale: number; orbitRef?: any }>
  >({});

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

//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));

  const handlePrev = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // 暂停当前视频并保存进度
      setVideoProgress((prev) => ({
        ...prev,
        [currentIndex]: currentVideo.currentTime,
      }));
      currentVideo.pause();
      setVideoStates((prev) => ({ ...prev, [currentIndex]: false }));
    }

    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // 暂停当前视频并保存进度
      setVideoProgress((prev) => ({
        ...prev,
        [currentIndex]: currentVideo.currentTime,
      }));
      currentVideo.pause();
      setVideoStates((prev) => ({ ...prev, [currentIndex]: false }));
    }

    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };


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
      if (orbit) orbit.reset();
      return {
        ...prev,
        [currentIndex]: { ...prev[currentIndex], scale: 0.025 },
      };
    });

  // ✅ 视频缩放控制
//   const handleVideoZoom = (delta: number) => {
//     setVideoScale((prev) => ({
//       ...prev,
//       [currentIndex]: Math.min(Math.max(prev[currentIndex] + delta, 0.5), 2),
//     }));
//   };

  // ✅ 进度条更新
  const handleSeek = (index: number, value: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = value;
      setVideoProgress((prev) => ({ ...prev, [index]: value }));
    }
  };

  return (
    <div
      className="relative w-full group select-none overflow-hidden rounded-2xl shadow-md"
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full h-full bg-gray-100">
        {/* === 图片 === */}
        {currentMedia.mediaContentType === "IMAGE" &&
          currentMedia.previewImage?.url && (
           

            <div>
                 <img
              src={currentMedia.previewImage.url}
              alt={currentMedia.previewImage.altText || ""}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

             <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                <div className="flex items-center bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
                  <Image className="w-4 h-4 mr-1 text-brand-navy" />
                  Image
                </div>
              </div>
            
            </div>
            
          )}

        {/* === 模型 === */}
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
                  enableZoom={false}
                />
              </Canvas>

              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                <div className="flex items-center bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
                  <Cuboid className="w-4 h-4 mr-1 text-brand-navy" />
                  3D Model
                </div>

                <div className="flex bg-white/80 rounded-full shadow">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-gray-100 rounded-l-full"
                    title="Zoom Out"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-gray-100"
                    title="Zoom In"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
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

        {/* === 视频 === */}
        {currentMedia.mediaContentType === "VIDEO" &&
          currentMedia.sources?.length && (
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={(el) => (videoRefs.current[currentIndex] = el)}
                src={currentMedia.sources[0].url}
                poster={currentMedia.previewImage?.url}
                style={{
                  transform: `scale(${videoScale[currentIndex] || 1})`,
                  transition: "transform 0.3s ease",
                }}
                className="w-full h-full object-contain"
                controls={false}
                loop
                preload="metadata"
                onTimeUpdate={(e) => {
                  const time = (e.target as HTMLVideoElement).currentTime;
                  setVideoProgress((prev) => ({
                    ...prev,
                    [currentIndex]: time,
                  }));
                }}
              />

              {/* ✅ 视频标签 */}
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 z-50">
                <div className="flex items-center bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
                  <Video className="w-4 h-4 mr-1 text-brand-navy" />
                  Video
                </div>

              </div>

              {/* ✅ 进度条 */}
              <input
                type="range"
                min={0}
                max={videoRefs.current[currentIndex]?.duration || 0}
                value={videoProgress[currentIndex] || 0}
                step={0.1}
                onChange={(e) =>
                  handleSeek(currentIndex, Number(e.target.value))
                }
                className="absolute bottom-0 left-0 w-full accent-brand-navy cursor-pointer"
              />

              {/* ✅ 播放/暂停按钮 */}
              <button
                onClick={() => toggleVideo(currentIndex)}
                className="absolute inset-0 m-auto w-14 h-14 flex items-center justify-center bg-white/60 rounded-full hover:bg-white transition"
              >
                {videoStates[currentIndex] ? (
                  <Pause className="w-6 h-6 text-gray-800" />
                ) : (
                  <Play className="w-6 h-6 text-gray-800" />
                )}
              </button>
            </div>
          )}
      </div>

      {/* 左右切换按钮 */}
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

