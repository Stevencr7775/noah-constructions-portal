"use client";

import { useState, useEffect } from 'react';
import { Download, Check, X, FileText, FileSpreadsheet, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/admin/properties');
      const data = await res.json();
      if (data.properties) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // EXPORT TO CSV
  const exportCSV = () => {
    const csvRows = [];
    const headers = ['Property ID', 'Seller Name', 'Type', 'Category', 'Purpose', 'City', 'Price', 'Status', 'Date Submitted'];
    csvRows.push(headers.join(','));

    properties.forEach(p => {
      const row = [
        p.propertyId,
        p.seller?.name || 'N/A',
        p.seller?.type || 'N/A',
        `"${p.category}"`,
        p.purpose,
        p.city,
        p.totalPrice,
        p.status,
        new Date(p.createdAt).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'properties_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // EXPORT TO EXCEL
  const exportExcel = () => {
    const exportData = properties.map(p => ({
      'Property ID': p.propertyId,
      'Seller Type': p.seller?.type,
      'Seller Name': p.seller?.name,
      'Seller Mobile': p.seller?.mobile,
      'Purpose': p.purpose,
      'Category': p.category,
      'Location': `${p.locality}, ${p.city}, ${p.state}`,
      'Price (INR)': p.totalPrice,
      'Status': p.status,
      'Submitted On': new Date(p.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Properties');
    XLSX.writeFile(workbook, 'properties_export.xlsx');
  };

  // EXPORT TO PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Registered Properties Report", 14, 15);
    
    const tableColumn = ["ID", "Seller", "Type", "Purpose", "Location", "Price", "Status"];
    const tableRows = [];

    properties.forEach(p => {
      const rowData = [
        p.propertyId,
        p.seller?.name || 'N/A',
        p.seller?.type || 'N/A',
        p.purpose,
        p.city,
        p.totalPrice.toString(),
        p.status
      ];
      tableRows.push(rowData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save('properties_report.pdf');
  };

  if (loading) return <div className="container section-padding text-center">Loading dashboard...</div>;

  return (
    <div className="container section-padding" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title mb-0">Admin Dashboard - Properties</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={exportCSV} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
            <Download size={18} /> CSV
          </button>
          <button onClick={exportExcel} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: '#10B981', color: '#10B981' }}>
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button onClick={exportPDF} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: '#EF4444', color: '#EF4444' }}>
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--background)' }}>
              <th style={{ padding: '1rem' }}>Property ID</th>
              <th style={{ padding: '1rem' }}>Seller Info</th>
              <th style={{ padding: '1rem' }}>Type & Details</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{p.propertyId}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>{p.seller?.name}</div>
                  <div className="text-sm text-muted">{p.seller?.type}</div>
                  <div className="text-sm text-muted">{p.seller?.mobile}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>{p.purpose}</div>
                  <div className="text-sm text-muted">{p.category}</div>
                  <div className="text-sm text-muted">₹{p.totalPrice.toLocaleString()}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div>{p.locality}</div>
                  <div className="text-sm text-muted">{p.city}, {p.district}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold',
                    background: p.status === 'Available' ? 'rgba(16, 185, 129, 0.1)' : p.status === 'Pending Approval' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: p.status === 'Available' ? '#10B981' : p.status === 'Pending Approval' ? '#D4AF37' : '#EF4444'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {p.status === 'Pending Approval' && (
                      <>
                        <button onClick={() => handleUpdateStatus(p.id, 'Available')} className="btn" style={{ padding: '0.25rem 0.5rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '4px' }} title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => handleUpdateStatus(p.id, 'Hidden')} className="btn" style={{ padding: '0.25rem 0.5rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px' }} title="Reject/Hide">
                          <X size={18} />
                        </button>
                      </>
                    )}
                    {p.status === 'Available' && (
                      <button onClick={() => handleUpdateStatus(p.id, 'Hidden')} className="btn" style={{ padding: '0.25rem 0.5rem', background: 'var(--text-muted)', color: 'white', border: 'none', borderRadius: '4px' }} title="Hide Listing">
                        <Eye size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No properties registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
