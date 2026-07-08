import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* ── Gradient sky dome (simple, predictable colors) ───────────*/
function SkyDome() {
  const material = useMemo(() => {
    const uniforms = {
      topColor: { value: new THREE.Color("#6fb1e8") },
      bottomColor: { value: new THREE.Color("#dfeff5") },
      offset: { value: 20 },
      exponent: { value: 0.7 },
    };
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
  }, []);

  return (
    <mesh material={material}>
      <sphereGeometry args={[400, 32, 15]} />
    </mesh>
  );
}
import {
  hemisphereProfile,
  semiEllipsoidProfile,
  slurryCapProfile,
  buildLathe,
} from "../../utils/geometry";


/* ── Dome mesh (circular) — solid concrete shell ───────────────*/
function DomeMesh({ radius, domeHeight }) {
  const geometry = useMemo(() => {
    const profile = Math.abs(domeHeight - radius) < 1e-6
      ? hemisphereProfile(radius)
      : semiEllipsoidProfile(radius, domeHeight);
    return buildLathe(profile, 80);
  }, [radius, domeHeight]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#9a9691"
        side={THREE.DoubleSide}
        roughness={0.92}
        metalness={0.02}
      />
    </mesh>
  );
}

/* ── Rectangle dome mesh: box walls + half-cylinder roof ──────*/
function RectangleDomeMesh({ length, width, wallHeight }) {
  const roofRadius = width / 2;

  const wallGeo = useMemo(() => {
    if (wallHeight <= 0) return null;
    const g = new THREE.BoxGeometry(length, wallHeight, width);
    g.translate(0, wallHeight / 2, 0);
    return g;
  }, [length, width, wallHeight]);

  const roofGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(roofRadius, roofRadius, length, 48, 1, false, 0, Math.PI);
    g.rotateZ(Math.PI / 2);
    g.rotateY(Math.PI / 2);
    g.translate(0, wallHeight, 0);
    return g;
  }, [length, roofRadius, wallHeight]);

  return (
    <group>
      {wallGeo && (
        <mesh geometry={wallGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#9a9691" side={THREE.DoubleSide} roughness={0.92} metalness={0.02} />
        </mesh>
      )}
      <mesh geometry={roofGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#a29e98" side={THREE.DoubleSide} roughness={0.92} metalness={0.02} />
      </mesh>
    </group>
  );
}

/* ── Rectangle slurry fill (straight prism up to slurryHeight) ─*/
function RectangleSlurryMesh({ length, width, slurryHeight }) {
  const geometry = useMemo(() => {
    if (slurryHeight <= 0) return null;
    const g = new THREE.BoxGeometry(length, slurryHeight, width);
    g.translate(0, slurryHeight / 2, 0);
    return g;
  }, [length, width, slurryHeight]);

  if (!geometry) return null;

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

/* ── Rectangle slurry surface plane (top face) ────────────────*/
function RectangleSlurrySurface({ length, width, slurryHeight }) {
  if (slurryHeight <= 0) return null;
  return (
    <mesh position={[0, slurryHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[length, width]} />
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

/* ── Rectangle base plate ──────────────────────────────────────*/
function RectangleBase({ length, width }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
      <planeGeometry args={[length + 0.1, width + 0.1]} />
      <meshBasicMaterial color="#001e2b" transparent opacity={0.15} />
    </mesh>
  );
}

/* ── Slurry cap (circular) ─────────────────────────────────────*/
function SlurryMesh({ radius, domeHeight, slurryHeight }) {
  const geometry = useMemo(() => {
    const profile = slurryCapProfile("semiEllipsoid", radius, domeHeight, slurryHeight);
    return buildLathe(profile, 80);
  }, [radius, domeHeight, slurryHeight]);

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

/* ── Slurry surface plane (top face, circular) ────────────────*/
function SlurrySurface({ radius, domeHeight, slurryHeight }) {
  const surfaceRadius = useMemo(() => {
    if (slurryHeight <= 0) return 0;
    const a = radius, b = domeHeight > 0 ? domeHeight : radius;
    return a * Math.sqrt(Math.max(0, 1 - (slurryHeight / b) ** 2));
  }, [radius, domeHeight, slurryHeight]);

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

/* ── Base ring (concrete footing at dome base) ────────────────*/
function BaseRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <ringGeometry args={[radius - 0.05, radius + 0.15, 80]} />
      <meshStandardMaterial color="#8a8680" roughness={0.95} />
    </mesh>
  );
}

/* ── Ground (grass/earth field) ───────────────────────────────*/
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[60, 64]} />
      <meshStandardMaterial color="#5b8a4a" roughness={1} />
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

/* ── Scene (inside Canvas) ───────────────────────────────────*/
function Scene({ calc, params }) {
  const isRectangle = calc.shape === "rectangle";

  const totalHeight = isRectangle
    ? calc.wallHeight + calc.roofRadius
    : calc.domeHeight;
  const footprint = isRectangle
    ? Math.max(calc.length, calc.width)
    : calc.radius;

  const camDistance = Math.max(footprint, totalHeight) * 3.2;
  const shadowExtent = Math.max(footprint * 2, 6);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[camDistance, camDistance * 0.6, camDistance]}
        fov={40}
      />

      <SkyDome />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#bfd9ff", "#5b8a4a", 0.5]} />
      <directionalLight
        position={[footprint * 2.2, footprint * 2.8, footprint * 1.4]}
        intensity={1.6}
        color="#fff4dd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-shadowExtent}
        shadow-camera-right={shadowExtent}
        shadow-camera-top={shadowExtent}
        shadow-camera-bottom={-shadowExtent}
        shadow-camera-near={0.5}
        shadow-camera-far={footprint * 8}
        shadow-bias={-0.0015}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-footprint, footprint * 0.7, -footprint]} intensity={0.25} color="#c3d9ff" />

      <Ground />

      <group>
        {isRectangle ? (
          <>
            <RectangleDomeMesh length={calc.length} width={calc.width} wallHeight={calc.wallHeight} />
            <RectangleSlurryMesh length={calc.length} width={calc.width} slurryHeight={calc.slurryHeight} />
            <RectangleSlurrySurface length={calc.length} width={calc.width} slurryHeight={calc.slurryHeight} />
            <RectangleBase length={calc.length} width={calc.width} />
          </>
        ) : (
          <>
            <DomeMesh     radius={calc.radius} domeHeight={calc.domeHeight} />
            <SlurryMesh   radius={calc.radius} domeHeight={calc.domeHeight} slurryHeight={calc.slurryHeight} />
            <SlurrySurface radius={calc.radius} domeHeight={calc.domeHeight} slurryHeight={calc.slurryHeight} />
            <BaseRing     radius={calc.radius} />
          </>
        )}
      </group>

      <Grid
        position={[0, 0.005, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#3f5c33"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#2f4527"
        fadeDistance={35}
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
        target={[0, totalHeight / 2, 0]}
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
