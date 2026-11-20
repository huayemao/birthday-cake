"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CandleType, CardStyle, Language, SceneTheme } from "@/types";
import { WebGLTier } from "@/utils/webglSupport";
import { subscribeBlowVisual } from "@/utils/soundVisualBus";
import { buildCakeAssembly, BuiltCakeResult } from "./cake3d/cakeModels";
import { buildCandlesController, BuiltCandlesController } from "./cake3d/candles3d";
import { buildAtmosphereController, AtmosphereController } from "./cake3d/atmosphere3d";
import FloatingScenePill from "./FloatingScenePill";

export interface CakeScene3DProps {
  cakeId: string;
  customImage?: string;
  candleType: CandleType;
  candleCount: number;
  digits: string;
  userName: string;
  customMessage?: string;
  giverName?: string;
  cardStyle?: CardStyle;
  sceneTheme?: SceneTheme;
  lang: Language;
  isExtinguished: boolean;
  isBlowing: boolean;
  blowingProgress: number;
  isListeningSound: boolean;
  tier: WebGLTier;
  interactive?: boolean;
  showDragHint?: boolean;
  cameraDistanceScale?: number;
  targetYOffset?: number;
  cheerBurstKey?: number;
  onStageTap?: () => void;
  onFallbackTo2D: (reason?: string) => void;
}

const CakeScene3D: React.FC<CakeScene3DProps> = ({
  cakeId,
  customImage,
  candleType,
  candleCount,
  digits,
  userName,
  customMessage = "",
  giverName = "",
  cardStyle = "cream-rose",
  sceneTheme = "fairy-lights",
  lang,
  isExtinguished,
  isBlowing,
  blowingProgress,
  isListeningSound,
  tier,
  interactive = true,
  showDragHint = true,
  cameraDistanceScale = 1,
  targetYOffset = 0,
  cheerBurstKey = 0,
  onStageTap,
  onFallbackTo2D,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const liveStateRef = useRef({
    isExtinguished,
    isBlowing,
    blowingProgress,
    isListeningSound,
    soundLevel: 0,
    interactive,
    cameraDistanceScale,
    targetYOffset,
  });

  liveStateRef.current.isExtinguished = isExtinguished;
  liveStateRef.current.isBlowing = isBlowing;
  liveStateRef.current.blowingProgress = blowingProgress;
  liveStateRef.current.isListeningSound = isListeningSound;
  liveStateRef.current.interactive = interactive;
  liveStateRef.current.cameraDistanceScale = cameraDistanceScale;
  liveStateRef.current.targetYOffset = targetYOffset;

  const plaqueTextRef = useRef({ userName, customMessage, giverName, cardStyle, lang });
  plaqueTextRef.current = { userName, customMessage, giverName, cardStyle, lang };
  const sceneThemeRef = useRef<SceneTheme>(sceneTheme);
  sceneThemeRef.current = sceneTheme;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const computeIdealDistanceRef = useRef<((w: number, h: number) => number) | null>(null);
  const cakeResultRef = useRef<BuiltCakeResult | null>(null);
  const candlesCtrlRef = useRef<BuiltCandlesController | null>(null);
  const atmosphereRef = useRef<AtmosphereController | null>(null);
  const candleLightRef = useRef<THREE.PointLight | null>(null);
  const accentLightRef = useRef<THREE.PointLight | null>(null);
  const prevExtinguishedRef = useRef<boolean>(isExtinguished);
  const onFallbackRef = useRef(onFallbackTo2D);
  const onStageTapRef = useRef(onStageTap);
  onFallbackRef.current = onFallbackTo2D;
  onStageTapRef.current = onStageTap;

  // 60fps 订阅环境声波总线
  useEffect(() => {
    if (!isListeningSound) {
      liveStateRef.current.soundLevel = 0;
      return;
    }
    return subscribeBlowVisual((frame) => {
      liveStateRef.current.soundLevel = frame.active ? frame.soundLevel : 0;
    });
  }, [isListeningSound]);

  // 实时同步 interactive / 视角缩放与目标高度（例如从主页预览切入正式庆生场景时）
  useEffect(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const container = containerRef.current;
    const computeDist = computeIdealDistanceRef.current;

    if (controls) {
      controls.enabled = interactive;
      controls.enableZoom = interactive;
      controls.enableRotate = interactive;
    }
    const canvas = container?.querySelector("canvas");
    if (canvas) {
      canvas.style.touchAction = interactive ? "none" : "pan-y";
      canvas.style.pointerEvents = interactive ? "auto" : "none";
    }

    if (camera && controls && container && computeDist) {
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      const idealDist = computeDist(w, h);
      const targetY = 1.02 + targetYOffset;
      controls.target.set(0, targetY, 0);
      controls.maxDistance = Math.max(16, idealDist * 1.45);
      const dir = camera.position.clone().sub(controls.target);
      if (dir.lengthSq() > 0.0001) {
        dir.normalize();
        camera.position.copy(controls.target).add(dir.multiplyScalar(idealDist));
      } else {
        camera.position.set(0, 2.75 + (idealDist - 6.15) * 0.25, idealDist);
      }
      controls.update();
    }
  }, [interactive, cameraDistanceScale, targetYOffset]);

  // 1. 初始化 Three.js WebGLRenderer、均衡柔和影棚光、相机与动画循环
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
    const initW = Math.max(1, container.clientWidth || window.innerWidth);
    const initH = Math.max(1, container.clientHeight || window.innerHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isHigh ? 2 : 1.5));
    renderer.setSize(initW, initH);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92; // 克制均衡曝光，保留丰富粉彩层次，彻底告别过曝发白
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isHigh ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

    const domEl = renderer.domElement;
    domEl.style.width = "100%";
    domEl.style.height = "100%";
    domEl.style.display = "block";
    domEl.style.touchAction = liveStateRef.current.interactive ? "none" : "pan-y";
    domEl.style.pointerEvents = liveStateRef.current.interactive ? "auto" : "none";
    container.innerHTML = "";
    container.appendChild(domEl);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onFallbackRef.current("WebGL context lost");
    };
    domEl.addEventListener("webglcontextlost", handleContextLost, false);

    let downX = 0;
    let downY = 0;
    let downTime = 0;
    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
      downTime = performance.now();
    };
    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      const elapsedMs = performance.now() - downTime;
      if (dist < 10 && elapsedMs < 350) {
        onStageTapRef.current?.();
      }
    };
    domEl.addEventListener("pointerdown", onPointerDown);
    domEl.addEventListener("pointerup", onPointerUp);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.36;

    const camera = new THREE.PerspectiveCamera(34, initW / initH, 0.1, 55);
    cameraRef.current = camera;

    const computeIdealDistance = (w: number, h: number) => {
      const aspect = w / Math.max(1, h);
      const portraitBoost = aspect < 0.95 ? Math.min(3.3, (0.95 - aspect) * 5.6) : 0;
      return (6.15 + portraitBoost) * liveStateRef.current.cameraDistanceScale;
    };
    computeIdealDistanceRef.current = computeIdealDistance;

    const startDist = computeIdealDistance(initW, initH);
    const baseTargetY = 1.02 + liveStateRef.current.targetYOffset;
    camera.position.set(0, 2.75 + (startDist - 6.15) * 0.25, startDist);

    const controls = new OrbitControls(camera, domEl);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enabled = liveStateRef.current.interactive;
    controls.enableZoom = liveStateRef.current.interactive;
    controls.enableRotate = liveStateRef.current.interactive;
    controls.minDistance = 4.2;
    controls.maxDistance = Math.max(16, startDist * 1.45);
    controls.minPolarAngle = Math.PI * 0.14;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, baseTargetY, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.62;
    controls.update();
    controlsRef.current = controls;

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
      }, 4200);
    };
    controls.addEventListener("start", onControlStart);
    controls.addEventListener("end", onControlEnd);

    // ===== 均衡立体感甜品灯光（柔和、通透、绝不过曝） =====
    const hemiLight = new THREE.HemisphereLight(0xfff5f8, 0x3b2f4a, 0.58);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.05);
    keyLight.position.set(3.6, 6.2, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(isHigh ? 1024 : 512, isHigh ? 1024 : 512);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.4;
    keyLight.shadow.camera.right = 3.4;
    keyLight.shadow.camera.top = 3.8;
    keyLight.shadow.camera.bottom = -2.0;
    keyLight.shadow.bias = -0.0012;
    keyLight.shadow.normalBias = 0.025;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce8ff, 0.38);
    fillLight.position.set(-4.2, 3.0, 4.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf9a8d4, 0.52);
    rimLight.position.set(-3.0, 4.0, -4.2);
    scene.add(rimLight);

    // 温和烛火暖光（柔和点亮蛋糕顶面，不过度泛白）
    const candleLight = new THREE.PointLight(0xffb454, 1.65, 8.5, 1.8);
    candleLight.position.set(0, 2.35, 0.25);
    scene.add(candleLight);
    candleLightRef.current = candleLight;

    // 吹灭后梦幻庆祝补光
    const accentLight = new THREE.PointLight(0xf472b6, 0.25, 12, 1.5);
    accentLight.position.set(0, 3.1, 2.4);
    scene.add(accentLight);
    accentLightRef.current = accentLight;

    const atmosphere = buildAtmosphereController(tier, sceneThemeRef.current);
    scene.add(atmosphere.group);
    atmosphereRef.current = atmosphere;

    let prevAspect = initW / initH;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width);
        const h = Math.max(1, entry.contentRect.height);
        const nextAspect = w / h;
        camera.aspect = nextAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        if (Math.abs(nextAspect - prevAspect) > 0.12) {
          prevAspect = nextAspect;
          const ideal = computeIdealDistance(w, h);
          controls.maxDistance = Math.max(16, ideal * 1.45);
          const dir = camera.position.clone().sub(controls.target).normalize();
          camera.position.copy(controls.target).add(dir.multiplyScalar(ideal));
        }
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let rafId = 0;
    let currentCandleIntensity = liveStateRef.current.isExtinguished ? 0 : 1.65;
    let currentAccentIntensity = liveStateRef.current.isExtinguished ? 2.4 : 0.25;
    let passiveAngle = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;
      const live = liveStateRef.current;

      let flameFactor = 0;
      if (candlesCtrlRef.current) {
        flameFactor = candlesCtrlRef.current.update(dt, elapsed, {
          isExtinguished: live.isExtinguished,
          isBlowing: live.isBlowing,
          blowingProgress: live.blowingProgress,
          soundLevel: live.soundLevel,
        });
      }

      const targetCandleIntensity = live.isExtinguished
        ? 0
        : (1.55 + Math.sin(elapsed * 11) * 0.18 + live.soundLevel * 0.6) * flameFactor;
      currentCandleIntensity += (targetCandleIntensity - currentCandleIntensity) * Math.min(1, dt * 10);
      candleLight.intensity = currentCandleIntensity;
      candleLight.position.x = Math.sin(elapsed * 6.5) * 0.08;
      candleLight.position.z = 0.25 + Math.cos(elapsed * 5.2) * 0.08;

      const targetAccent = live.isExtinguished ? 2.5 + Math.sin(elapsed * 2.4) * 0.4 : 0.25;
      currentAccentIntensity += (targetAccent - currentAccentIntensity) * Math.min(1, dt * 3);
      accentLight.intensity = currentAccentIntensity;

      const targetKey = live.isExtinguished ? 1.2 : 1.05;
      keyLight.intensity += (targetKey - keyLight.intensity) * Math.min(1, dt * 2.5);

      atmosphereRef.current?.update(dt, elapsed, live.isExtinguished, live.soundLevel);

      if (!live.interactive) {
        passiveAngle += Math.min(dt, 0.05) * 0.22;
        const dist = computeIdealDistance(
          container.clientWidth || initW,
          container.clientHeight || initH
        );
        const targetY = 1.02 + live.targetYOffset;
        camera.position.set(
          Math.sin(passiveAngle) * dist,
          2.65 + (dist - 6.15) * 0.25 + Math.sin(elapsed * 0.4) * 0.07,
          Math.cos(passiveAngle) * dist
        );
        camera.lookAt(0, targetY, 0);
      } else {
        controls.target.y = 1.02 + live.targetYOffset;
        controls.autoRotateSpeed = live.isExtinguished ? 1.0 : 0.6;
        controls.update();
      }

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
      controlsRef.current = null;
      cameraRef.current = null;
      computeIdealDistanceRef.current = null;
      domEl.removeEventListener("webglcontextlost", handleContextLost);
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("pointerup", onPointerUp);

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

  // 2. 重建 3D 蛋糕模型与蜡烛（仅当蛋糕款式/自定义图/蜡烛配置变化时执行）
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

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

    const pt = plaqueTextRef.current;
    const builtCake = buildCakeAssembly({
      cakeId,
      customImage,
      userName: pt.userName,
      customMessage: pt.customMessage,
      giverName: pt.giverName,
      cardStyle: pt.cardStyle,
      lang: pt.lang,
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
      candleLightRef.current.position.y = builtCandles.flameCenterY + 0.22;
    }
  }, [cakeId, customImage, candleType, candleCount, digits, tier]);

  // 2b. 实时原地刷新蛋糕祝福卡片上的 Name / Message / From 及卡片风格（零闪烁、不重建蛋糕）
  useEffect(() => {
    cakeResultRef.current?.updatePlaque({
      userName,
      customMessage,
      giverName,
      cardStyle,
      lang,
    });
  }, [userName, customMessage, giverName, cardStyle, lang]);

  // 2c. 动态切换 3D 场景环境氛围主题（不重建 WebGLRenderer 与相机）
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (atmosphereRef.current) {
      scene.remove(atmosphereRef.current.group);
      atmosphereRef.current.dispose();
    }
    const nextAtmosphere = buildAtmosphereController(tier, sceneTheme);
    scene.add(nextAtmosphere.group);
    atmosphereRef.current = nextAtmosphere;
  }, [sceneTheme, tier]);

  // 3. 吹灭或手动“再放礼花”触发 3D 立体彩带
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
        className={`w-full h-full ${
          interactive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
        }`}
        aria-label={lang === "zh" ? "3D 互动生日蛋糕" : "Interactive 3D Birthday Cake"}
      />
      {interactive && showDragHint && !hasInteracted && !isExtinguished && (
        <div className="pointer-events-none absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up">
          <FloatingScenePill>
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
          </FloatingScenePill>
        </div>
      )}
    </div>
  );
};

export default CakeScene3D;
