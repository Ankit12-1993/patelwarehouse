import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api';

interface Vendor { id: number; companyName: string; contactName: string; phone: string; }
interface Booking { id: number; vendorId: number; slotId: number; startDate: string; endDate: string; status: string; }
interface Slot { id: number; zoneId: number; name: string; areaSqft: number; status: string; monthlyPrice?: number; }
interface Invoice { id: number; vendorId: number; bookingId: number; amount: number; month: string; year: string; status: string; paymentDate?: string; paymentMode?: string; }

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<'SPACE' | 'BOOKINGS' | 'INVOICES'>('SPACE');
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [v, b, s, i] = await Promise.all([
        api.get('/vendors/me').catch(() => null),
        api.get('/bookings/my').catch(() => []),
        api.get('/slots').catch(() => []),
        api.get('/invoices/my').catch(() => [])
      ]);
      setVendor(v); setBookings(b); setSlots(s); setInvoices(i);
    } catch (e) {
      console.error("Error fetching vendor data", e);
    }
  };

  const mySlots = useMemo(() => {
    const activeSlotIds = bookings.filter(b => b.status === 'ACTIVE').map(b => b.slotId);
    return slots.filter(s => activeSlotIds.includes(s.id));
  }, [slots, bookings]);

  const pendingPayments = useMemo(() => {
    return invoices.filter(i => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0);
  }, [invoices]);

  const activeBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'ACTIVE').length;
  }, [bookings]);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: '#fef08a', color: '#854d0e' };
      case 'ACTIVE': case 'PAID': return { bg: '#bbf7d0', color: '#166534' };
      case 'COMPLETED': return { bg: '#e5e7eb', color: '#374151' };
      default: return { bg: '#e5e7eb', color: '#374151' };
    }
  };

  if (!vendor) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Vendor Dashboard...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-main)' }}>Welcome, {vendor.companyName}</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)' }}>Manage your space allocations and billing</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Need help?</div>
          <a href="mailto:support@patelwarehouse.in" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Contact Support</a>
        </div>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Slots Allocated</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '12px' }}>{mySlots.length}</div>
        </div>
        <div className="card" style={{ padding: '20px', borderTop: '4px solid #22c55e' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Bookings</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '12px' }}>{activeBookingsCount}</div>
        </div>
        <div className="card" style={{ padding: '20px', borderTop: pendingPayments > 0 ? '4px solid #ef4444' : '4px solid #e2e8f0' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Payment</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '12px', color: pendingPayments > 0 ? '#ef4444' : 'var(--text-main)' }}>
            ₹{pendingPayments.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border)' }}>
        {['SPACE', 'BOOKINGS', 'INVOICES'].map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '12px 24px', background: 'none', border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '-2px',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* SPACE TAB */}
      {activeTab === 'SPACE' && (
        <div className="card" style={{ padding: '32px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ margin: 0 }}>My Space Allocation</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#dcfce7', border: '2px solid #22c55e', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Allocated Slot</span>
            </div>
          </div>
          
          {mySlots.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed var(--border)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>No space allocated yet</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Contact support to request warehouse space.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
              {mySlots.map(slot => (
                <div 
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    backgroundColor: '#dcfce7',
                    border: '2px solid #22c55e',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#166534' }}>{slot.name}</div>
                  <div style={{ fontSize: '14px', color: '#15803d', marginTop: '8px', fontWeight: 500 }}>{slot.areaSqft} sqft</div>
                  <div style={{ marginTop: '16px', padding: '6px', backgroundColor: '#166534', color: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    ALLOCATED
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'BOOKINGS' && (
        <div className="card" style={{ padding: '24px', flex: 1 }}>
          <h2 style={{ marginBottom: '24px' }}>My Bookings</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Booking ID</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Slot Details</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => {
                  const slot = slots.find(s => s.id === booking.slotId);
                  const badge = getBadgeStyle(booking.status);
                  return (
                    <tr key={booking.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>#{booking.id}</td>
                      <td style={{ padding: '16px' }}>{slot ? `Slot ${slot.name} (${slot.areaSqft} sqft)` : 'Pending Assignment'}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{booking.startDate || '-'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>to {booking.endDate || 'Ongoing'}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: badge.bg, color: badge.color }}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {bookings.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVOICES TAB */}
      {activeTab === 'INVOICES' && (
        <div className="card" style={{ padding: '24px', flex: 1 }}>
          <h2 style={{ marginBottom: '24px' }}>My Invoices</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Invoice ID</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Slot</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Billing Period</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, index) => {
                  const booking = bookings.find(b => b.id === inv.bookingId);
                  const slot = slots.find(s => s.id === booking?.slotId);
                  const badge = getBadgeStyle(inv.status);

                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>#{inv.id}</td>
                      <td style={{ padding: '16px' }}>{slot ? `Slot ${slot.name}` : '-'}</td>
                      <td style={{ padding: '16px' }}>{inv.month} {inv.year}</td>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>₹{inv.amount.toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: badge.bg, color: badge.color }}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => { setSelectedInvoice(inv); setShowInvoiceModal(true); }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {invoices.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No invoices generated yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '2px solid var(--border)', paddingBottom: '16px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px' }}>INVOICE</h1>
                <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>#{selectedInvoice.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '24px', color: selectedInvoice.status === 'PAID' ? '#166534' : '#b91c1c' }}>
                  {selectedInvoice.status}
                </div>
                {selectedInvoice.paymentDate && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Paid: {new Date(selectedInvoice.paymentDate).toLocaleString()}</div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {(() => {
                const booking = bookings.find(b => b.id === selectedInvoice.bookingId);
                const slot = slots.find(s => s.id === booking?.slotId);
                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong>Billed To:</strong> <span>{vendor.companyName}</span></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong>Period:</strong> <span>{selectedInvoice.month} {selectedInvoice.year}</span></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong>Space Used:</strong> <span>Slot {slot?.name} ({slot?.areaSqft} sqft)</span></div>
                    {selectedInvoice.status === 'PAID' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}><strong>Payment Mode:</strong> <span>{selectedInvoice.paymentMode}</span></div>
                    )}
                  </>
                );
              })()}
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '18px' }}>Total Amount</strong>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{selectedInvoice.amount.toLocaleString()}</span>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowInvoiceModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* View Slot Modal */}
      {selectedSlot && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>📦</span> Slot {selectedSlot.name}
              </h2>
              <button onClick={() => setSelectedSlot(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(() => {
                const activeBooking = bookings.find(b => b.slotId === selectedSlot.id && b.status === 'ACTIVE');
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Area Capacity</span>
                      <span style={{ fontWeight: 'bold' }}>{selectedSlot.areaSqft} sqft</span>
                    </div>
                    {activeBooking ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Duration</span>
                          <span style={{ fontWeight: 'bold' }}>
                            {activeBooking.startDate || 'Started'} to {activeBooking.endDate || 'Ongoing'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Status</span>
                          <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#bbf7d0', color: '#166534' }}>
                            {activeBooking.status}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No active booking data found.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setSelectedSlot(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
