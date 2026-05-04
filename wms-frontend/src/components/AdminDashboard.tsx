import React, { useEffect, useState } from 'react';

interface Lead {
  id: number;
  companyName: string;
  email: string;
  requestedAreaSqft: number;
  status: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error("Failed to fetch leads");
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/leads/${id}/status?status=${status}`, { method: 'PUT' });
      fetchLeads(); // Refresh list
    } catch (e) {
      console.error("Failed to update status");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard - Leads</h2>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Company</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Area (sqft)</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{lead.id}</td>
              <td style={{ padding: '10px' }}>{lead.companyName}</td>
              <td style={{ padding: '10px' }}>{lead.email}</td>
              <td style={{ padding: '10px' }}>{lead.requestedAreaSqft}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', backgroundColor: lead.status === 'NEW' ? '#ffd700' : '#4caf50', color: lead.status === 'NEW' ? '#000' : '#fff' }}>
                  {lead.status}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                {lead.status === 'NEW' && (
                  <button onClick={() => updateLeadStatus(lead.id, 'APPROVED')} style={{ marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}>
                    Approve
                  </button>
                )}
                <button onClick={() => updateLeadStatus(lead.id, 'REJECTED')} style={{ padding: '6px 12px', cursor: 'pointer' }}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && <tr><td colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>No leads found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
