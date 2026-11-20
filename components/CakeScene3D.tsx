"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CandleType, Language } from "@/types";
import { WebGLTier } from "@/utils/webglSupport";
import { subscribeBlowVisual } from "@/utils/soundVisualBus";
import { buildCakeAssembly, BuiltCakeResult } from "./cake3d/cakeModels";
import { buildCandlesController, BuiltCandlesController } from "./cake3d/candles3d";
import { buildAtmosphereController, AtmosphereController } from "./cake3d/atmosphere3d";

export interface CakeScene3DProps {
  cakeId: string;
  customImage?: string;
  candleType: CandleType;
  candleCount: number;
  digits: string;
  userName: string;
  lang: Language;
  isExtinguished: boolean;
  isBlowing: boolean;
  blowingProgress: number;
  isListeningSound: boolean;
  tier: WebGLTier;
  cheerBurstKey?: number;
  onFallbackTo2D: (reason?: string) => void;
}

const CakeScene3D: React.FC<CakeScene3DProps> = ({
  cakeId,
  customImage,
  candleType,
  candleCount,
  digits,
  userName,
  lang,
  isExtinguished,
  isBlowing,
  blowingProgress,
  isListeningSound,
  tier,
  cheerBurstKey = 0,
  onFallbackTo2D,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 实时渲染状态 Ref（避免 React 状态变化导致 Three.js 场景重建）
  const liveStateRef = useRef({
    isExtinguished,
    isBlowing,
    blowingProgress,
    isListeningSound,
    soundLevel: 0,
  });

  liveStateRef.current.isExtinguished = isExtinguished;
  liveStateRef.current.isBlowing = isBlowing;
  liveStateRef.current.blowingProgress = blowingProgress;
  liveStateRef.current.isListeningSound = isListeningSound;

  // 场景核心引用（用于增量替换蛋糕或蜡烛）
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cakeResultRef = useRef<BuiltCakeResult | null>(null);
  const candlesCtrlRef = useRef<BuiltCandlesController | null>(null);
  const atmosphereRef = useRef<AtmosphereController | null>(null);
  const candleLightRef = useRef<THREE.PointLight | null>(null);
  const accentLightRef = useRef<THREE.PointLight | null>(null);
  const prevExtinguishedRef = useRef<boolean>(isExtinguished);
  const onFallbackRef = useRef(onFallbackTo2D);
  onFallbackRef.current = onFallbackTo2D;

  // 60fps 订阅环境声波总线，驱动 3D 烛火微颤与氛围光呼吸
  useEffect(() => {
    if (!isListeningSound) {
      liveStateRef.current.soundLevel = 0;
      return;
    }
    return subscribeBlowVisual((frame) => {
      liveStateRef.current.soundLevel = frame.active ? frame.soundLevel : 0;
    });
  }, [isListeningSound]);

  // 1. 初始化 Three.js WebGLRenderer、相机、光照、轨道控制与主渲染循环
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      onFallbackRef.current(err instanceof Error ? err.message : "WebGLRenderer init failed");
      return;
    }

    const isHigh = tier === "high";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isHigh ? 2 : 1.5));
    renderer.setSize(container.clientWidth || 500, container.clientHeight || 500);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isHigh ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

    const domEl = renderer.domElement;
    domEl.style.width = "100%";
    domEl.style.height = "100%";
    domEl.style.display = "block";
    domEl.style.touchAction = "none";
    container.innerHTML = "";
    container.appendChild(domEl);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onFallbackRef.current("WebGL context lost");
    };
    domEl.addEventListener("webglcontextlost", handleContextLost, false);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 使用 RoomEnvironment 提供高级烘焙光泽与金属反射环境贴图
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.42;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0, 2.95, 6.15);

    const controls = new OrbitControls(camera, domEl);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.6;
    controls.maxDistance = 8.6;
    controls.minPolarAngle = Math.PI * 0.16;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0.9, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.72;
    controls.update();

    let resumeRotateTimer: number | null = null;
    const onControlStart = () => {
      setHasInteracted(true);
      controls.autoRotate = false;
      if (resumeRotateTimer !== null) {
        clearTimeout(resumeRotateTimer);
        resumeRotateTimer = null;
      }
    };
    const onControlEnd = () => {
      resumeRotateTimer = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 4500);
    };
    controls.addEventListener("start", onControlStart);
    controls.addEventListener("end", onControlEnd);

    // 柔和影棚布光系统
    const hemiLight = new THREE.HemisphereLight(0xffe9f3, 0x1e1b4b, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.35);
    keyLight.position.set(3.8, 6.2, 4.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(isHigh ? 1024 : 512, isHigh ? 1024 : 512);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.6;
    keyLight.shadow.camera.bottom = -2.4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf472b6, 0.65);
    rimLight.position.set(-4.2, 3.2, -3.6);
    scene.add(rimLight);

    // 动态烛火主暖光源（随火焰摇曳与吹灭实时变化）
    const candleLight = new THREE.PointLight(0xffaa44, 4.2, 10, 1.5);
    candleLight.position.set(0, 2.35, 0.25);
    scene.add(candleLight);
    candleLightRef.current = candleLight;

    // 庆祝氛围彩色补光（吹灭蜡烛后渐亮，赋予梦幻庆生氛围）
    const accentLight = new THREE.PointLight(0xf472b6, 0.4, 12, 1.4);
    accentLight.position.set(0, 3.1, 2.2);
    scene.add(accentLight);
    accentLightRef.current = accentLight;

    // 氛围层：串灯、仙尘、桌饰与 3D 礼花
    const atmosphere = buildAtmosphereController(tier);
    scene.add(atmosphere.group);
    atmosphereRef.current = atmosphere;

    // 响应式容器尺寸监听
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // 60fps 动画循环
    const clock = new THREE.Clock();
    let rafId = 0;
    let currentCandleIntensity = liveStateRef.current.isExtinguished ? 0 : 4.2;
    let currentAccentIntensity = liveStateRef.current.isExtinguished ? 3.2 : 0.4;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;
      const live = liveStateRef.current;

      // 更新蜡烛火焰与青烟
      let flameFactor = 0;
      if (candlesCtrlRef.current) {
        flameFactor = candlesCtrlRef.current.update(dt, elapsed, {
          isExtinguished: live.isExtinguished,
          isBlowing: live.isBlowing,
          blowingProgress: live.blowingProgress,
          soundLevel: live.soundLevel,
        });
      }

      // 动态更新烛光与庆祝灯光
      const targetCandleIntensity = live.isExtinguished
        ? 0
        : (3.6 + Math.sin(elapsed * 11) * 0.35 + live.soundLevel * 1.1) * flameFactor;
      currentCandleIntensity += (targetCandleIntensity - currentCandleIntensity) * Math.min(1, dt * 10);
      candleLight.intensity = currentCandleIntensity;
      candleLight.position.x = Math.sin(elapsed * 6.5) * 0.08;
      candleLight.position.z = 0.25 + Math.cos(elapsed * 5.2) * 0.08;

      const targetAccent = live.isExtinguished ? 3.6 + Math.sin(elapsed * 2.4) * 0.6 : 0.45;
      currentAccentIntensity += (targetAccent - currentAccentIntensity) * Math.min(1, dt * 3);
      accentLight.intensity = currentAccentIntensity;

      // 吹灭后环境光略转向梦幻温暖庆祝色调
      const targetKey = live.isExtinguished ? 1.55 : 1.28;
      keyLight.intensity += (targetKey - keyLight.intensity) * Math.min(1, dt * 2.5);

      // 更新氛围与 3D 彩带
      atmosphere.update(dt, elapsed, live.isExtinguished, live.soundLevel);

      // 轻微旋转速度随庆祝状态更有活力
      controls.autoRotateSpeed = live.isExtinguished ? 1.15 : 0.68;
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      if (resumeRotateTimer !== null) clearTimeout(resumeRotateTimer);
      resizeObserver.disconnect();
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("end", onControlEnd);
      controls.dispose();
      domEl.removeEventListener("webglcontextlost", handleContextLost);

      if (cakeResultRef.current) {
        scene.remove(cakeResultRef.current.group);
        cakeResultRef.current.dispose();
        cakeResultRef.current = null;
      }
      if (candlesCtrlRef.current) {
        scene.remove(candlesCtrlRef.current.group);
        candlesCtrlRef.current.dispose();
        candlesCtrlRef.current = null;
      }
      if (atmosphereRef.current) {
        scene.remove(atmosphereRef.current.group);
        atmosphereRef.current.dispose();
        atmosphereRef.current = null;
      }

      envRT.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [tier]);

  // 2. 重建 3D 蛋糕模型与蜡烛（仅当蛋糕款式、自定义图、名字或蜡烛配置改变时触发）
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 清理旧蛋糕与旧蜡烛
    if (cakeResultRef.current) {
      scene.remove(cakeResultRef.current.group);
      cakeResultRef.current.dispose();
      cakeResultRef.current = null;
    }
    if (candlesCtrlRef.current) {
      scene.remove(candlesCtrlRef.current.group);
      candlesCtrlRef.current.dispose();
      candlesCtrlRef.current = null;
    }

    const builtCake = buildCakeAssembly({
      cakeId,
      customImage,
      userName,
      lang,
    });
    scene.add(builtCake.group);
    cakeResultRef.current = builtCake;

    if (accentLightRef.current) {
      accentLightRef.current.color.setHex(builtCake.accentColor);
    }

    const builtCandles = buildCandlesController({
      candleType,
      candleCount,
      digits,
      surfaceY: builtCake.candleSurfaceY,
      maxRadius: builtCake.candleMaxRadius,
      initialExtinguished: liveStateRef.current.isExtinguished,
    });
    scene.add(builtCandles.group);
    candlesCtrlRef.current = builtCandles;

    if (candleLightRef.current) {
      candleLightRef.current.position.y = builtCandles.flameCenterY + 0.25;
    }
  }, [cakeId, customImage, userName, lang, candleType, candleCount, digits, tier]);

  // 3. 监听吹灭瞬间或手动“再放礼花”触发 3D 立体礼花彩带爆发
  useEffect(() => {
    if (isExtinguished && !prevExtinguishedRef.current) {
      atmosphereRef.current?.triggerCelebrationBurst();
    }
    prevExtinguishedRef.current = isExtinguished;
  }, [isExtinguished]);

  useEffect(() => {
    if (cheerBurstKey > 0) {
      atmosphereRef.current?.triggerCelebrationBurst();
    }
  }, [cheerBurstKey]);

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label={lang === "zh" ? "3D 互动生日蛋糕，可拖动旋转查看" : "Interactive 3D Birthday Cake"}
      />
      {/* 首次进入时的 360° 互动小提示 */}
      {!hasInteracted && !isExtinguished && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900/55 backdrop-blur-md border border-white/15 text-[11px] text-white/75 tracking-wide flex items-center gap-1.5 animate-fade-in-up">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span>{lang === "zh" || lang === "zh-Hant" ? "拖动 360° 欣赏蛋糕" : "Drag to rotate 360°"}</span>
        </div>
      )}
    </div>
  );
};

export default CakeScene3D;
