import React, { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    requestedAreaSqft: '',
    duration: '',
    goodsType: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    // Basic Validation
    if (!formData.name || !formData.phone || !formData.requestedAreaSqft || !formData.duration) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      // Append duration and name to goodsType/companyName to avoid backend DB migrations for now
      const combinedGoodsType = `${formData.goodsType} | Duration: ${formData.duration}`;
      const combinedCompany = formData.companyName ? `${formData.companyName} (${formData.name})` : formData.name;

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: combinedCompany,
          email: formData.email,
          phone: formData.phone,
          goodsType: combinedGoodsType,
          requestedAreaSqft: Number(formData.requestedAreaSqft)
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Failed to submit request. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--bg)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h3 className="mb-2">Request Received!</h3>
        <p className="text-muted mb-4">Thank you, {formData.name}. Our team will review your space requirements and get back to you within 24 hours.</p>
        <button className="btn btn-secondary" onClick={() => { setStatus('idle'); setFormData({name: '', companyName: '', email: '', phone: '', requestedAreaSqft: '', duration: '', goodsType: ''}); }}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
      <h3 className="mb-4 text-center">Get a Free Quote</h3>
      
      {status === 'error' && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: 'var(--error)', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 calc(50% - 8px)' }}>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" required style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
          </div>
          <div style={{ flex: '1 1 calc(50% - 8px)' }}>
            <label style={labelStyle}>Business Name</label>
            <input type="text" style={inputStyle} value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Acme Corp" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 calc(50% - 8px)' }}>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" required style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
          </div>
          <div style={{ flex: '1 1 calc(50% - 8px)' }}>
            <label style={labelStyle}>Phone Number *</label>
            <input type="tel" required style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 calc(50% - 8px)' }}>
            <label style={labelStyle}>Required Area (sq ft) *</label>
            <input type="number" min="100" required style={inputStyle} value={formData.requestedAreaSqft} onChange={e => setFormData({...formData, requestedAreaSqft: e.target.value})} placeholder="e.g. 5000" />
          </div>
          <div style={{ flex: '1 1 calc(50% - 8px)' }}>
            <label style={labelStyle}>Duration *</label>
            <select required style={inputStyle} value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
              <option value="" disabled>Select Duration</option>
              <option value="1-3 Months">1-3 Months (Short Term)</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="6-12 Months">6-12 Months</option>
              <option value="1+ Years">1+ Years (Long Term)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Type of Goods</label>
          <input type="text" style={inputStyle} value={formData.goodsType} onChange={e => setFormData({...formData, goodsType: e.target.value})} placeholder="e.g. Electronics, Apparel, Non-perishables" />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting...' : 'Request Space Now'}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '6px',
  color: 'var(--primary)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: '15px',
  outline: 'none',
  fontFamily: 'inherit',
  backgroundColor: '#fff'
};
