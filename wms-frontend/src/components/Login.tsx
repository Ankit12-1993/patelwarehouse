import React, { useState } from 'react';

interface LoginProps {
  onLogin: (role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // MVP Mock Authentication
    if (email === 'admin@warehouse.com' && password === 'admin') {
      onLogin('admin');
    } else if (email === 'vendor@warehouse.com' && password === 'vendor') {
      onLogin('vendor');
    } else {
      alert("Invalid credentials. Try admin@warehouse.com / admin");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>Sign In</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>MVP Demo: Use admin@warehouse.com / admin</p>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="email" placeholder="Email" required value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px' }}
        />
        <input 
          type="password" placeholder="Password" required value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Login
        </button>
      </form>
    </div>
  );
}
