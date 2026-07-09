import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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

/* ── node — icon lights up from grey to emerald once the glowing line reaches it ── */
function StepNode({ Icon, progress, threshold }) {
  const bg = useTransform(
    progress,
    [Math.max(threshold - 0.06, 0), threshold],
    ["#e2e8f0", "#059669"]
  );
  const color = useTransform(
    progress,
    [Math.max(threshold - 0.06, 0), threshold],
    ["#94a3b8", "#ffffff"]
  );
  const boxShadow = useTransform(
    progress,
    [Math.max(threshold - 0.06, 0), threshold],
    ["0 0px 0px rgba(16,185,129,0)", "0 8px 20px -6px rgba(16,185,129,0.55)"]
  );

  return (
    <motion.div
      className="absolute z-10 flex items-center justify-center w-12 h-12 rounded-full left-6 -translate-x-1/2 md:left-1/2 top-0 md:-top-1"
      style={{ background: bg, boxShadow }}
    >
      <motion.span style={{ color }} className="flex">
        <Icon size={20} strokeWidth={2.25} />
      </motion.span>
    </motion.div>
  );
}

export default function HowItWorks() {
  const trackRef = useRef(null);

  // ── site scrolls inside SiteFrame's custom container (Lenis-driven),
  // not `window` — useScroll needs that container passed explicitly ──
  const [scrollContainer, setScrollContainer] = useState(null);
  useEffect(() => {
    setScrollContainer({ current: document.querySelector(".site-frame-scroll") });
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    container: scrollContainer ?? undefined,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-5xl mx-auto px-8 max-[767px]:px-4 relative">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
            <Workflow size={15} strokeWidth={2.25} />
            Cara Kerja
          </span>
          <h2 className="font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-slate-900">
            Empat Langkah Menuju Estimasi Biogas
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-slate-700 max-w-144 mx-auto">
            Proses yang sederhana dan cepat — dari input data hingga rancangan
            reaktor, semua dalam satu alur.
          </p>
        </Reveal>

        <div ref={trackRef} className="relative mt-20 max-[850px]:mt-14">
          {/* center track (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-200"
          />
          <motion.div
            aria-hidden="true"
            className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-0.5 origin-top bg-emerald-500"
            style={{ scaleY: lineScale, height: "100%" }}
          />
          {/* left track (mobile) */}
          <div
            aria-hidden="true"
            className="md:hidden absolute top-0 bottom-0 left-6 w-0.5 bg-slate-200"
          />
          <motion.div
            aria-hidden="true"
            className="md:hidden absolute top-0 left-6 w-0.5 origin-top bg-emerald-500"
            style={{ scaleY: lineScale, height: "100%" }}
          />

          <div className="flex flex-col gap-14 max-[850px]:gap-10">
            {STEPS.map((item, i) => {
              const Icon = item.icon;
              const isEven = i % 2 === 1;
              const threshold = (i + 0.5) / STEPS.length;
              return (
                <Reveal key={item.step} delay={0.08 * (i + 1)} className="relative">
                  <StepNode Icon={Icon} progress={progress} threshold={threshold} />

                  <div
                    className={`pl-20 md:pl-0 md:w-1/2 ${
                      isEven ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"
                    }`}
                  >
                    <div
                      className={`rounded-[22px] border border-emerald-600/8 bg-emerald-50 p-6 ${
                        isEven ? "" : "md:ml-auto"
                      }`}
                    >
                      <p className="font-bold text-[13px] tracking-[0.08em] text-emerald-700">
                        LANGKAH {item.step}
                      </p>
                      <h3 className="font-semibold mt-1 text-lg text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-500">
                        {item.desc}
                      </p>

                      <div
                        className="mt-5 flex items-center justify-center h-32 rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.04))",
                        }}
                      >
                        <Icon
                          size={44}
                          strokeWidth={1.5}
                          className="text-emerald-600/70"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
