import React, { useState } from 'react'
import { Mail, Lock, ShieldCheck, ChevronLeft } from 'lucide-react'

function AdminLogin({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simple mock check
    if (email === 'admin@tenniscourt.com' && password === 'admin123') {
      onLoginSuccess({ email, role: 'admin' })
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className="container flex-center fade-in" style={{ height: '100vh', padding: '20px' }}>
      <div className="glass-card flex-col items-center gap-lg" style={{ maxWidth: '400px', width: '100%', padding: '40px', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <img 
             src="/src/assets/tennis_logo_premium.png" 
             alt="Logo" 
             style={{ width: '100px', height: '100px', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0,0,0,0.12)', background: '#fff', padding: '10px' }} 
             onError={(e) => { e.target.style.display = 'none'; }}
           />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Staff Login</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>เข้าสู่ระบบสำหรับเจ้าหน้าที่จัดการสนาม</p>
        </div>

        {error && <div style={{ color: '#ff4d4d', fontSize: '0.85rem', background: '#fff1f0', padding: '10px', borderRadius: '4px', width: '100%', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-md" style={{ width: '100%' }}>
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.8rem', color: '#333', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tenniscourt.com" 
                className="premium-input" 
                style={{ paddingLeft: '40px', background: '#f8f9fa', color: '#000', border: '1px solid #ddd' }}
                required
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.8rem', color: '#333', fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="premium-input" 
                style={{ paddingLeft: '40px', background: '#f8f9fa', color: '#000', border: '1px solid #ddd' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="premium-button" style={{ background: '#1a1a3a', color: '#fff', marginTop: '10px' }}>
             Login
          </button>
        </form>

        <button 
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', marginTop: '10px' }}
        >
          <ChevronLeft size={16} /> กลับหน้าหลัก
        </button>
      </div>
    </div>
  )
}

export default AdminLogin
