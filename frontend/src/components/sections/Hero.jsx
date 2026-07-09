import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

// Tinggi gambar headline tetap (mengikuti tinggi teks) — hanya lebar (aspect ratio)
// yang berganti antara 16:9 dan 4:3, dibolak-balik antar kedua gambar tiap siklus.
// Lebar dihitung dari tinggi tetap agar transisi width murni (tanpa scale transform
// dari layout animation) sehingga gambar tidak "berenang"/distorsi saat aspect ratio berubah.
function HeadlineImage({ src, alt, wide }) {
  const ratio = wide ? 16 / 9 : 4 / 3;

  return (
    <motion.img
      src={src}
      alt={alt}
      animate={{ aspectRatio: ratio }}
      transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      style={{ objectFit: "cover" }}
      className="inline-block h-20 max-[1024px]:h-16! max-[600px]:h-11! rounded-lg align-middle"
    />
  );
}

export default function Hero() {
  // false: gambar pertama 16:9, gambar kedua 4:3 — true: dibalik
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwapped((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-start bg-[#022c22] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero-background.webp')" }}
    >
      {/* Efek gelap tipis hanya di bawah navbar, tidak menutupi seluruh foto */}
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-black/65 via-black/20 to-transparent pointer-events-none" />

      {/* Overlay gelap tipis di atas foto agar zigzag putih tetap kontras */}
      <div className="absolute inset-x-0 bottom-0 h-32 max-[850px]:h-24 bg-linear-to-b from-transparent to-black/50 pointer-events-none" />

      {/* Divider zigzag putih menyatu ke section berikutnya (bg-white) */}
      <div
        className="absolute inset-x-0 bottom-0 h-6 max-[850px]:h-4 bg-white pointer-events-none"
        style={{
          clipPath:
            "polygon(0% 100%, 0.000% 0%, 1.111% 70%, 2.222% 0%, 3.333% 70%, 4.444% 0%, 5.556% 70%, 6.667% 0%, 7.778% 70%, 8.889% 0%, 10.000% 70%, 11.111% 0%, 12.222% 70%, 13.333% 0%, 14.444% 70%, 15.556% 0%, 16.667% 70%, 17.778% 0%, 18.889% 70%, 20.000% 0%, 21.111% 70%, 22.222% 0%, 23.333% 70%, 24.444% 0%, 25.556% 70%, 26.667% 0%, 27.778% 70%, 28.889% 0%, 30.000% 70%, 31.111% 0%, 32.222% 70%, 33.333% 0%, 34.444% 70%, 35.556% 0%, 36.667% 70%, 37.778% 0%, 38.889% 70%, 40.000% 0%, 41.111% 70%, 42.222% 0%, 43.333% 70%, 44.444% 0%, 45.556% 70%, 46.667% 0%, 47.778% 70%, 48.889% 0%, 50.000% 70%, 51.111% 0%, 52.222% 70%, 53.333% 0%, 54.444% 70%, 55.556% 0%, 56.667% 70%, 57.778% 0%, 58.889% 70%, 60.000% 0%, 61.111% 70%, 62.222% 0%, 63.333% 70%, 64.444% 0%, 65.556% 70%, 66.667% 0%, 67.778% 70%, 68.889% 0%, 70.000% 70%, 71.111% 0%, 72.222% 70%, 73.333% 0%, 74.444% 70%, 75.556% 0%, 76.667% 70%, 77.778% 0%, 78.889% 70%, 80.000% 0%, 81.111% 70%, 82.222% 0%, 83.333% 70%, 84.444% 0%, 85.556% 70%, 86.667% 0%, 87.778% 70%, 88.889% 0%, 90.000% 70%, 91.111% 0%, 92.222% 70%, 93.333% 0%, 94.444% 70%, 95.556% 0%, 96.667% 70%, 97.778% 0%, 98.889% 70%, 100.000% 0%, 100% 100%)",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 pt-52 max-[850px]:pt-40 text-center">
        {/* ── Headline dengan gambar disisipkan di tengah teks ── */}
        <motion.h1
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-medium leading-[1.1] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]"
        >
          <motion.span layout className="flex flex-wrap items-center justify-center gap-3 max-[600px]:gap-2 text-6xl max-[1024px]:text-5xl max-[600px]:text-3xl">
            HITUNG POTENSI
            <HeadlineImage
              src="/hero-card.png"
              alt="Instalasi dome biogas rumah tangga"
              wide={!swapped}
            />
            BIOGAS
          </motion.span>
          <motion.span layout className="flex flex-wrap items-center justify-center gap-3 max-[600px]:gap-2 text-6xl max-[1024px]:text-5xl max-[600px]:text-3xl mt-2">
            ANDA
            <HeadlineImage
              src="/hero-bg.png"
              alt="Instalasi biogas dan peternakan"
              wide={swapped}
            />
            SECARA INSTAN
          </motion.span>
        </motion.h1>

        <motion.p
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg leading-relaxed mt-8 text-white/90 max-w-xl mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
        >
          Estimasi produksi biogas dari limbah organik dalam hitungan detik — berbasis data riset, gratis, dan mudah digunakan.
        </motion.p>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <Link
            to="/kalkulator-limbah"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Mulai Hitung
          </Link>
          <Link
            to="/rancang-dome"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold border border-white/70 bg-black/20 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            Pelajari Lebih Lanjut
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
