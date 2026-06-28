import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import {
  hemisphereProfile,
  semiEllipsoidProfile,
  customProfile,
  slurryCapProfile,
  buildLathe,
} from "../../utils/geometry";


/* ── Dome mesh ───────────────────────────────────────────────*/
function DomeMesh({ shapeType, radius, domeHeight }) {
  const geometry = useMemo(() => {
    let profile;
    if (shapeType === "hemisphere") {
      profile = hemisphereProfile(radius);
    } else if (shapeType === "semiEllipsoid") {
      profile = semiEllipsoidProfile(radius, domeHeight);
    } else {
      profile = customProfile(radius, domeHeight);
    }
    return buildLathe(profile, 80);
  }, [shapeType, radius, domeHeight]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow>
      {/* Outer shell — dark teal, wireframe-ish transparent */}
      <meshPhysicalMaterial
        color="#001e2b"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        roughness={0.1}
        metalness={0.05}
        transmission={0.6}
      />
    </mesh>
  );
}

/* ── Dome wireframe ──────────────────────────────────────────*/
function DomeWireframe({ shapeType, radius, domeHeight }) {
  const geometry = useMemo(() => {
    let profile;
    if (shapeType === "hemisphere") {
      profile = hemisphereProfile(radius, 32);
    } else if (shapeType === "semiEllipsoid") {
      profile = semiEllipsoidProfile(radius, domeHeight, 32);
    } else {
      profile = customProfile(radius, domeHeight, 32);
    }
    return buildLathe(profile, 32);
  }, [shapeType, radius, domeHeight]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#00ed64"
        wireframe
        transparent
        opacity={0.18}
      />
    </mesh>
  );
}

/* ── Slurry cap ──────────────────────────────────────────────*/
function SlurryMesh({ shapeType, radius, domeHeight, slurryHeight }) {
  const geometry = useMemo(() => {
    const profile = slurryCapProfile(
      shapeType === "hemisphere" ? "hemisphere" : "semiEllipsoid",
      radius,
      domeHeight,
      slurryHeight
    );
    return buildLathe(profile, 80);
  }, [shapeType, radius, domeHeight, slurryHeight]);

  if (!geometry || slurryHeight <= 0) return null;

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color="#00a35c"
        transparent
        opacity={0.55}
        roughness={0.2}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Slurry surface plane (top face) ─────────────────────────*/
function SlurrySurface({ shapeType, radius, domeHeight, slurryHeight }) {
  const surfaceRadius = useMemo(() => {
    if (slurryHeight <= 0) return 0;
    const r = radius;
    if (shapeType === "hemisphere") {
      return Math.sqrt(Math.max(0, r * r - (r - slurryHeight) ** 2));
    }
    const a = radius, b = domeHeight > 0 ? domeHeight : radius;
    return a * Math.sqrt(Math.max(0, 1 - (slurryHeight / b) ** 2));
  }, [shapeType, radius, domeHeight, slurryHeight]);

  if (slurryHeight <= 0 || surfaceRadius <= 0) return null;

  return (
    <mesh position={[0, slurryHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[surfaceRadius, 80]} />
      <meshPhysicalMaterial
        color="#00ed64"
        transparent
        opacity={0.45}
        roughness={0.05}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ── Base ring (floor disc) ──────────────────────────────────*/
function BaseRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.06, 80]} />
      <meshBasicMaterial color="#001e2b" transparent opacity={0.25} />
    </mesh>
  );
}

/* ── Animated subtle rotation helper ────────────────────────*/
function AutoRotate({ enabled }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current && enabled) {
      ref.current.rotation.y += delta * 0.08;
    }
  });
  return <group ref={ref} />;
}

/* ── Height dimension line ───────────────────────────────────*/
function DimensionLines({ radius, domeHeight }) {
  const maxH = domeHeight;

  const lineGeo = useMemo(() => {
    const pts = [
      new THREE.Vector3(radius + 0.3, 0, 0),
      new THREE.Vector3(radius + 0.3, maxH, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius, maxH]);

  return (
    <line geometry={lineGeo}>
      <lineBasicMaterial color="#001e2b" transparent opacity={0.3} />
    </line>
  );
}

/* ── Scene (inside Canvas) ───────────────────────────────────*/
function Scene({ calc, params }) {
  const { radius, domeHeight, slurryHeight, shape } = calc;

  const camDistance = Math.max(radius, domeHeight) * 3.5;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[camDistance, camDistance * 0.6, camDistance]}
        fov={40}
      />

      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
      <directionalLight position={[-6, 4, -8]} intensity={0.4} color="#c3f0d2" />

      <group>
        <DomeMesh     shapeType={params.shapeType} radius={radius} domeHeight={domeHeight} />
        <DomeWireframe shapeType={params.shapeType} radius={radius} domeHeight={domeHeight} />
        <SlurryMesh   shapeType={params.shapeType} radius={radius} domeHeight={domeHeight} slurryHeight={slurryHeight} />
        <SlurrySurface shapeType={params.shapeType} radius={radius} domeHeight={domeHeight} slurryHeight={slurryHeight} />
        <BaseRing     radius={radius} />
        <DimensionLines radius={radius} domeHeight={domeHeight} />
      </group>

      <Grid
        position={[0, -0.01, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#c1ccd6"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#a8b3bc"
        fadeDistance={40}
        fadeStrength={1.5}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minDistance={1}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 + 0.1}
        target={[0, domeHeight / 2, 0]}
      />
    </>
  );
}

/* ── Main export ─────────────────────────────────────────────*/
export default function DomeVisualizer({ calc, params }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 420,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e1e5e8",
        backgroundColor: "#f9fbfa",
        position: "relative",
      }}
    >
      <Canvas shadows gl={{ antialias: true, alpha: false }} style={{ background: "#f0f4f2" }}>
        <Scene calc={calc} params={params} />
      </Canvas>

      {/* Controls hint */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          display: "flex",
          gap: 6,
          pointerEvents: "none",
        }}
      >
        {["Drag: Putar", "Scroll: Zoom", "Shift+Drag: Pan"].map((t) => (
          <span
            key={t}
            style={{
              fontSize: "0.6875rem",
              padding: "3px 8px",
              borderRadius: 9999,
              backgroundColor: "rgba(0,30,43,0.55)",
              color: "#ffffff",
              backdropFilter: "blur(4px)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
