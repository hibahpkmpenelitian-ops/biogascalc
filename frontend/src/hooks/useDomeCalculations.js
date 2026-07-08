import { useMemo } from "react";

/* ── Cubic solver (Newton-Raphson) ────────────────────────────
   Solve f(h) = 0 for slurry height given target volume.
   ------------------------------------------------------------ */
function solveHeight(f, df, initial, maxIter = 50, tol = 1e-9) {
  let h = initial;
  for (let i = 0; i < maxIter; i++) {
    const fh = f(h);
    if (Math.abs(fh) < tol) break;
    const dfh = df(h);
    if (Math.abs(dfh) < 1e-12) break;
    h -= fh / dfh;
    if (h < 0) h = 0;
  }
  return Math.max(0, h);
}

/* ═══════════════════ CIRCULAR DOME (hemisphere) ═══════════════
   diameter & height given in cm, converted to meters internally.
   ------------------------------------------------------------ */
function circularTotalVolume(radius, domeHeight) {
  const r = radius, b = domeHeight > 0 ? domeHeight : radius;
  if (Math.abs(b - r) < 1e-9) return (2 / 3) * Math.PI * r ** 3;
  return (2 / 3) * Math.PI * r * r * b;
}

function circularSurfaceArea(radius, domeHeight) {
  const a = radius, c = domeHeight > 0 ? domeHeight : radius;
  if (Math.abs(a - c) < 1e-9) return 2 * Math.PI * a * a;
  if (c < a) {
    const e = Math.sqrt(1 - (c / a) ** 2);
    return Math.PI * a * a * (1 + (1 - e * e) / e * Math.atanh(e));
  }
  const e = Math.sqrt(1 - (a / c) ** 2);
  return 2 * Math.PI * a * a * (1 + (c / (a * e)) * Math.asin(e));
}

function circularSlurryHeight(radius, domeHeight, volumeFraction) {
  const Vtotal = circularTotalVolume(radius, domeHeight);
  const Vslurry = Vtotal * volumeFraction;
  const maxH = domeHeight;
  if (Vslurry <= 0) return 0;
  if (Vslurry >= Vtotal) return maxH;

  const a = radius, b = domeHeight;
  const f  = (h) => Math.PI * a * a * (h - h ** 3 / (3 * b * b)) - Vslurry;
  const df = (h) => Math.PI * a * a * (1 - h * h / (b * b));
  return solveHeight(f, df, maxH * volumeFraction);
}

/* ═══════════════════ RECTANGLE DOME (box + half-cylinder roof) ═
   length, width, wallHeight given in cm, converted to meters.
   Roof is a half-cylinder: radius = width / 2.
   ------------------------------------------------------------ */
function rectangleTotalVolume(length, width, wallHeight) {
  const roofRadius = width / 2;
  const wallVolume = length * width * wallHeight;
  const roofVolume = (Math.PI * roofRadius * roofRadius * length) / 2;
  return wallVolume + roofVolume;
}

function rectangleSurfaceArea(length, width, wallHeight) {
  const roofRadius = width / 2;
  // Walls: 2 long sides + 2 short ends (rectangle up to wallHeight) + half-cylinder shell
  const longWalls = 2 * (length * wallHeight);
  const shortEnds = 2 * (width * wallHeight);
  const roofShell = Math.PI * roofRadius * length;
  const roofEndCaps = 2 * ((Math.PI * roofRadius * roofRadius) / 2);
  return longWalls + shortEnds + roofShell + roofEndCaps;
}

function rectangleSlurryHeight(length, width, wallHeight, volumeFraction) {
  const Vtotal = rectangleTotalVolume(length, width, wallHeight);
  const Vslurry = Vtotal * volumeFraction;
  if (Vslurry <= 0) return 0;
  if (Vslurry >= Vtotal) return wallHeight;
  // Fill is a straight prism while within the wall (roof only fills after walls are full)
  const h = Vslurry / (length * width);
  return Math.min(h, wallHeight);
}

/* ═══════════════════════════════════════════════════════════ */

export function useDomeCalculations(params) {
  const { shapeType } = params;

  return useMemo(() => {
    const fraction = Math.min(1, Math.max(0, params.slurryPct / 100));

    if (shapeType === "rectangle") {
      const length = Math.max(0.01, params.length / 100);
      const width  = Math.max(0.01, params.width / 100);
      const wallHeight = Math.max(0.01, params.wallHeight / 100);

      const Vtotal  = rectangleTotalVolume(length, width, wallHeight);
      const SA      = rectangleSurfaceArea(length, width, wallHeight);
      const Vslurry = Vtotal * fraction;
      const hSlurry = rectangleSlurryHeight(length, width, wallHeight, fraction);
      const Vgas    = Vtotal - Vslurry;

      return {
        totalVolume:  +Vtotal.toFixed(3),
        surfaceArea:  +SA.toFixed(3),
        slurryVolume: +Vslurry.toFixed(3),
        slurryHeight: +hSlurry.toFixed(3),
        gasVolume:    +Vgas.toFixed(3),
        length, width, wallHeight,
        roofRadius: width / 2,
        fraction,
        shape: "rectangle",
      };
    }

    // Circular
    const radius     = Math.max(0.01, params.diameter / 2 / 100);
    const domeHeight = Math.max(0.01, params.height / 100);

    const Vtotal   = circularTotalVolume(radius, domeHeight);
    const SA       = circularSurfaceArea(radius, domeHeight);
    const Vslurry  = Vtotal * fraction;
    const hSlurry  = circularSlurryHeight(radius, domeHeight, fraction);
    const Vgas     = Vtotal - Vslurry;

    return {
      totalVolume:  +Vtotal.toFixed(3),
      surfaceArea:  +SA.toFixed(3),
      slurryVolume: +Vslurry.toFixed(3),
      slurryHeight: +hSlurry.toFixed(3),
      gasVolume:    +Vgas.toFixed(3),
      radius,
      domeHeight,
      fraction,
      shape: "circular",
    };
  }, [
    shapeType,
    params.slurryPct,
    params.diameter,
    params.height,
    params.length,
    params.width,
    params.wallHeight,
  ]);
}
