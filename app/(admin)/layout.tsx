import Link from 'next/link';
import { Building2, Settings, Users, ArrowLeft } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Simple Admin Header */}
      <header style={{ 
        backgroundColor: "#1A365D", 
        padding: "1rem 2rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "white" }}>
          <Building2 size={24} />
          <span style={{ fontWeight: "bold", fontSize: "1.25rem", letterSpacing: "1px" }}>NOAH ADMIN</span>
        </div>
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link href="/admin/properties" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building2 size={18} /> Properties
          </Link>
          <Link href="#" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={18} /> Users
          </Link>
          <Link href="#" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings size={18} /> Settings
          </Link>
          <Link href="/" style={{ color: "#D4AF37", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "1rem", fontWeight: "bold" }}>
            <ArrowLeft size={18} /> Back to Site
          </Link>
        </nav>
      </header>
      
      {/* Admin Content Wrapper */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
