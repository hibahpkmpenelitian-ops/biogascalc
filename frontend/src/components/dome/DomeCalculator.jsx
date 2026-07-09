import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDomeCalculations } from "../../hooks/useDomeCalculations";
import { clampParamsToVolume } from "../../utils/volumeCap";
import ParameterPanel, { DEFAULT_PARAMS } from "./ParameterPanel";
import DomeVisualizer   from "./DomeVisualizer";
import StatsPanel       from "./StatsPanel";
import MaterialsTable    from "./MaterialsTable";
import LockedOverlay     from "./LockedOverlay";
import LoginModal        from "../modals/LoginModal";
import RegisterModal     from "../modals/RegisterModal";

export default function DomeCalculator() {
  const { user } = useAuth();
  const maxVolume = user ? 40 : 5;

  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [modal, setModal] = useState(null); // 'login' | 'register' | null

  const rawCalc = useDomeCalculations(params);
  const isCapped = rawCalc.totalVolume > maxVolume;
  const cappedParams = isCapped ? clampParamsToVolume(params, rawCalc.totalVolume, maxVolume) : params;
  const cappedCalc = useDomeCalculations(cappedParams);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Title row ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#00684a" }}>
          Rancang Dome
        </p>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 500, color: "#001e2b" }}>
          3D Dome Visualizer
        </h1>
      </div>

      {/* ── Main layout: 2-col desktop / stack mobile ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* ── LEFT: Visualizer (tall) ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ height: "clamp(360px, 55vh, 600px)" }}>
            <DomeVisualizer calc={cappedCalc} params={cappedParams} />
          </div>
          <ParameterPanel params={params} onChange={setParams} />
        </div>

        {/* ── RIGHT: Stats ── */}
        <StatsPanel
          calc={cappedCalc}
          params={params}
          isCapped={isCapped}
          maxVolume={maxVolume}
          user={user}
          onLoginClick={() => setModal("login")}
        />
      </div>

      {/* ── Materials estimate table ── */}
      <LockedOverlay
        locked={!user}
        onLogin={() => setModal("login")}
        onRegister={() => setModal("register")}
        message="Buat akun atau masuk untuk melihat estimasi bahan baku"
      >
        <MaterialsTable calc={cappedCalc} params={cappedParams} />
      </LockedOverlay>

      {/* ── Auth modals ── */}
      <LoginModal open={modal === "login"} onClose={() => setModal(null)} onSwitchToRegister={() => setModal("register")} />
      <RegisterModal open={modal === "register"} onClose={() => setModal(null)} onSwitchToLogin={() => setModal("login")} />
    </div>
  );
}
