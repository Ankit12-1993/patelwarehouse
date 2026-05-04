import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AdminDashboard from './components/AdminDashboard'
import VendorDashboard from './components/VendorDashboard'
import Login from './components/Login'

function App() {
  const [view, setView] = useState<'public' | 'admin' | 'vendor' | 'login'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    setView(role === 'admin' ? 'admin' : 'vendor');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('public');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', cursor: 'pointer' }} onClick={() => setView('public')}>
              📦 PatelWarehouse
            </h1>
            
            {view === 'public' && (
              <nav style={{ display: 'flex', gap: '20px', display: 'none' /* In real app, toggle via mobile menu. Desktop shown below */ }} className="desktop-nav">
                <a href="#" style={{ color: 'var(--text-main)', fontWeight: 500 }}>Home</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Services</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>About</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
              </nav>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                <button className="btn btn-secondary" onClick={() => setView('admin')}>Admin Panel</button>
                <button className="btn btn-secondary" onClick={() => setView('vendor')}>Vendor Dashboard</button>
                <button className="btn" style={{ color: 'var(--error)' }} onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button className="btn btn-secondary" onClick={() => setView('login')}>Portal Login</button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {view === 'public' && <LandingPage />}
        
        {view === 'login' && !isAuthenticated && (
          <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Login onLogin={handleLoginSuccess} />
          </div>
        )}

        <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
          {view === 'admin' && isAuthenticated && <AdminDashboard />}
          {view === 'vendor' && isAuthenticated && <VendorDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--primary)', color: '#cbd5e1', padding: '60px 0 20px 0', marginTop: 'auto' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '40px', marginBottom: '20px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '16px' }}>📦 PatelWarehouse</h2>
              <p>Flexible, scalable storage solutions designed to help e-commerce businesses grow without the overhead of traditional warehousing.</p>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><a href="#" style={{ color: '#cbd5e1' }}>Home</a></li>
                <li><a href="#" style={{ color: '#cbd5e1' }}>Services</a></li>
                <li><a href="#" style={{ color: '#cbd5e1' }}>About Us</a></li>
                <li><a href="#" style={{ color: '#cbd5e1' }}>Contact</a></li>
              </ul>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}>Contact Details</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>📍 123 Logistics Blvd, Metropolis</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ contact@patelwarehouse.in</li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            &copy; {new Date().getFullYear()} PatelWarehouse. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Quick CSS for desktop nav visibility */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default App
