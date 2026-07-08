import { ClipboardList, Cog, LineChart, Hammer, Workflow } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Masukkan Data Limbah",
    desc: "Input jenis dan berat limbah organik harian yang tersedia (kg/hari).",
  },
  {
    icon: Cog,
    step: "02",
    title: "Sistem Menghitung Potensi",
    desc: "Kalkulator memproses data menggunakan rasio produksi biogas berbasis riset.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Lihat Estimasi Biogas",
    desc: "Dapatkan hasil estimasi volume biogas (m³/hari) beserta rekomendasi ukuran dome.",
  },
  {
    icon: Hammer,
    step: "04",
    title: "Rancang Reaktor Anda",
    desc: "Gunakan hasil perhitungan untuk merancang dan membangun reaktor biogas sendiri.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
            <Workflow size={15} strokeWidth={2.25} />
            Cara Kerja
          </span>
          <h2 className="font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-slate-900">
            Empat Langkah Menuju Estimasi Biogas
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-slate-700 max-w-144">
            Proses yang sederhana dan cepat — dari input data hingga rancangan
            reaktor, semua dalam satu alur.
          </p>
        </Reveal>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {/* connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-11 left-[12.5%] right-[12.5%] h-0.5 z-0"
            style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.4), rgba(16,185,129,0.08))" }}
          />

          {STEPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={0.08 * (i + 1)}>
                <div className="relative h-full px-6 py-7 rounded-[22px] border border-emerald-600/8 bg-emerald-50">
                  <div
                    className="flex items-center justify-center relative z-10 w-14 h-14 rounded-[18px] text-white"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 8px 20px -6px rgba(16,185,129,0.5)",
                    }}
                  >
                    <Icon size={26} strokeWidth={2.25} />
                  </div>
                  <p className="font-bold mt-5 text-[13px] tracking-[0.08em] text-emerald-700">
                    LANGKAH {item.step}
                  </p>
                  <h3 className="font-semibold mt-1 text-lg text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
