import { useState } from 'react'
import LeadForm from './components/LeadForm'
import AdminDashboard from './components/AdminDashboard'
import VendorDashboard from './components/VendorDashboard'
import Login from './components/Login'

function App() {
  const [view, setView] = useState<'public' | 'admin' | 'vendor' | 'login'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    setView(role === 'admin' ? 'admin' : 'vendor'); // Route based on role
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('public');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ padding: '20px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Warehouse Platform MVP</h1>
        <div>
          <button 
            onClick={() => setView('public')} 
            style={{ marginRight: '10px', padding: '8px 16px', background: view === 'public' ? '#0070f3' : 'transparent', color: 'white', border: '1px solid #0070f3', cursor: 'pointer' }}
          >
            Public Site
          </button>
          
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => setView('admin')} 
                style={{ marginRight: '10px', padding: '8px 16px', background: view === 'admin' ? '#0070f3' : 'transparent', color: 'white', border: '1px solid #0070f3', cursor: 'pointer' }}
              >
                Admin Panel
              </button>
              <button 
                onClick={() => setView('vendor')} 
                style={{ marginRight: '10px', padding: '8px 16px', background: view === 'vendor' ? '#0070f3' : 'transparent', color: 'white', border: '1px solid #0070f3', cursor: 'pointer' }}
              >
                Vendor Dashboard
              </button>
              <button 
                onClick={handleLogout} 
                style={{ padding: '8px 16px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('login')} 
              style={{ padding: '8px 16px', background: view === 'login' ? '#0070f3' : 'transparent', color: 'white', border: '1px solid #0070f3', cursor: 'pointer' }}
            >
              Portal Login
            </button>
          )}
        </div>
      </nav>

      <main style={{ padding: '20px' }}>
        {view === 'public' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2>Welcome to Next-Gen Warehousing</h2>
              <p>Flexible, scalable storage solutions for your e-commerce business.</p>
            </div>
            <LeadForm />
          </div>
        )}
        
        {view === 'login' && !isAuthenticated && (
          <Login onLogin={handleLoginSuccess} />
        )}

        {view === 'admin' && isAuthenticated && (
          <AdminDashboard />
        )}
        
        {view === 'vendor' && isAuthenticated && (
          <VendorDashboard />
        )}
      </main>
    </div>
  )
}

export default App
