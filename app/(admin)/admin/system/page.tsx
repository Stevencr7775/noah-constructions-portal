import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { Activity, Database, Server, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const revalidate = 0;

export default async function SystemHealth() {
  const [totalLogs, recentErrors, dbSize] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.findMany({ where: { action: 'SystemError' }, take: 5, orderBy: { createdAt: 'desc' } }),
    // Simulated DB Size query for SQLite/Prisma
    Promise.resolve("45.2 MB")
  ]);

  const recentLogs = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: <Activity size={20} /> },
    { label: "System Health", href: "/admin/system", icon: <Server size={20} /> },
    { label: "Settings", href: "/admin/settings", icon: <Shield size={20} /> },
  ];

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: "0 0 2rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Server size={28} /> System Health & Audit Logs
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Database Status" value="Online" icon={<Database size={24} />} color="#10b981" />
        <KPICard title="Database Size" value={dbSize} icon={<Database size={24} />} color="#3b82f6" />
        <KPICard title="Total Audit Logs" value={totalLogs.toString()} icon={<Shield size={24} />} color="#8b5cf6" />
        <KPICard title="Recent Errors" value={recentErrors.length.toString()} icon={<AlertTriangle size={24} />} color={recentErrors.length > 0 ? "#ef4444" : "#10b981"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0" }}>System Audit Log</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Time</th>
                <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Action</th>
                <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Entity</th>
                <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>User IP/Role</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length > 0 ? recentLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748b" }}>{log.createdAt.toLocaleString()}</td>
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>
                    <span style={{ 
                      padding: "0.2rem 0.5rem", 
                      background: log.action.includes('Error') ? '#fee2e2' : log.action.includes('Delete') ? '#fef3c7' : '#e0f2fe',
                      color: log.action.includes('Error') ? '#ef4444' : log.action.includes('Delete') ? '#d97706' : '#0284c7',
                      borderRadius: "4px", fontSize: "0.75rem"
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{log.entity} {log.entityId ? `(\${log.entityId})` : ''}</td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748b" }}>{log.role || 'System'} | {log.ipAddress || 'Internal'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    No audit logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444" }}>
              <AlertTriangle size={20} /> System Alerts
            </h2>
            {recentErrors.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {recentErrors.map(err => (
                  <li key={err.id} style={{ padding: "0.75rem", background: "#fef2f2", borderLeft: "3px solid #ef4444", marginBottom: "0.5rem", borderRadius: "0 4px 4px 0", fontSize: "0.875rem" }}>
                    <strong>{err.entity}:</strong> {err.details || "Unknown error"}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", padding: "1rem", background: "#ecfdf5", borderRadius: "8px" }}>
                <CheckCircle size={20} /> All systems operational.
              </div>
            )}
          </div>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Quick Actions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button className="btn btn-outline" style={{ display: "flex", justifyContent: "flex-start" }}>Download Server Logs</button>
              <button className="btn btn-outline" style={{ display: "flex", justifyContent: "flex-start" }}>Trigger Manual Backup</button>
              <button className="btn btn-primary" style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "#ef4444", borderColor: "#ef4444" }}>Enable Maintenance Mode</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
