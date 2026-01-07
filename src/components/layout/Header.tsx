import Link from "next/link";

export function Header() {
  return (
    <header className="bg-dark border-b border-cream/10">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          {/* Terminal-style indicator */}
          <span className="text-burgundy text-lg">●</span>
          <span className="text-cream font-mono text-sm tracking-wider uppercase">
            ~deniz
          </span>
          <span className="text-cream/40 font-mono text-sm">/</span>
          <span className="text-cream/70 font-mono text-sm tracking-wider">
            terminbuchung
          </span>
        </Link>
      </div>
    </header>
  );
}
