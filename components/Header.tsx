import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          World Countries
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">
            All countries
          </Link>
          <Link href="/regions" className="hover:text-slate-900 dark:hover:text-white">
            Regions
          </Link>
        </nav>
      </div>
    </header>
  );
}
