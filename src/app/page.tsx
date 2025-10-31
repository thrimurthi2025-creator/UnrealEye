export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden font-body">
      {/* Background effects */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 15% 25%, hsl(var(--primary) / 0.1), transparent 35%), radial-gradient(circle at 85% 75%, hsl(var(--accent) / 0.12), transparent 40%)'
        }} 
      />
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)/0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.03) 1px, transparent 1px)',
          backgroundSize: '2.5rem 2.5rem'
        }} 
      />
      
      <div className="z-10 flex w-full flex-col items-center animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          AI Image Detection Tool
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          Upload or analyze images instantly using advanced AI technology.
        </p>

        <div className="relative group w-full max-w-[850px] mx-auto mt-10 aspect-[850/450]">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/70 to-accent/70 opacity-50 blur-xl group-hover:opacity-80 transition duration-500" />
          <div className="relative w-full h-full rounded-xl p-1 bg-black/50 backdrop-blur-sm">
             <iframe
              src="https://thrimurthi2025-ai-or-not.hf.space"
              className="w-full h-full rounded-lg border-0"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm text-foreground/60 z-10 animate-fade-in-up" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}>
        Developed by Diljith A K
      </footer>
    </main>
  );
}
