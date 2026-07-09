"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, X, User as UserIcon, LogOut, ChevronRight } from "lucide-react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
  links: SidebarLink[];
}

export default function DashboardLayout({ children, role, links }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  // Poll for notifications every 15 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/user/notifications/unread-count');
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setUnreadNotifications(data.count);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${role.toLowerCase()}/login`);
  };

  const breadcrumbs = pathname.split('/').filter(p => p).slice(1);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: "280px", 
        background: "white", 
        borderRight: "1px solid var(--border)",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: sidebarOpen ? 0 : "-280px",
        transition: "left 0.3s ease",
        zIndex: 100,
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary)", fontWeight: "bold" }}>
            {role.replace('_', ' ')} Panel
          </h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {links.map((link, idx) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={idx} href={link.href} style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "var(--primary)" : "#475569",
                background: isActive ? "#eff6ff" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.2s"
              }} className="hover-bg-light">
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer", width: "100%", padding: "0.875rem 1rem", borderRadius: "8px" }} className="hover-bg-light">
            <LogOut size={20} />
            <span style={{ fontWeight: "bold" }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? ((typeof window !== 'undefined' && window.innerWidth > 768) ? "280px" : "0") : "0",
        transition: "margin-left 0.3s ease",
        display: "flex",
        flexDirection: "column",
        minWidth: 0 // Prevent flex blowout
      }}>
        
        {/* Top Navbar */}
        <header style={{ 
          height: "70px", 
          background: "white", 
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              <Menu size={24} color="#475569" />
            </button>
            <div style={{ display: "none", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.875rem" }} className="md:flex">
              <Link href={`/${role.toLowerCase()}/dashboard`} style={{ color: "#64748b" }}>Home</Link>
              {breadcrumbs.map((crumb, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ChevronRight size={14} />
                  <span style={{ textTransform: "capitalize", color: i === breadcrumbs.length - 1 ? "var(--primary)" : "inherit" }}>
                    {crumb.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link href={`/${role.toLowerCase()}/notifications`} style={{ position: "relative", color: "#475569" }}>
              <Bell size={24} />
              {unreadNotifications > 0 && (
                <span style={{ position: "absolute", top: -5, right: -5, background: "#ef4444", color: "white", fontSize: "0.65rem", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontWeight: "bold" }}>
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </Link>
            <Link href={`/${role.toLowerCase()}/profile`} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
              <UserIcon size={20} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: "2rem", flex: 1, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (typeof window !== 'undefined' && window.innerWidth < 768) && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 90 }}
        />
      )}
    </div>
  );
}
