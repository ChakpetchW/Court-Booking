import React, { useState, useEffect } from 'react'
import { Menu, User, Wallet, History, LogOut, Calendar } from 'lucide-react'
import Login from './pages/Login'
import ProfileRegistration from './pages/ProfileRegistration'
import ProfileDashboard from './pages/Profile'
import Booking from './pages/Booking'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import './App.css'

const INITIAL_COURTS = [
  { id: 1, name: 'North-1', type: 'Badminton', pos: { x: 80, y: 20 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 2, name: 'North-2', type: 'Badminton', pos: { x: 50, y: 20 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 3, name: 'North-3', type: 'Badminton', pos: { x: 20, y: 20 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 4, name: 'Center-1', type: 'Badminton', pos: { x: 80, y: 50 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 5, name: 'Center-2', type: 'Tennis', pos: { x: 40, y: 50 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 6, name: 'South-1', type: 'Badminton', pos: { x: 80, y: 80 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 7, name: 'South-2', type: 'Badminton', pos: { x: 50, y: 80 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 8, name: 'South-3', type: 'Badminton', pos: { x: 20, y: 80 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
]

const MOCKED_DB = [
  { id: 1, phone: '081-234-5678', name: 'จักรเพชร วิวัฒน์ชาติสุคนธ์', nickname: 'Aof', email: 'test@booking.co.th', birthday: '1995-01-01', isRegistered: true }
]

const Header = ({ user, onViewChange }) => {
  const [showMenu, setShowMenu] = useState(false)

  if (!user) return null

  const navigate = (view) => {
    onViewChange(view)
    setShowMenu(false)
  }

  return (
    <header className="header-nav">
      <div 
        className="brand" 
        onClick={() => onViewChange('profile')}
        style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent-primary)', cursor: 'pointer' }}
      >
        TENNIS COURT
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setShowMenu(!showMenu)}>
           <span style={{ fontSize: '0.9rem', color: '#333' }}>{user.name}</span>
           <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
           </div>
           <Menu size={20} color="#333" />
        </div>
        
        {showMenu && (
          <div className="glass-card flex-col fade-in" style={{ 
            position: 'absolute', top: '48px', right: 0, width: '220px', 
            background: '#fff', border: '1px solid #eee', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            zIndex: 1001, padding: '8px' 
          }}>
            <button className="secondary-button" style={{ color: '#333', textAlign: 'left', border: 'none' }} onClick={() => navigate('booking')}>
              <Calendar size={16} style={{ marginRight: '8px' }} /> จองสนาม
            </button>
            <button className="secondary-button" style={{ color: '#333', textAlign: 'left', border: 'none' }} onClick={() => navigate('wallet')}>
              <Wallet size={16} style={{ marginRight: '8px' }} /> เติมเงิน
            </button>
            <button className="secondary-button" style={{ color: '#333', textAlign: 'left', border: 'none' }} onClick={() => navigate('history')}>
              <History size={16} style={{ marginRight: '8px' }} /> ประวัติการจอง
            </button>
            <button className="secondary-button" style={{ color: '#333', textAlign: 'left', border: 'none' }} onClick={() => navigate('profile')}>
              <User size={16} style={{ marginRight: '8px' }} /> ข้อมูลส่วนตัว
            </button>
            <div style={{ borderTop: '1px solid #eee', margin: '4px 0' }} />
            <button className="secondary-button" style={{ color: '#333', textAlign: 'left', border: 'none' }} onClick={() => window.location.reload()}>
              <LogOut size={16} style={{ marginRight: '8px' }} /> ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

const HistoryView = ({ onBack }) => (
  <div className="container fade-in">
    <div className="glass-card flex-col gap-md" style={{ background: '#fff', padding: '24px' }}>
      <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>ประวัติการจอง</h2>
      <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.9rem' }}>
        ยังไม่มีประวัติการจองในขณะนี้
      </div>
      <button onClick={onBack} className="premium-button">กลับหน้าหลัก</button>
    </div>
  </div>
)

const WalletView = ({ user, onBack }) => (
  <div className="container fade-in">
    <div className="glass-card flex-col gap-md" style={{ background: '#fff', padding: '24px' }}>
      <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>กระเป๋าเงินของฉัน</h2>
      <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>ยอดเงินคงเหลือ</span>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>฿0.00</div>
      </div>
      <button className="premium-button">เติมเงิน</button>
      <button onClick={onBack} className="secondary-button">กลับหน้าหลัก</button>
    </div>
  </div>
)

function App() {
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [view, setView] = useState('login')
  const [currentBooking, setCurrentBooking] = useState(null)

  const [courts, setCourts] = useState(INITIAL_COURTS)
  const [mockDatabase, setMockDatabase] = useState(MOCKED_DB)

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/index.php?action=get_all_status')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCourts(prev => prev.map(court => {
          const courtAllotments = data.filter(a => parseInt(a.court_id) === court.id)
          return {
            ...court,
            allotment: court.allotment.map((slot, i) => {
              const hourStr = (i + 6).toString().padStart(2, '0') + ':00'
              const match = courtAllotments.find(a => a.hour === hourStr)
              return match ? {
                isOpen: !!parseInt(match.is_open),
                bookedBy: match.booked_by,
                pendingBy: match.pending_by
              } : slot
            })
          }
        }))
      }
    } catch (err) {
      console.warn('Backend API not reachable, using local state.', err)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin/login') {
        setView('adminLogin')
      } else if (window.location.hash === '#admin' && adminUser) {
        setView('admin')
      }
    }
    window.addEventListener('hashchange', handleHash)
    // Initial check
    if (window.location.hash === '#admin/login') setView('adminLogin')
    return () => window.removeEventListener('hashchange', handleHash)
  }, [adminUser])
  const [apiSettings, setApiSettings] = useState({
    otpWebhookUrl: '',
    otpMethod: 'GET',
    otpApiKey: '',
    otpApiSecret: '',
    paymentWebhookUrl: '',
    paymentMethod: 'POST',
    adminPassword: '123'
  })

  const handleLoginSuccess = async (phone) => {
    try {
      const res = await fetch('/api/index.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (data && data.id) {
        setUser({ ...data, isRegistered: true })
        setView('profile')
      } else {
        setUser({ phone, isRegistered: false })
        setView('registration')
      }
    } catch (err) {
      console.warn('API Error, mock fallback:', err)
      const existingUser = mockDatabase.find(u => u.phone === phone)
      if (existingUser) {
        setUser(existingUser)
        setView('profile')
      } else {
        setUser({ phone, isRegistered: false })
        setView('registration')
      }
    }
  }

  const handleRegistrationComplete = async (data) => {
    try {
      const res = await fetch('/api/index.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, ...data })
      })
      const resData = await res.json()
      if (resData && resData.id) {
        const newUser = { ...user, ...data, id: resData.id, isRegistered: true }
        setUser(newUser)
        setMockDatabase(prev => [...prev, newUser])
      } else {
        throw new Error('Registration failed')
      }
    } catch (err) {
      console.error('API Error, mock fallback:', err)
      const newUser = { ...user, ...data, id: mockDatabase.length + 1, isRegistered: true }
      setUser(newUser)
      setMockDatabase(prev => [...prev, newUser])
    }
    setView('profile')
  }

  const handleStartBooking = () => {
    setView('booking')
  }

  const handleBookingConfirm = async (bookingData) => {
    setCurrentBooking(bookingData)
    // 1. Update DB (SET PENDING LOCK)
    const courtRef = INITIAL_COURTS.find(c => c.name === bookingData.court)
    try {
      await fetch('/api/index.php?action=set_pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          court_id: courtRef.id, 
          date: new Date().toISOString().split('T')[0], // Assuming today
          hour: bookingData.time,
          name: user.name 
        })
      })
    } catch(err) { console.error('API Error:', err) }

    // 2. Local fallback
    setCourts(prev => prev.map(c => 
      c.name === bookingData.court 
        ? { 
            ...c, 
            allotment: c.allotment.map((a, i) => {
              const hourStr = (i + 6).toString().padStart(2, '0') + ':00';
              return hourStr === bookingData.time 
                ? { ...a, pendingBy: user.name } 
                : a
            }) 
          }
        : c
    ))
    setView('checkout')
  }

  const handleCancelBooking = async () => {
    if (currentBooking) {
      const courtRef = INITIAL_COURTS.find(c => c.name === currentBooking.court)
      try {
        await fetch('/api/index.php?action=clear_pending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            court_id: courtRef.id, 
            date: new Date().toISOString().split('T')[0],
            hour: currentBooking.time
          })
        })
      } catch(err) { console.error('API Error:', err) }

      setCourts(prev => prev.map(c => 
        c.name === currentBooking.court 
          ? { 
              ...c, 
              allotment: c.allotment.map((a, i) => {
                const hourStr = (i + 6).toString().padStart(2, '0') + ':00';
                return hourStr === currentBooking.time 
                  ? { ...a, pendingBy: null } 
                  : a
              }) 
            }
          : c
      ))
    }
    setView('booking')
    setCurrentBooking(null)
  }

  const handlePaymentComplete = async () => {
    if (currentBooking) {
      const courtRef = INITIAL_COURTS.find(c => c.name === currentBooking.court)
      try {
        await fetch('/api/index.php?action=confirm_booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: user.id || 1,
            court_id: courtRef.id, 
            date: new Date().toISOString().split('T')[0],
            hour: currentBooking.time,
            price: currentBooking.price
          })
        })
      } catch(err) { console.error('API Error:', err) }

      setCourts(prev => prev.map(c => 
        c.name === currentBooking.court 
          ? { 
              ...c, 
              allotment: c.allotment.map((a, i) => {
                const hourStr = (i + 6).toString().padStart(2, '0') + ':00';
                return hourStr === currentBooking.time 
                  ? { ...a, bookedBy: user.name, pendingBy: null } 
                  : a
              }) 
            }
          : c
      ))
    }

    if (apiSettings?.paymentWebhookUrl) {
      fetch(apiSettings.paymentWebhookUrl, { 
        method: apiSettings.paymentMethod,
        body: apiSettings.paymentMethod === 'POST' ? JSON.stringify({ booking: currentBooking, user }) : null,
        headers: apiSettings.paymentMethod === 'POST' ? { 'Content-Type': 'application/json' } : {}
      }).catch(err => console.log('Payment Webhook simulated:', err))
    }
    alert('การจองสำเร็จ! ขอบคุณที่ใช้บริการ')
    fetchStatus() // Refresh all
    setView('profile')
  }

  return (
    <div className="app-shell" style={{ background: view === 'login' || view === 'registration' ? 'var(--bg-dark)' : '#f4f7f6', color: '#333' }}>
      <Header user={user?.isRegistered ? user : null} onViewChange={setView} />
      
      {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} apiSettings={apiSettings} />}
      {view === 'registration' && <ProfileRegistration onComplete={handleRegistrationComplete} />}
      
      {view === 'profile' && (
        <ProfileDashboard user={user} onStartBooking={handleStartBooking} onAdmin={() => setView('admin')} />
      )}
      
      {view === 'history' && <HistoryView onBack={() => setView('profile')} />}
      {view === 'wallet' && <WalletView user={user} onBack={() => setView('profile')} />}
      
      {view === 'booking' && (
        <Booking 
          user={user} 
          courts={courts}
          onBack={() => setView('profile')} 
          onCheckout={handleBookingConfirm} 
        />
      )}
      
      {view === 'checkout' && (
        <Checkout 
          user={user} 
          booking={currentBooking} 
          apiSettings={apiSettings}
          onBack={handleCancelBooking}
          onComplete={handlePaymentComplete}
        />
      )}
      
      {view === 'admin' && (
        <Admin 
          courts={courts}
          onUpdateCourts={setCourts}
          fetchStatus={fetchStatus}
          apiSettings={apiSettings}
          onUpdateSettings={setApiSettings}
          onBack={() => { setView('profile'); window.location.hash = ''; }} 
          onLogout={() => { setAdminUser(null); setView('login'); window.location.hash = ''; }}
        />
      )}

      {view === 'adminLogin' && (
        <AdminLogin 
          onLoginSuccess={(data) => {
            setAdminUser(data);
            setView('admin');
            window.location.hash = '#admin';
          }}
          onBack={() => { setView('login'); window.location.hash = ''; }}
        />
      )}
    </div>
  )
}

export default App
