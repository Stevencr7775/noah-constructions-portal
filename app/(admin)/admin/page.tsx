"use client";

import Link from "next/link";
import { PlusCircle, Database } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div style={{ padding: '4rem 2rem', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="section-title text-primary" style={{ marginBottom: '1rem' }}>Admin Dashboard</h1>
        <p className="text-muted" style={{ marginBottom: '3rem' }}>Manage the Property Management System</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <PlusCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Add New Property</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Enter a new property into the centralized database with images and details.</p>
            <Link href="/admin/property-entry" className="btn btn-primary">Go to Entry Form</Link>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Database size={48} className="text-primary mx-auto mb-4" />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Master Data</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Add locations, categories, and options to the database.</p>
            <Link href="/admin/master-data" className="btn btn-outline">Manage Data</Link>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Database size={48} className="text-primary mx-auto mb-4" />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Export Data</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Download a complete report of all properties in the system.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="/api/export?format=xlsx" className="btn btn-outline" download>Export Excel</a>
              <a href="/api/export?format=csv" className="btn btn-outline" download>Export CSV</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
