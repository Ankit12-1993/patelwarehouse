import React, { useEffect, useState } from 'react';

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  vendorId: number;
}

export default function VendorDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings");
    }
  };

  const requestBooking = async () => {
    try {
      await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: 1, // Mock vendor ID
          startDate: new Date().toISOString().split('T')[0],
          endDate: '2026-12-31'
        })
      });
      fetchBookings();
    } catch (e) {
      console.error("Failed to create booking");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Vendor Dashboard - My Bookings</h2>
        <button onClick={requestBooking} style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Request Storage Space
        </button>
      </div>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px' }}>Booking ID</th>
            <th style={{ padding: '10px' }}>Vendor ID</th>
            <th style={{ padding: '10px' }}>Start Date</th>
            <th style={{ padding: '10px' }}>End Date</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{booking.id}</td>
              <td style={{ padding: '10px' }}>{booking.vendorId}</td>
              <td style={{ padding: '10px' }}>{booking.startDate}</td>
              <td style={{ padding: '10px' }}>{booking.endDate}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', backgroundColor: booking.status === 'PENDING' ? '#ffd700' : '#4caf50', color: booking.status === 'PENDING' ? '#000' : '#fff' }}>
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && <tr><td colSpan={5} style={{ padding: '10px', textAlign: 'center' }}>No active bookings found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
