import { motion } from "framer-motion";

export default function ExcellenceSection() {
  return (
    <section className="bg-[#050505] relative overflow-hidden text-white font-sans pt-16 pb-12">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
              Innovation
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight">
            Engineered for Excellence
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Structural elegance meets cutting-edge innovation to build robust digital solutions.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* BIG CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative md:col-span-2 h-[500px] rounded-3xl overflow-hidden group border border-white/10"
          >
            {/* BG IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c"
              className="absolute w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-60 group-hover:opacity-80"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent group-hover:opacity-80 transition duration-500"></div>

            {/* CONTENT */}
            <div className="relative p-8 flex flex-col justify-end h-full z-10">
              <div className="mb-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md text-orange-400 text-2xl group-hover:scale-110 transition-transform">
                📊
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                Advanced Analytics
              </h3>

              <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                Harness the power of ambient data with precision-engineered
                tracking systems. Clarity over complexity.
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">

            {/* CARD 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative h-[234px] rounded-3xl overflow-hidden group border border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                className="absolute w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-50 group-hover:opacity-70"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent group-hover:opacity-80 transition duration-500"></div>

              <div className="relative p-6 flex flex-col justify-end h-full z-10">
                <div className="mb-3 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl backdrop-blur-md text-blue-400 text-xl group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  Enterprise Security
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Bank-grade encryption protocols across all layers.
                </p>
              </div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative h-[234px] rounded-3xl overflow-hidden group border border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                className="absolute w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-50 group-hover:opacity-70"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent group-hover:opacity-80 transition duration-500"></div>

              <div className="relative p-6 flex flex-col justify-end h-full z-10">
                <div className="mb-3 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl backdrop-blur-md text-orange-400 text-xl group-hover:scale-110 transition-transform">
                  🔄
                </div>
                <h4 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                  Global Sync
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Real-time state management with minimal latency worldwide.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}