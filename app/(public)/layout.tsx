import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            🎅 Secret Santa
          </Link>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-primary transition">
              About
            </Link>
            <Link href="/auth/login" className="hover:text-primary transition">
              Login
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

