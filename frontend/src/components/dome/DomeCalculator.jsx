import { useState } from "react";
import { useDomeCalculations } from "../../hooks/useDomeCalculations";
import ParameterPanel  from "./ParameterPanel";
import DomeVisualizer  from "./DomeVisualizer";
import StatsPanel      from "./StatsPanel";

const DEFAULT_PARAMS = {
  diameter:  6,
  height:    4,
  slurryPct: 30,
  shapeType: "hemisphere",
};

export default function DomeCalculator() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const calc = useDomeCalculations(params);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Title row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-micro-uppercase mb-0.5" style={{ color: "#00684a" }}>
            Rancang Dome
          </p>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 500, color: "#001e2b" }}>
            3D Dome Visualizer
          </h1>
        </div>
        <span
          style={{
            fontSize: "0.8125rem",
            padding: "4px 12px",
            borderRadius: 9999,
            backgroundColor: "#e3fcef",
            border: "1px solid #c3f0d2",
            color: "#00684a",
            fontWeight: 500,
          }}
        >
          V = {calc.totalVolume.toLocaleString("id-ID")} m³
        </span>
      </div>

      {/* ── Main layout: 2-col desktop / stack mobile ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* ── LEFT: Visualizer (tall) ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ height: "clamp(360px, 55vh, 600px)" }}>
            <DomeVisualizer calc={calc} params={params} />
          </div>
          <ParameterPanel params={params} onChange={setParams} />
        </div>

        {/* ── RIGHT: Stats ── */}
        <StatsPanel calc={calc} params={params} />
      </div>
    </div>
  );
}
