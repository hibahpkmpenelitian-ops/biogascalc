import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100vh-90px)] max-[850px]:min-h-[calc(100vh-72px)] flex items-center"
      style={{ backgroundColor: "#001e2b" }}
    >
      <div className="container py-16 max-[850px]:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── KIRI: Headline & CTA ── */}
          <div>
            <span
              className="badge badge-green-soft inline-flex mb-6"
              style={{ backgroundColor: "rgba(0,237,100,0.12)", color: "#9fe870" }}
            >
              Alat Bantu Riset PKM
            </span>

            <h1
              className="text-hero-display max-[1024px]:text-display-lg max-[600px]:text-heading-1"
              style={{ color: "#ffffff" }}
            >
              Hitung Potensi Biogas Anda Secara Instan
            </h1>

            <p
              className="text-subtitle mt-6"
              style={{ color: "#a8b3bc", maxWidth: "28rem" }}
            >
              Estimasi produksi biogas dari limbah organik dalam hitungan detik —
              berbasis data riset, gratis, dan mudah digunakan.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link to="/kalkulator-limbah" className="btn btn-on-dark">
                Mulai Hitung
              </Link>
              <Link to="/rancang-dome" className="btn btn-secondary-on-dark">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          {/* ── KANAN: Kartu preview kalkulator di atas foto instalasi ── */}
          <div className="relative">
            <div
              className="rounded-xl overflow-hidden"
              style={{ boxShadow: "var(--shadow-4)" }}
            >
              <img
                src="/hero-card.png"
                alt="Instalasi biogas rumah tangga di lingkungan pedesaan"
                className="w-full h-full object-cover"
                style={{ aspectRatio: "4 / 3" }}
              />
            </div>

            {/* Kartu data mengambang */}
            <div
              className="card-platform absolute max-[600px]:static max-[600px]:mt-[-2rem]"
              style={{
                bottom: -28,
                left: -24,
                width: 240,
              }}
            >
              <p className="text-caption" style={{ color: "#a8b3bc" }}>
                Input limbah
              </p>
              <p className="text-heading-3" style={{ color: "#ffffff" }}>
                250 kg/hari
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", margin: "12px 0" }} />
              <p className="text-caption" style={{ color: "#a8b3bc" }}>
                Estimasi biogas
              </p>
              <p className="text-heading-3" style={{ color: "#9fe870" }}>
                ≈ 45 m³/hari
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
