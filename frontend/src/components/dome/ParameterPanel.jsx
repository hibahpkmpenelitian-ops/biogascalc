/* ── ParameterPanel — input form for dome parameters ────────── */

const SHAPE_OPTIONS = [
  { value: "circular",  label: "Circular" },
  { value: "rectangle", label: "Rectangle" },
];

const DEFAULT_PARAMS = {
  diameter:   600,
  height:     400,
  length:     600,
  width:      400,
  wallHeight: 200,
  slurryPct:  30,
  shapeType:  "circular",
};

function Field({ label, unit, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#3d4f5b" }}>
          {label}
        </label>
        {unit && (
          <span style={{ fontSize: "0.75rem", color: "#a8b3bc" }}>{unit}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function RangeInput({ value, min, max, step = 1, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="flex-1"
        style={{ accentColor: "#00ed64" }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{
          width: 72,
          height: 36,
          textAlign: "center",
          borderRadius: 8,
          border: "1px solid #c1ccd6",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#001e2b",
          background: "#ffffff",
          outline: "none",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#00684a"; e.target.style.borderWidth = "2px"; }}
        onBlur={(e)  => { e.target.style.borderColor = "#c1ccd6"; e.target.style.borderWidth = "1px"; }}
      />
    </div>
  );
}

export default function ParameterPanel({ params, onChange }) {
  const set = (key) => (val) => onChange({ ...params, [key]: val });
  const isRectangle = params.shapeType === "rectangle";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e1e5e8",
        borderRadius: 12,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#00684a" }}>
          Parameter
        </p>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#001e2b" }}>
          Konfigurasi Dome
        </h2>
      </div>

      <hr style={{ borderColor: "#e1e5e8", margin: 0 }} />

      {/* Shape type */}
      <Field label="Bentuk Dome">
        <div className="grid grid-cols-2 gap-1.5">
          {SHAPE_OPTIONS.map((opt) => {
            const active = params.shapeType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => set("shapeType")(opt.value)}
                style={{
                  padding: "7px 4px",
                  borderRadius: 8,
                  fontSize: "0.8125rem",
                  fontWeight: active ? 600 : 500,
                  border: active ? "1.5px solid #00ed64" : "1px solid #e1e5e8",
                  backgroundColor: active ? "#e3fcef" : "#f9fbfa",
                  color: active ? "#00684a" : "#5c6c7a",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>

      {isRectangle ? (
        <>
          {/* Panjang */}
          <Field label="Panjang (P)" unit="10 – 2000 cm">
            <RangeInput
              value={params.length}
              min={10} max={2000} step={5}
              onChange={set("length")}
            />
          </Field>

          {/* Lebar */}
          <Field label="Lebar (L)" unit="10 – 1500 cm">
            <RangeInput
              value={params.width}
              min={10} max={1500} step={5}
              onChange={set("width")}
            />
          </Field>

          {/* Tinggi dinding */}
          <Field label="Tinggi (T)" unit="10 – 1000 cm">
            <RangeInput
              value={params.wallHeight}
              min={10} max={1000} step={5}
              onChange={set("wallHeight")}
            />
          </Field>
        </>
      ) : (
        <>
          {/* Diameter */}
          <Field label="Diameter" unit="50 – 2000 cm">
            <RangeInput
              value={params.diameter}
              min={50} max={2000} step={5}
              onChange={set("diameter")}
            />
          </Field>

          {/* Height */}
          <Field label="Tinggi Dome" unit="50 – 1500 cm">
            <RangeInput
              value={params.height}
              min={50} max={1500} step={5}
              onChange={set("height")}
            />
          </Field>
        </>
      )}

      {/* Slurry */}
      <Field label="Volume Slurry" unit="0 – 100 %">
        <RangeInput
          value={params.slurryPct}
          min={0} max={100} step={1}
          onChange={set("slurryPct")}
        />
        {/* Slurry fill visual */}
        <div
          className="mt-2 overflow-hidden"
          style={{
            height: 6,
            borderRadius: 9999,
            backgroundColor: "#e1e5e8",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${params.slurryPct}%`,
              borderRadius: 9999,
              backgroundColor: "#00ed64",
              transition: "width 0.2s",
            }}
          />
        </div>
      </Field>

      {/* Reset */}
      <button
        onClick={() => onChange(DEFAULT_PARAMS)}
        style={{
          width: "100%",
          padding: "9px 0",
          borderRadius: 9999,
          fontSize: "0.875rem",
          fontWeight: 600,
          border: "1px solid #c1ccd6",
          backgroundColor: "transparent",
          color: "#3d4f5b",
          cursor: "pointer",
          transition: "all 0.15s",
          marginTop: "auto",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#001e2b"; e.currentTarget.style.backgroundColor = "#f9fbfa"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c1ccd6"; e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        Reset Default
      </button>
    </div>
  );
}

export { DEFAULT_PARAMS };
