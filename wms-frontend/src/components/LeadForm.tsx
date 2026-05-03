import React, { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    requestedAreaSqft: '',
    goodsType: ''
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requestedAreaSqft: Number(formData.requestedAreaSqft)
        })
      });
      if (response.ok) {
        setStatus("Success! We will contact you soon regarding your space request.");
        setFormData({ companyName: '', email: '', phone: '', requestedAreaSqft: '', goodsType: '' });
      } else {
        setStatus("Failed to submit request.");
      }
    } catch (err) {
      setStatus("Error connecting to server.");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Request Warehouse Space</h2>
      {status && <p style={{ color: status.includes("Success") ? 'green' : 'red' }}>{status}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Company Name" required value={formData.companyName}
          onChange={e => setFormData({...formData, companyName: e.target.value})}
          style={{ padding: '10px' }}
        />
        <input 
          type="email" placeholder="Email Address" required value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          style={{ padding: '10px' }}
        />
        <input 
          type="tel" placeholder="Phone Number" value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          style={{ padding: '10px' }}
        />
        <input 
          type="number" placeholder="Requested Area (sq ft)" required value={formData.requestedAreaSqft}
          onChange={e => setFormData({...formData, requestedAreaSqft: e.target.value})}
          style={{ padding: '10px' }}
        />
        <input 
          type="text" placeholder="Type of Goods (e.g., Electronics, Food)" value={formData.goodsType}
          onChange={e => setFormData({...formData, goodsType: e.target.value})}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit Request
        </button>
      </form>
    </div>
  );
}
