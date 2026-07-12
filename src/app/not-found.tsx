import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="font-[family-name:var(--font-mono)] text-xs text-maroon uppercase tracking-widest">404</p>
      <h1 className="text-3xl md:text-4xl font-bold mt-4 text-text-primary">Page not found.</h1>
      <p className="text-text-muted mt-4 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 bg-maroon text-white border border-border-hard px-6 py-3 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark transition-colors duration-200"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}