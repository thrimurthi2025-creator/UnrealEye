export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-label="Loading...">
      <div className="w-16 h-16 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
      <span className="text-white/70 text-sm tracking-widest">ANALYSING...</span>
    </div>
  );
}
