/* ── StatsPanel — calculated results display ─────────────────*/

function StatCard({ label, value, unit, accent = false, sub }) {
  return (
    <div
      style={{
        padding: "0.875rem 1rem",
        borderRadius: 10,
        border: `1px solid ${accent ? "#c3f0d2" : "#e1e5e8"}`,
        backgroundColor: accent ? "#e3fcef" : "#f9fbfa",
      }}
    >
      <p style={{ fontSize: "0.75rem", fontWeight: 500, color: "#7c8c9a", marginBottom: 4 }}>
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span
          style={{
            fontSize: "1.375rem",
            fontWeight: 600,
            color: accent ? "#00684a" : "#001e2b",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
        </span>
        <span style={{ fontSize: "0.8125rem", color: "#a8b3bc" }}>{unit}</span>
      </div>
      {sub && (
        <p style={{ fontSize: "0.75rem", color: "#a8b3bc", marginTop: 2 }}>{sub}</p>
      )}
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-2">
      <div style={{ flex: 1, height: 1, backgroundColor: "#e1e5e8" }} />
      <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#a8b3bc", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "#e1e5e8" }} />
    </div>
  );
}

export default function StatsPanel({ calc, params }) {
  const filledPct = calc.totalVolume > 0
    ? (calc.slurryVolume / calc.totalVolume) * 100
    : 0;
  const gasPct = 100 - filledPct;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e1e5e8",
        borderRadius: 12,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#00684a" }}>
          Hasil Kalkulasi
        </p>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#001e2b" }}>
          Statistik Dome
        </h2>
      </div>

      {/* Volume bar visual */}
      <div>
        <div className="flex justify-between mb-1">
          <span style={{ fontSize: "0.75rem", color: "#5c6c7a" }}>Slurry</span>
          <span style={{ fontSize: "0.75rem", color: "#5c6c7a" }}>Gas</span>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 9999,
            backgroundColor: "#e1e5e8",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              width: `${filledPct}%`,
              backgroundColor: "#00ed64",
              transition: "width 0.3s ease",
            }}
          />
          <div
            style={{
              flex: 1,
              backgroundColor: "#003d4f",
              transition: "flex 0.3s ease",
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: "0.6875rem", color: "#a8b3bc" }}>
            {filledPct.toFixed(1)}%
          </span>
          <span style={{ fontSize: "0.6875rem", color: "#a8b3bc" }}>
            {gasPct.toFixed(1)}%
          </span>
        </div>
      </div>

      <Divider label="Dimensi Dome" />

      {params.shapeType === "rectangle" ? (
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Panjang" value={params.length} unit="cm" />
          <StatCard label="Lebar" value={params.width} unit="cm" />
          <StatCard label="Tinggi" value={params.wallHeight} unit="cm" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            label="Diameter"
            value={params.diameter}
            unit="cm"
          />
          <StatCard
            label="Tinggi"
            value={params.height}
            unit="cm"
          />
        </div>
      )}

      <Divider label="Volume & Luas" />

      <div className="grid grid-cols-1 gap-2">
        <StatCard
          label="Volume Total Dome"
          value={calc.totalVolume}
          unit="m³"
          accent
        />
        <StatCard
          label="Luas Permukaan"
          value={calc.surfaceArea}
          unit="m²"
        />
      </div>

      <Divider label="Distribusi Isi" />

      <div className="grid grid-cols-1 gap-2">
        <StatCard
          label="Volume Slurry"
          value={calc.slurryVolume}
          unit="m³"
          sub={`Tinggi slurry: ${calc.slurryHeight.toFixed(2)} m`}
        />
        <StatCard
          label="Volume Gas"
          value={calc.gasVolume}
          unit="m³"
          accent
          sub={`${gasPct.toFixed(1)}% dari total volume`}
        />
      </div>

      {/* Shape badge */}
      <div className="flex justify-center mt-auto">
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "4px 12px",
            borderRadius: 9999,
            backgroundColor: "#e3fcef",
            color: "#00684a",
            textTransform: "capitalize",
          }}
        >
          {params.shapeType === "rectangle" ? "Rectangle" : "Circular"}
        </span>
      </div>
    </div>
  );
}
