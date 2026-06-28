import { useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── Fix Leaflet default icon paths (Vite asset issue) ────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ── Custom marker icon factory ───────────────────────────── */
const makeIcon = (active = false) =>
  L.divIcon({
    className: "",
    html: `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.268 21.732 0 14 0z"
        fill="${active ? "#00ed64" : "#001e2b"}" />
      <circle cx="14" cy="14" r="6"
        fill="${active ? "#001e2b" : "#00ed64"}" />
    </svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
  });

/* ── Sample location data ─────────────────────────────────── */
const LOCATIONS = [
  {
    id: 1,
    name: "Rumah Potong Hewan Surabaya",
    city: "Surabaya, Jawa Timur",
    lat: -7.2504,
    lng: 112.7688,
    type: "Peternakan",
    limbahPerHari: 2400,
    potensiGas: 840,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Sentra Ternak Bandung Selatan",
    city: "Bandung, Jawa Barat",
    lat: -7.0176,
    lng: 107.6391,
    type: "Peternakan",
    limbahPerHari: 1850,
    potensiGas: 648,
    status: "Potensi",
  },
  {
    id: 3,
    name: "Kebun Sawit Deli Serdang",
    city: "Medan, Sumatera Utara",
    lat: 3.5952,
    lng: 98.6722,
    type: "Perkebunan",
    limbahPerHari: 5200,
    potensiGas: 2080,
    status: "Aktif",
  },
  {
    id: 4,
    name: "Komunitas Ternak Sleman",
    city: "Yogyakarta, DIY",
    lat: -7.7956,
    lng: 110.3695,
    type: "Komunitas",
    limbahPerHari: 960,
    potensiGas: 336,
    status: "Aktif",
  },
  {
    id: 5,
    name: "Industri Tahu Semarang Tengah",
    city: "Semarang, Jawa Tengah",
    lat: -6.9932,
    lng: 110.4203,
    type: "Industri",
    limbahPerHari: 3100,
    potensiGas: 1240,
    status: "Potensi",
  },
  {
    id: 6,
    name: "Perkebunan Kelapa Musi Banyuasin",
    city: "Palembang, Sumatera Selatan",
    lat: -2.9761,
    lng: 104.7754,
    type: "Perkebunan",
    limbahPerHari: 4700,
    potensiGas: 1880,
    status: "Aktif",
  },
  {
    id: 7,
    name: "Peternakan Sapi Gowa",
    city: "Makassar, Sulawesi Selatan",
    lat: -5.1477,
    lng: 119.4327,
    type: "Peternakan",
    limbahPerHari: 1400,
    potensiGas: 490,
    status: "Potensi",
  },
  {
    id: 8,
    name: "Agrowisata Bogor Utara",
    city: "Bogor, Jawa Barat",
    lat: -6.5944,
    lng: 106.7892,
    type: "Komunitas",
    limbahPerHari: 780,
    potensiGas: 273,
    status: "Aktif",
  },
];

/* ── Type badge color mapping ─────────────────────────────── */
const TYPE_COLOR = {
  Peternakan: { bg: "#e3fcef", text: "#00684a" },
  Perkebunan: { bg: "#e8f5e9", text: "#1b5e20" },
  Industri: { bg: "#fff3e0", text: "#e65100" },
  Komunitas: { bg: "#ede7f6", text: "#4527a0" },
};

/* ── Fly-to helper (child component to access map context) ── */
function FlyTo({ target }) {
  const map = useMap();
  if (target) {
    map.flyTo([target.lat, target.lng], 13, { duration: 1.2 });
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════ */

export default function Location() {
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");
  const [flyTarget, setFlyTarget] = useState(null);
  const markersRef = useRef({});

  const filtered = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.type.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectLocation = useCallback((loc) => {
    setActive(loc.id);
    setFlyTarget(loc);
    /* Open popup after fly animation */
    setTimeout(() => {
      markersRef.current[loc.id]?.openPopup();
    }, 1300);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 64px)" }}>
      {/* ── Page header ── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e1e5e8",
          padding: "1.25rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-micro-uppercase mb-1" style={{ color: "#00684a" }}>
                Peta Sebaran
              </p>
              <h1
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 500,
                  color: "#001e2b",
                  lineHeight: 1.3,
                }}
              >
                Lokasi Potensi Biogas
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#e3fcef", border: "1px solid #c3f0d2" }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#00ed64",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#00684a" }}>
                {LOCATIONS.filter((l) => l.status === "Aktif").length} lokasi aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main: sidebar + map ── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <div
          className="w-full lg:w-[340px] flex-shrink-0 overflow-y-auto"
          style={{
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e1e5e8",
            borderBottom: "1px solid #e1e5e8",
          }}
        >
          {/* Search */}
          <div style={{ padding: "1rem", borderBottom: "1px solid #e1e5e8" }}>
            <div style={{ position: "relative" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#a8b3bc",
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Cari lokasi, kota, atau tipe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  paddingLeft: 36,
                  paddingRight: 12,
                  borderRadius: 8,
                  border: "1px solid #c1ccd6",
                  backgroundColor: "#f9fbfa",
                  fontSize: "0.875rem",
                  color: "#001e2b",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#00684a";
                  e.target.style.borderWidth = "2px";
                  e.target.style.backgroundColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#c1ccd6";
                  e.target.style.borderWidth = "1px";
                  e.target.style.backgroundColor = "#f9fbfa";
                }}
              />
            </div>
          </div>

          {/* Location count */}
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #eceff1" }}>
            <p style={{ fontSize: "0.8125rem", color: "#7c8c9a" }}>{filtered.length} lokasi ditemukan</p>
          </div>

          {/* Cards */}
          <ul style={{ listStyle: "none" }}>
            {filtered.length === 0 ? (
              <li style={{ padding: "2rem 1rem", textAlign: "center", color: "#a8b3bc", fontSize: "0.875rem" }}>Tidak ada lokasi yang cocok.</li>
            ) : (
              filtered.map((loc) => {
                const isActive = active === loc.id;
                const badge = TYPE_COLOR[loc.type] ?? { bg: "#f9fbfa", text: "#5c6c7a" };
                return (
                  <li key={loc.id} style={{ borderBottom: "1px solid #eceff1" }}>
                    <button
                      onClick={() => handleSelectLocation(loc)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "1rem",
                        backgroundColor: isActive ? "#f9fbfa" : "#ffffff",
                        borderTop: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        borderLeft: isActive ? "3px solid #00ed64" : "3px solid transparent",
                        cursor: "pointer",
                        transition: "background-color 0.15s, border-color 0.15s",
                        display: "block",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "#f9fbfa";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "#ffffff";
                      }}
                    >
                      {/* Top row: name + status */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "#001e2b",
                            lineHeight: 1.4,
                          }}
                        >
                          {loc.name}
                        </p>
                        <span
                          style={{
                            flexShrink: 0,
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: 9999,
                            backgroundColor: loc.status === "Aktif" ? "#e3fcef" : "#fff8e0",
                            color: loc.status === "Aktif" ? "#00684a" : "#946f3f",
                          }}
                        >
                          {loc.status}
                        </span>
                      </div>

                      {/* City */}
                      <p style={{ fontSize: "0.8125rem", color: "#7c8c9a", marginBottom: "0.625rem" }}>{loc.city}</p>

                      {/* Type badge + stats */}
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 4,
                            backgroundColor: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {loc.type}
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#3d4f5b", fontWeight: 500 }}>
                          {loc.potensiGas.toLocaleString("id-ID")} <span style={{ color: "#a8b3bc", fontWeight: 400 }}>m³/hari</span>
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* ── Map ── */}
        <div className="flex-1 min-h-[400px] lg:min-h-0 relative">
          <MapContainer center={[-2.5, 117.5]} zoom={5} style={{ width: "100%", height: "100%", minHeight: 400 }} scrollWheelZoom>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />

            <FlyTo target={flyTarget} />

            {filtered.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={makeIcon(active === loc.id)}
                ref={(ref) => {
                  if (ref) markersRef.current[loc.id] = ref;
                }}
                eventHandlers={{
                  click: () => handleSelectLocation(loc),
                }}
              >
                <Popup closeButton={false} className="leaflet-popup-biogascalc">
                  <div style={{ minWidth: 220, padding: "4px 2px" }}>
                    {/* Popup header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.625rem",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: loc.status === "Aktif" ? "#00ed64" : "#e0a010",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          color: loc.status === "Aktif" ? "#00684a" : "#946f3f",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {loc.status}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#001e2b",
                        lineHeight: 1.4,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {loc.name}
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "#7c8c9a", marginBottom: "0.75rem" }}>{loc.city}</p>

                    {/* Stats grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                        padding: "0.625rem",
                        backgroundColor: "#f9fbfa",
                        borderRadius: 8,
                        border: "1px solid #e1e5e8",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "0.6875rem", color: "#a8b3bc", marginBottom: 2 }}>Limbah/hari</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#001e2b" }}>{loc.limbahPerHari.toLocaleString("id-ID")} kg</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.6875rem", color: "#a8b3bc", marginBottom: 2 }}>Potensi gas</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#00684a" }}>{loc.potensiGas.toLocaleString("id-ID")} m³</p>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map overlay: summary stats */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              zIndex: 1000,
              backgroundColor: "#ffffff",
              border: "1px solid #e1e5e8",
              borderRadius: 12,
              padding: "0.875rem 1.125rem",
              boxShadow: "rgba(0,30,43,0.08) 0px 4px 12px 0px",
              minWidth: 180,
            }}
          >
            <p className="text-micro-uppercase mb-2" style={{ color: "#7c8c9a" }}>
              Total Potensi
            </p>
            <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "#00684a", lineHeight: 1.1 }}>
              {LOCATIONS.reduce((s, l) => s + l.potensiGas, 0).toLocaleString("id-ID")}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "#a8b3bc", marginTop: 2 }}>m³ gas/hari</p>
          </div>
        </div>
      </div>
    </div>
  );
}
