import Image from "next/image";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Logo Section */}
      <div className="mb-12 relative">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="La Creola Logo"
            width={400}
            height={400}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Content Card */}
      <div className="card-glass max-w-2xl w-full p-8 sm:p-12 rounded-3xl text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4">
          Refining the Experience
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-lg mx-auto">
          We are currently perfecting our digital home to better serve you. 
          The <span className="text-gold">La Creola</span> experience will return shortly with something extraordinary.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-zinc-700/50 bg-black/40">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium tracking-widest text-zinc-300 uppercase">
              System Upgrade
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
            Kigali, Rwanda
          </div>
        </div>
      </div>
    </div>
  );
}
