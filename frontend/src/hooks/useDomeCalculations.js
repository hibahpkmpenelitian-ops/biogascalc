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

/* ── Volume of dome interior up to height h ──────────────────*/
function capVolume(shapeType, radius, domeHeight, h) {
  if (h <= 0) return 0;
  if (shapeType === "hemisphere") {
    const r = radius;
    const hc = Math.min(h, r);
    // Spherical cap from bottom: V = π(r²hc − hc³/3)
    return Math.PI * (r * r * hc - (hc * hc * hc) / 3);
  } else {
    // Semi-ellipsoid (a=radius, b=domeHeight)
    const a = radius, b = domeHeight > 0 ? domeHeight : radius;
    const hc = Math.min(h, b);
    return Math.PI * a * a * (hc - hc ** 3 / (3 * b * b));
  }
}

/* ── Total dome volume ────────────────────────────────────────*/
function totalVolume(shapeType, radius, domeHeight) {
  if (shapeType === "hemisphere") {
    return (2 / 3) * Math.PI * radius ** 3;
  }
  const a = radius, b = domeHeight > 0 ? domeHeight : radius;
  return (2 / 3) * Math.PI * a * a * b;
}

/* ── Surface area ─────────────────────────────────────────────*/
function surfaceArea(shapeType, radius, domeHeight) {
  if (shapeType === "hemisphere") {
    return 2 * Math.PI * radius ** 2;
  }
  const a = radius, c = domeHeight > 0 ? domeHeight : radius;
  if (Math.abs(a - c) < 1e-9) return 2 * Math.PI * a * a;
  if (c < a) {
    const e = Math.sqrt(1 - (c / a) ** 2);
    return Math.PI * a * a * (1 + (1 - e * e) / e * Math.atanh(e));
  }
  const e = Math.sqrt(1 - (a / c) ** 2);
  return 2 * Math.PI * a * a * (1 + (c / (a * e)) * Math.asin(e));
}

/* ── Slurry height from volume fraction ──────────────────────*/
function slurryHeight(shapeType, radius, domeHeight, volumeFraction) {
  const Vtotal = totalVolume(shapeType, radius, domeHeight);
  const Vslurry = Vtotal * volumeFraction;
  if (Vslurry <= 0) return 0;
  const maxH = shapeType === "hemisphere" ? radius : domeHeight;
  if (Vslurry >= Vtotal) return maxH;

  if (shapeType === "hemisphere") {
    const r = radius;
    const f  = (h) => Math.PI * (r * r * h - h ** 3 / 3) - Vslurry;
    const df = (h) => Math.PI * (r * r - h * h);
    return solveHeight(f, df, maxH * volumeFraction);
  } else {
    const a = radius, b = domeHeight > 0 ? domeHeight : radius;
    const f  = (h) => Math.PI * a * a * (h - h ** 3 / (3 * b * b)) - Vslurry;
    const df = (h) => Math.PI * a * a * (1 - h * h / (b * b));
    return solveHeight(f, df, maxH * volumeFraction);
  }
}

/* ═══════════════════════════════════════════════════════════ */

export function useDomeCalculations({ diameter, height, slurryPct, shapeType }) {
  return useMemo(() => {
    const radius     = Math.max(0.01, diameter / 2);
    const domeHeight = Math.max(0.01, height);
    const fraction   = Math.min(1, Math.max(0, slurryPct / 100));
    const shape      = shapeType === "hemisphere" ? "hemisphere" : "semiEllipsoid";

    const Vtotal   = totalVolume(shape, radius, domeHeight);
    const SA       = surfaceArea(shape, radius, domeHeight);
    const Vslurry  = Vtotal * fraction;
    const hSlurry  = slurryHeight(shape, radius, domeHeight, fraction);
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
      shape,
    };
  }, [diameter, height, slurryPct, shapeType]);
}
