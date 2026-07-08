import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="relative min-h-[calc(100vh-90px)] max-[850px]:min-h-[calc(100vh-72px)] flex items-center bg-[#022c22]"
    >
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 py-16 max-[850px]:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── KIRI: Headline & CTA ── */}
          <div>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-semibold bg-emerald-100 text-emerald-700 mb-6">
              Alat Bantu Riset PKM
            </span>

            <h1 className="text-5xl max-[1024px]:text-4xl max-[600px]:text-3xl font-medium leading-[1.15] tracking-tight text-white">
              Hitung Potensi Biogas Anda Secara Instan
            </h1>

            <p className="text-lg leading-relaxed mt-6 text-slate-300 max-w-[28rem]">
              Estimasi produksi biogas dari limbah organik dalam hitungan detik —
              berbasis data riset, gratis, dan mudah digunakan.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link
                to="/kalkulator-limbah"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Mulai Hitung
              </Link>
              <Link
                to="/rancang-dome"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          {/* ── KANAN: Kartu preview kalkulator di atas foto instalasi ── */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/hero-card.png"
                alt="Instalasi biogas rumah tangga di lingkungan pedesaan"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>

            {/* Kartu data mengambang */}
            <div className="absolute max-[600px]:static max-[600px]:mt-[-2rem] -bottom-7 -left-6 w-60 rounded-2xl p-6 bg-emerald-800 text-white">
              <p className="text-[13px] text-slate-300">Input limbah</p>
              <p className="text-2xl font-semibold text-white">250 kg/hari</p>
              <div className="border-t border-white/10 my-3" />
              <p className="text-[13px] text-slate-300">Estimasi biogas</p>
              <p className="text-2xl font-semibold text-emerald-400">≈ 45 m³/hari</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
