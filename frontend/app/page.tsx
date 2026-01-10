export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      {/* Navigation Placeholder */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tighter">
            VECTOR CORALS
          </span>
          <div className="text-sm text-gray-400">
            <span className="mr-4">Systems Online</span>
            <span className="w-2 h-2 inline-block bg-green-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center p-6 text-center">
        {/* Ambient Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />

        <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent relative z-10">
          Biological
          <br />
          Engineering
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 relative z-10">
          High-performance aquatics driven by computer vision and artificial
          intelligence.
        </p>

        <div className="flex gap-4 relative z-10">
          <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
            View Collection
          </button>
          <button className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white rounded-full transition-colors">
            System Specs
          </button>
        </div>
      </div>

      {/* Grid Section Placeholder */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
            >
              <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
