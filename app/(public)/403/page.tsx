import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="container section-padding" style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "150px", minHeight: "80vh", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <ShieldAlert size={80} color="#dc2626" />
      </div>
      <h1 className="section-title mb-4" style={{ color: "#dc2626" }}>403 - Access Denied</h1>
      <p className="text-muted mb-8" style={{ fontSize: "1.125rem" }}>
        You do not have permission to access this page. This area is restricted based on your account role.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link href="/" className="btn btn-outline">Return to Home</Link>
        <Link href="/login" className="btn btn-primary">Login to Different Account</Link>
      </div>
    </div>
  );
}
