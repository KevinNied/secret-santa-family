import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  // Generar copos de nieve
  const snowflakes = Array.from({ length: 30 }, (_, i) => (
    <div
      key={i}
      className="snowflake"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        fontSize: `${4 + Math.random() * 4}px`,
        opacity: 0.3 + Math.random() * 0.3,
      }}
    >
      ❄
    </div>
  ))

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fondo con gradiente navideño */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3d59] via-[#2d5f5d] to-[#1e3d59] z-0" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.02%22/%3E%3C/svg%3E')] opacity-30 z-0" />
      
      {/* Copos de nieve */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {snowflakes}
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 z-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-5 md:px-10 py-8 md:py-12 relative z-20 min-h-screen max-h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          {/* Hero Section */}
          <section className="relative text-center space-y-10">
            <div className="relative space-y-10">
              {/* Título */}
              <div className="space-y-4 animate-fade-in-up">
                <h1 
                  className="text-4xl md:text-[48px] font-bold tracking-tight text-white"
                  style={{ 
                    fontFamily: 'var(--font-work-sans)',
                    textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.3)',
                    lineHeight: '1.2'
                  }}
                >
                  <span className="text-[40px] md:text-[56px]">🎅</span> Amigo Invisible Mágico
                </h1>
                <div className="flex items-center justify-center gap-3 my-4">
                  <div className="h-px w-16 bg-white/30"></div>
                  <span className="text-white/50 text-lg">✨</span>
                  <div className="h-px w-16 bg-white/30"></div>
                </div>
                <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Organiza tu intercambio navideño con un solo link. Sin complicaciones, sin registro.
                </p>
              </div>

              {/* Family Intro Section */}
              <div className="pt-0 max-w-3xl mx-auto animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/10 backdrop-blur-[10px] rounded-[20px] p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:translate-y-[-4px] transition-all duration-300">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎄</span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-work-sans)' }}>
                        Hola familia
                      </h2>
                    </div>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      Bienvenidos al <em className="text-white font-semibold">Amigo Invisible 2025</em>, la tradición más caótica, graciosa y discutida de todas nuestras fiestas.
                    </p>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      Este año, nuevamente, tenemos al tío intentando convencer a todo el mundo de que <em className="text-white font-semibold">él ya sabe quién le regala a quién</em>, porque según él las pistas "son obvias" (spoiler: nunca acierta).
                    </p>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      Así que prepárense: se acerca Navidad, las pistas vuelan, las sospechas aumentan, y siempre alguien dice <em className="text-white font-semibold">"yo ya sé quién me tiene"</em> cuando claramente no tiene ni idea.
                    </p>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      Pero bueno… más allá de toda esta magia, misterio y confusión tradicional…
                    </p>
                    <div className="pt-2">
                      <p className="text-base md:text-lg text-white font-semibold leading-relaxed">
                        👉 <strong>Arranquemos con el sorteo y que empiece el juego.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-1 animate-fade-in-up-delay" style={{ animationDelay: '0.4s' }}>
                <Link href="/create">
                  <Button 
                    size="lg" 
                    className="text-lg md:text-[18px] font-semibold px-8 md:px-12 py-6 md:py-8 min-w-[240px] h-14 md:h-16 bg-[#D4AF37] hover:bg-[#E8C55B] text-white shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.6)] hover:translate-y-[-2px] hover:scale-[1.02] transition-all duration-300 rounded-xl animate-pulse-gold"
                  >
                    Crear Sorteo Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 px-4 mt-auto relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <p>© 2024 Amigo Invisible Mágico</p>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors cursor-pointer">
              Acerca de
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
