import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import VendorDashboard from './components/VendorDashboard';
import Login from './components/Login';

// Helper to protect routes
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole: string }) => {
  const token = localStorage.getItem('jwt_token');
  const role = localStorage.getItem('user_role');
  
  if (!token) return <Navigate to="/login" replace />;
  if (role !== requiredRole) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('user_role');

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/" style={{ margin: 0, fontSize: '24px', textDecoration: 'none', color: 'var(--text-main)', fontWeight: 'bold' }}>
              📦 PatelWarehouse
            </Link>
            
            <nav style={{ display: 'flex', gap: '20px', display: 'none' /* toggle via mobile menu. Desktop shown below */ }} className="desktop-nav">
              <Link to="/" style={{ color: 'var(--text-main)', fontWeight: 500, textDecoration: 'none' }}>Home</Link>
              <a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Services</a>
              <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</a>
              <a href="#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</a>
            </nav>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                {userRole === 'ADMIN' && <Link to="/admin" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Admin Panel</Link>}
                {userRole === 'VENDOR' && <Link to="/vendor" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Vendor Dashboard</Link>}
                <button className="btn" style={{ color: 'var(--error)' }} onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Portal Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Routing */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Login />
            </div>
          } />
          
          <Route path="/admin" element={
            <div style={{ flex: 1, width: '100%', backgroundColor: 'var(--bg)' }}>
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            </div>
          } />
          
          <Route path="/vendor" element={
            <div style={{ flex: 1, width: '100%', backgroundColor: 'var(--bg)' }}>
              <ProtectedRoute requiredRole="VENDOR">
                <VendorDashboard />
              </ProtectedRoute>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer - Hidden on Dashboard routes */}
      {!['/admin', '/vendor'].includes(location.pathname) && (
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
                  <li><Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link></li>
                  <li><a href="#services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Services</a></li>
                  <li><a href="#about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>About Us</a></li>
                  <li><a href="#contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contact</a></li>
                </ul>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}>Contact Details</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span>📍</span>
                    <span>
                      RZ-406, Durga Vihar Phase 1<br/>
                      Dinpur, Najafgarh<br/>
                      New Delhi – 110043
                    </span>
                  </li>
                  <li>📞 9871463982</li>
                  <li>✉️ support@patelwarehouse.in</li>
                </ul>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '14px' }}>
              &copy; {new Date().getFullYear()} PatelWarehouse. All rights reserved.
            </div>
          </div>
        </footer>
      )}
      
      {/* Quick CSS for desktop nav visibility */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default App;
