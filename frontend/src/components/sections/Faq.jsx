import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ArrowUpRight } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    category: "Umum",
    items: [
      {
        q: "Apa itu BioGasCalc?",
        a: "BioGasCalc adalah kalkulator berbasis web untuk mengestimasi potensi produksi biogas dari limbah organik, sekaligus membantu merancang ukuran reaktor dome yang sesuai.",
      },
      {
        q: "Apakah alat ini gratis digunakan?",
        a: "Ya, seluruh fitur kalkulator dan perancangan dome dapat digunakan tanpa biaya sebagai bagian dari Program Kreativitas Mahasiswa (PKM).",
      },
    ],
  },
  {
    category: "Teknis & Fitur",
    items: [
      {
        q: "Jenis limbah apa saja yang bisa dihitung?",
        a: "Kalkulator mendukung berbagai jenis limbah organik rumah tangga dan peternakan, seperti sisa makanan, kotoran ternak, dan limbah sayuran.",
      },
      {
        q: "Seberapa akurat estimasi yang dihasilkan?",
        a: "Estimasi dihitung berdasarkan rasio produksi biogas dari data riset yang telah divalidasi, namun hasil aktual di lapangan dapat bervariasi tergantung kondisi reaktor dan lingkungan.",
      },
    ],
  },
  {
    category: "Langkah Selanjutnya",
    items: [
      {
        q: "Bagaimana cara memulai membangun reaktor dome?",
        a: "Setelah mendapatkan hasil estimasi dari kalkulator, Anda dapat menggunakan fitur Rancang Dome untuk memperoleh rekomendasi ukuran dan spesifikasi reaktor.",
      },
    ],
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState("Umum-0");

  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* KOLOM KIRI: Judul & Tombol */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <h2 className="font-semibold tracking-tight text-5xl leading-tight text-slate-900 mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>

            <div className="flex items-center gap-3">
              <button className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors">
                Lihat Semua
              </button>
              <button
                className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 text-slate-900 transition-transform hover:scale-105 hover:-rotate-12"
                aria-label="Lihat Semua FAQ"
              >
                <ArrowUpRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: Daftar Kategori & FAQ */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {FAQ_CATEGORIES.map((group) => (
              <div key={group.category}>
                <h3 className="font-semibold text-xl text-slate-900 mb-4 tracking-tight">
                  {group.category}
                </h3>

                {/* Garis atas untuk kategori */}
                <div className="h-px bg-slate-300" />

                <div>
                  {group.items.map((item, i) => {
                    const id = `${group.category}-${i}`;
                    const isOpen = openId === id;

                    return (
                      <div key={id} className="border-b border-slate-200">
                        <button
                          onClick={() => setOpenId(isOpen ? null : id)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between text-left py-6 bg-transparent border-none cursor-pointer"
                        >
                          <span className="font-medium pr-8 text-base text-slate-800 leading-normal">
                            {item.q}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 flex items-center justify-center text-slate-700"
                          >
                            <Plus size={20} strokeWidth={2} />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="pb-6 pr-8 text-sm leading-relaxed text-slate-600">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
