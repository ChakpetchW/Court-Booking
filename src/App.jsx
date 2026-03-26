import React, { useState, useEffect } from 'react'
import { Menu, User, Wallet, History, LogOut, Calendar, CircleDot, Filter, ChevronLeft, ChevronRight, Clock, QrCode, CreditCard, CheckCircle2 } from 'lucide-react'
import Login from './pages/Login'
import ProfileRegistration from './pages/ProfileRegistration'
import ProfileDashboard from './pages/Profile'
import Booking from './pages/Booking'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import './App.css'

const INITIAL_COURTS = [
  { id: 1, name: 'North-1', type: 'Badminton', orientation: 'v', pos: { x: 80, y: 15 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 2, name: 'North-2', type: 'Badminton', orientation: 'v', pos: { x: 50, y: 15 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 3, name: 'North-3', type: 'Badminton', orientation: 'v', pos: { x: 20, y: 15 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 4, name: 'Center-1', type: 'Badminton', orientation: 'v', pos: { x: 80, y: 48 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 5, name: 'Center-2', type: 'Tennis', orientation: 'h', pos: { x: 35, y: 48 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 6, name: 'South-1', type: 'Badminton', orientation: 'v', pos: { x: 80, y: 80 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 7, name: 'South-2', type: 'Badminton', orientation: 'v', pos: { x: 50, y: 80 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
  { id: 8, name: 'South-3', type: 'Badminton', orientation: 'v', pos: { x: 20, y: 80 }, allotment: Array(18).fill(null).map(() => ({ isOpen: true, bookedBy: null, pendingBy: null })) },
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
        style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <div style={{ background: 'var(--accent-secondary)', color: 'var(--accent-primary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <CircleDot size={20} strokeWidth={3} />
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>TENNIS COURT</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setShowMenu(!showMenu)}>
           <span style={{ fontSize: '0.9rem', color: '#333' }}>{user.name}</span>
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
            <button className="secondary-button" style={{ color: '#333', textAlign: 'left', border: 'none' }} onClick={() => {
                localStorage.removeItem('court_user')
                window.location.reload()
              }}>
              <LogOut size={16} style={{ marginRight: '8px' }} /> ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

const HistoryView = ({ bookingHistory, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  const months = [
    { value: 'all', label: 'ทุกเดือน' },
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' }
  ];

  // Filtering
  const filteredRecords = bookingHistory.filter(b => {
    const bDate = b.booking_date || b.date;
    if (!bDate) return true;
    const [y, m] = bDate.split('-');
    
    const matchesMonth = monthFilter === 'all' || m === monthFilter;
    const matchesYear = y === yearFilter.toString();
    
    return matchesMonth && matchesYear;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 if filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, yearFilter]);

  return (
    <div className="container fade-in" style={{ maxWidth: '700px', paddingBottom: '100px' }}>
      <div className="glass-card flex-col gap-md" style={{ background: '#fff', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#1a5928', fontFamily: 'var(--font-heading)', margin: 0 }}>ประวัติการจอง</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select 
              value={monthFilter} 
              onChange={(e) => setMonthFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.85rem' }}
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.85rem' }}
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {currentRecords.length === 0 ? (
          <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', background: '#f9f9f9', borderRadius: '16px' }}>
            <span style={{ fontSize: '3rem' }}>📋</span>
            ไม่พบประวัติการจองในช่วงเวลานี้
          </div>
        ) : (
          <>
            <div className="flex-col gap-md">
              {currentRecords.map((b, i) => (
                <div key={i} className="glass-card" style={{ background: '#f8fffe', border: '1px solid #e0f2f1', padding: '20px', borderRadius: '16px', transition: 'transform 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="flex-col gap-xs">
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a1a3a' }}>{b.court_name || b.court}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{b.venue_name || 'Tennis Court'}</div>
                      <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} /> {b.booking_date || b.date} · {b.booking_time || b.time}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> ชำระเมื่อ: {b.created_at ? new Date(b.created_at).toLocaleString('th-TH') : (b.paidAt || '-')}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px', fontFamily: 'monospace' }}>#{b.transaction_ref ? b.transaction_ref.substring(0, 12) : (b.bookingNo || b.id)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        background: b.status === 'Paid' ? '#e6fffa' : (b.status === 'Cancelled' ? '#fff5f5' : '#fffbea'), 
                        color: b.status === 'Paid' ? '#2c7a7b' : (b.status === 'Cancelled' ? '#c53030' : '#b7791f'), 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '800' 
                      }}>
                        {b.status === 'Paid' ? 'ชำระแล้ว' : (b.status === 'Cancelled' ? 'ยกเลิกแล้ว' : 'รอชำระเงิน')}
                      </span>
                      <div style={{ marginTop: '12px', fontWeight: '900', color: b.status === 'Paid' ? '#00b894' : '#555', fontSize: '1.2rem' }}>฿{Math.floor(Number(b.price || 500)).toLocaleString('th-TH')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', color: currentPage === 1 ? '#ccc' : '#1a5928' }}
                >
                  <ChevronLeft size={24} />
                </button>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1a5928' }}>
                  หน้า {currentPage} จาก {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'default' : 'pointer', color: currentPage === totalPages ? '#ccc' : '#1a5928' }}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
        
        <button onClick={onBack} className="premium-button" style={{ marginTop: '20px', background: '#1a5928' }}>กลับหน้าหลัก</button>
      </div>
    </div>
  );
}

const PAYMENT_METHODS_WALLET = [
  { id: 'qr',     name: 'PromptPay QR',  icon: <QrCode size={26} />,     desc: 'สแกนจ่ายด้วยแอปธนาคาร' },
  { id: 'credit', name: 'Credit/Debit',  icon: <CreditCard size={26} />, desc: 'Visa / Mastercard' },
]

const WalletView = ({ balance, onTopUp, onBack }) => {
  const QUICK_AMOUNTS = [100, 200, 500, 1000]
  const [step, setStep] = useState('home')      // home | selectAmount | selectMethod | qr | success
  const [selectedAmt, setSelectedAmt] = useState(500)
  const [customAmt, setCustomAmt] = useState('')
  const [method, setMethod] = useState('qr')
  const [timeLeft, setTimeLeft] = useState(900)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (step !== 'qr') return
    if (timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [step, timeLeft])

  const formatTime = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`
  const finalAmt = customAmt > 0 ? Number(customAmt) : selectedAmt

  const handleConfirmTopUp = () => {
    setProcessing(true)
    setTimeout(() => { setProcessing(false); setStep('qr') }, 1200)
  }

  const handlePaymentDone = () => {
    onTopUp(finalAmt)
    setStep('success')
  }

  if (step === 'success') return (
    <div className="container fade-in">
      <div className="glass-card flex-col gap-md" style={{ background: '#fff', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #00b894, #00cec9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle2 size={40} color="#fff" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a1a3a' }}>เติมเงินสำเร็จ! 🎉</h2>
        <p style={{ color: '#666' }}>ยอดเงิน wallet ของคุณเพิ่มขึ้น</p>
        <div style={{ background: '#f8fffe', borderRadius: '12px', padding: '20px', border: '1px solid #e0f2f1' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00b894' }}>+฿{finalAmt.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>ยอดคงเหลือใหม่: ฿{Math.floor(balance + finalAmt).toLocaleString('th-TH')}</div>
        </div>
        <button className="premium-button" style={{ width: '100%', marginTop: '12px' }} onClick={onBack}>กลับหน้าหลัก</button>
      </div>
    </div>
  )

  if (step === 'qr') return (
    <div className="container fade-in" style={{ maxWidth: '500px' }}>
      <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
        <div style={{ padding: '20px 24px', background: 'var(--accent-primary)', color: '#fff', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={20} /> สแกนจ่ายเพื่อเติมเงิน
           </span>
           <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
             {formatTime(timeLeft)}
           </span>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', background: '#fff' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #eee' }}>
            <div style={{ background: '#00467f', color: '#fff', padding: '8px', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay_logo.svg" alt="PromptPay" style={{ height: '18px', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>THAI QR PAYMENT</span>
            </div>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TOPUP_WALLET_${finalAmt}`} alt="QR" style={{ width: '250px', height: '250px', display: 'block' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a1a3a', marginBottom: '8px' }}>฿{finalAmt.toLocaleString()}</div>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '32px' }}>สแกน QR เพื่อชำระ — เงินจะเข้า Wallet ทันที</p>
          <button className="premium-button" style={{ width: '100%' }} onClick={handlePaymentDone}>
            ฉันชำระเงินเรียบร้อยแล้ว
          </button>
          <button onClick={() => setStep('home')} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#666', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fade-in" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
      <div className="container-wide">
        <div className="booking-layout-grid">
           {/* Left Column: Balance & Amount Selection */}
           <div className="flex-col gap-lg">
              {/* Header Card (Balance) */}
              <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden' }}>
                 <div style={{ padding: '20px 24px', background: 'var(--accent-primary)', color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>กระเป๋าเงินของคุณ</div>
                 <div style={{ padding: '40px 32px', textAlign: 'center', background: '#fff' }}>
                    <div style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>ยอดเงินคงเหลือปัจจุบัน</div>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                      ฿{Math.floor(balance).toLocaleString()}
                    </div>
                 </div>
              </div>

              {/* Amount Selection Card */}
              <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden' }}>
                 <div style={{ padding: '20px 24px', background: '#f8f9fa', borderBottom: '1px solid #eee', fontWeight: '700', fontSize: '1rem' }}>ระบุจำนวนเงินที่ต้องการเติม</div>
                 <div style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                       {QUICK_AMOUNTS.map(amt => (
                          <button key={amt} onClick={() => { setSelectedAmt(amt); setCustomAmt('') }}
                            style={{ 
                               padding: '20px 8px', borderRadius: '12px', border: `2px solid ${selectedAmt === amt && !customAmt ? 'var(--accent-primary)' : '#eee'}`,
                               background: selectedAmt === amt && !customAmt ? 'var(--accent-court)' : '#fff',
                               color: selectedAmt === amt && !customAmt ? 'var(--accent-primary)' : '#333',
                               fontWeight: '700', fontSize: '1.2rem', transition: 'all 0.15s'
                            }}>
                             ฿{amt.toLocaleString()}
                          </button>
                       ))}
                    </div>
                    <div className="flex-col gap-xs">
                       <label style={{ fontSize: '0.85rem', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>หรือระบุจำนวนเงินเอง</label>
                       <input type="number" placeholder="เช่น 300" value={customAmt}
                         onChange={e => setCustomAmt(e.target.value)} 
                         style={{ width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: '700', border: customAmt ? '2px solid var(--accent-primary)' : '1px solid #ddd' }} />
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Payment Method & Summary (Sticky) */}
           <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
              <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden' }}>
                 <div style={{ padding: '20px 24px', background: 'var(--accent-primary)', color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>วิธีการชำระเงิน</div>
                 <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {PAYMENT_METHODS_WALLET.map(m => (
                       <div key={m.id} onClick={() => setMethod(m.id)} style={{
                          padding: '16px 20px', border: `2px solid ${method === m.id ? 'var(--accent-primary)' : '#eee'}`,
                          borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                          background: method === m.id ? 'var(--accent-court)' : '#fff', transition: 'all 0.15s'
                       }}>
                          <div style={{ color: method === m.id ? 'var(--accent-primary)' : '#999' }}>{m.icon}</div>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: '700', fontSize: '1rem' }}>{m.name}</div>
                             <div style={{ fontSize: '0.8rem', color: '#888' }}>{m.desc}</div>
                          </div>
                          <input type="radio" checked={method === m.id} readOnly style={{ width: '18px', height: '18px' }} />
                       </div>
                    ))}

                    <div style={{ borderTop: '2px dashed #eee', margin: '16px 0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ color: '#666', fontWeight: '600' }}>ยอดเติมเงินรวม</span>
                       <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>฿{finalAmt.toLocaleString()}</span>
                    </div>

                    <button className="premium-button" style={{ width: '100%', padding: '20px' }} onClick={handleConfirmTopUp} disabled={processing}>
                       {processing ? 'กำลังดำเนินการ...' : 'ยืนยันการเติมเงิน'}
                    </button>
                    <button onClick={onBack} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#666', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
                       ย้อนกลับ
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {processing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
           <div className="loading-spinner" style={{ width: '50px', height: '50px', border: '4px solid #eee', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
           <p style={{ fontWeight: '700', color: '#333' }}>กำลังเตรียมการชำระเงิน...</p>
        </div>
      )}
    </div>
  )
}

function App() {
  // Load persisted user from localStorage on first render
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('court_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [adminUser, setAdminUser] = useState(null)
  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem('court_user')
      return saved ? 'profile' : 'login'
    } catch { return 'login' }
  })
  const [currentBooking, setCurrentBooking] = useState(null)
  const [courts, setCourts] = useState(INITIAL_COURTS)
  const [mockDatabase, setMockDatabase] = useState(() => {
    try {
      const saved = localStorage.getItem('court_users_db')
      return saved ? JSON.parse(saved) : MOCKED_DB
    } catch { return MOCKED_DB }
  })
  const [bookingHistory, setBookingHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('court_booking_history')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [walletBalance, setWalletBalance] = useState(() => {
    try { return Number(localStorage.getItem('court_wallet') || 0) } catch { return 0 }
  })

  // Persist user database (so phone lookup works after logout)
  const updateUserDB = (updater) => {
    setMockDatabase(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('court_users_db', JSON.stringify(next))
      return next
    })
  }

  // Update wallet — tries API first, falls back to localStorage
  const updateWallet = async (updater) => {
    const currentBalance = walletBalance
    const amount = typeof updater === 'function' ? updater(currentBalance) - currentBalance : updater

    try {
      const res = await fetch('api/index.php?action=topup_wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id, phone: user?.phone, amount })
      })
      const data = await res.json()
      if (data.wallet_balance !== undefined) {
        setWalletBalance(data.wallet_balance)
        localStorage.setItem('court_wallet', data.wallet_balance)
        return
      }
    } catch {
      console.warn('Wallet API unavailable, using localStorage fallback.')
    }

    // Fallback: update locally
    setWalletBalance(prev => {
      const next = prev + amount
      localStorage.setItem('court_wallet', next)
      return next
    })
  }

  // Persist booking history
  const addBookingToHistory = (booking) => {
    setBookingHistory(prev => {
      const next = [booking, ...prev]
      localStorage.setItem('court_booking_history', JSON.stringify(next))
      return next
    })
  }

  const fetchCourts = async () => {
    try {
      const res = await fetch(`api/index.php?action=get_rates&t=${Date.now()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setCourts(prev => prev.map(court => {
          const match = data.find(r => r.id === court.id)
          return match ? { ...court, price_per_hour: match.rate } : court
        }))
      }
    } catch (err) { console.error('Fetch courts metadata error:', err) }
  }

  const fetchStatus = async (dateArg) => {
    const date = dateArg || new Date().toLocaleDateString('sv-SE')
    try {
      const res = await fetch(`api/index.php?action=get_all_status&date=${date}&t=${Date.now()}`)
      const data = await res.json()
      
      setCourts(prev => prev.map(court => {
        const courtAllotments = Array.isArray(data) ? data.filter(a => parseInt(a.court_id) === court.id) : []
        return {
          ...court,
          allotment: INITIAL_COURTS.find(ic => ic.id === court.id).allotment.map((slot, i) => {
            const hourStr = (i + 6).toString().padStart(2, '0') + ':00'
            const match = courtAllotments.find(a => a.hour === hourStr)
            return match ? {
              isOpen: match.is_open === null ? true : !!parseInt(match.is_open),
              bookedBy: match.booked_by,
              pendingBy: match.pending_by
            } : { ...slot, isOpen: true, bookedBy: null, pendingBy: null }
          })
        }
      }))
    } catch (err) {
      console.warn('Backend API not reachable, using local state.', err)
    }
  }

  const fetchAdminBookings = async (dateArg) => {
    const date = dateArg || new Date().toLocaleDateString('sv-SE')
    try {
      const res = await fetch(`api/index.php?action=get_admin_bookings&date=${date}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setBookingHistory(data.map(b => ({
          ...b,
          court: b.court_name,
          time: b.booking_time,
          date: b.booking_date,
          user: { name: b.user_name, phone: b.user_phone }
        })))
      }
    } catch (err) {
      console.error('Fetch admin bookings error:', err)
    }
  }

  const fetchUserHistory = async (userId) => {
    if (!userId) return
    try {
      const res = await fetch(`api/index.php?action=get_user_history&user_id=${userId}&t=${Date.now()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setBookingHistory(data)
      }
    } catch (err) { console.error('Fetch history error:', err) }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      alert('ชำระเงินสำเร็จแล้ว! ระบบกำลังบันทึกข้อมูลการจองของคุณครับ');
      // Clean up the URL so it doesn't alert again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Refresh history immediately
      if (user?.id) {
        fetchUserHistory(user.id);
      }
      setView('history');
    }
  }, []);

  useEffect(() => {
    if (user?.id) fetchUserHistory(user.id)
  }, [user?.id])

  const fetchUserBalance = async (userId) => {
    if (!userId) return
    try {
      const res = await fetch(`api/index.php?action=login_by_id&id=${userId}&t=${Date.now()}`)
      const data = await res.json()
      if (data && data.wallet_balance !== undefined) {
        const balance = Number(data.wallet_balance)
        setWalletBalance(balance)
        localStorage.setItem('court_wallet', balance)
        // Also update user object in state and localStorage
        setUser(prev => {
          const next = { ...prev, wallet_balance: balance }
          localStorage.setItem('court_user', JSON.stringify(next))
          return next
        })
      }
    } catch (err) { console.warn('Fetch balance error:', err) }
  }

  useEffect(() => {
    console.log("System Date Debug (sv-SE):", new Date().toLocaleDateString('sv-SE'));
    fetchStatus()
    fetchCourts() // Fetch prices on mount
    if (user?.id) fetchUserBalance(user.id)
    const interval = setInterval(() => {
        fetchStatus()
        fetchCourts()
        if (user?.id) {
          fetchUserBalance(user.id)
          fetchUserHistory(user.id)
        }
      }, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [user?.id])

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
    // adminPassword removed - handled by DB
  });

  const handleLoginSuccess = async (phone) => {
    // 1. Check localStorage first (fast, offline-friendly)
    try {
      const saved = localStorage.getItem('court_user')
      if (saved) {
        const savedUser = JSON.parse(saved)
        if (savedUser.phone === phone) {
          setUser(savedUser)
          setView('profile')
          return
        }
      }
    } catch {}

    // 2. Try the real API
    try {
      const res = await fetch('api/index.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (data && data.id) {
        const loggedIn = { ...data, isRegistered: true }
        setUser(loggedIn)
        localStorage.setItem('court_user', JSON.stringify(loggedIn))
        if (data.wallet_balance !== undefined) {
          const bal = Number(data.wallet_balance)
          setWalletBalance(bal)
          localStorage.setItem('court_wallet', bal.toString())
        }
        setView('profile')
        return
      }
    } catch (err) {
      console.warn('API not reachable, using local fallback.')
    }

    // 3. Check local DB (persisted in localStorage — works even after logout)
    const existingUser = mockDatabase.find(u => u.phone === phone)
    if (existingUser) {
      setUser(existingUser)
      localStorage.setItem('court_user', JSON.stringify(existingUser))
      setView('profile')
    } else {
      setUser({ phone, isRegistered: false })
      setView('registration')
    }
  }

  const handleRegistrationComplete = async (data) => {
    let newUser

    // Convert birthday dd/mm/yyyy → yyyy-mm-dd for MySQL
    const convertBirthday = (bday) => {
      if (!bday) return null
      // Already in yyyy-mm-dd format
      if (/^\d{4}-\d{2}-\d{2}$/.test(bday)) return bday
      // Convert from dd/mm/yyyy
      const parts = bday.split('/')
      if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`
      return bday
    }

    const payload = {
      ...user,
      ...data,
      birthday: convertBirthday(data.birthday),
      line_id: data.lineId
    }

    try {
      const res = await fetch('api/index.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const resData = await res.json()
      console.log('[Register API response]', resData)
      if (resData && resData.id) {
        newUser = { ...user, ...data, id: resData.id, isRegistered: true, wallet_balance: 0 }
      } else {
        console.warn('[Register API error]', resData?.error || resData)
        throw new Error(resData?.error || 'Registration failed')
      }
    } catch (err) {
      console.warn('API Error, mock fallback:', err.message)
      newUser = { ...user, ...data, id: mockDatabase.length + 1, isRegistered: true }
    }
    setUser(newUser)
    updateUserDB(prev => [...prev.filter(u => u.phone !== newUser.phone), newUser])
    // Persist to localStorage so login skips registration next time
    localStorage.setItem('court_user', JSON.stringify(newUser))
    setView('profile')
  }

  const handleStartBooking = () => {
    setView('booking')
  }

  const handleBookingConfirm = async (bookingData) => {
    const courtRef = INITIAL_COURTS.find(c => c.name === (bookingData.court?.name || bookingData.court))
    const bookingDate = bookingData.date 
    
    // Show some loading status if possible, but here we just await the API
    try {
      const res = await fetch('api/index.php?action=set_pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          court_id: courtRef?.id, 
          date: bookingDate,
          hour: bookingData.time,
          name: user.name,
          user_id: user.id,
          price: bookingData.price,
          phone: user.phone
        })
      })
      const result = await res.json()
      if (result.success && result.booking_id) {
        // Use the REAL database ID returned from the server
        setCurrentBooking({ ...bookingData, id: result.booking_id })
        setView('checkout')
      } else {
        alert('ไม่สามารถเตรียมการจองได้ในขณะนี้: ' + (result.error || 'Unknown error'))
      }
    } catch(err) { 
      console.error('[set_pending] API Error:', err)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handleCancelBooking = async () => {
    if (currentBooking) {
      const courtRef = INITIAL_COURTS.find(c => c.name === (currentBooking.court?.name || currentBooking.court))
      const bookingDate = currentBooking.date
      try {
        await fetch('api/index.php?action=clear_pending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            court_id: courtRef?.id,
            date: bookingDate,
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
      const courtRef = INITIAL_COURTS.find(c => c.name === (currentBooking.court?.name || currentBooking.court))
      const bookingDate = currentBooking.date  // actual selected date (yyyy-mm-dd)
      try {
        const res = await fetch('api/index.php?action=confirm_booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: user.id || 1,
            user_name: user.name,
            court_id: courtRef?.id, 
            date: bookingDate,
            hour: currentBooking.time,
            price: currentBooking.price || 500,
            payment_provider: currentBooking.paymentMethod || 'omise',
            booking_id: currentBooking.id
          })
        })
        const result = await res.json()
        console.log('[confirm_booking]', result)
        if (!result.success) console.warn('[confirm_booking] API error:', result)
      } catch(err) { console.error('[confirm_booking] API Error:', err) }

      setCourts(prev => prev.map(c => 
        (c.name === (currentBooking.court?.name || currentBooking.court))
          ? { 
              ...c, 
              allotment: c.allotment.map((a, i) => {
                const hourStr = (i + 6).toString().padStart(2, '0') + ':00';
                return hourStr === currentBooking.time 
                  ? { ...a, bookedBy: user.name, pendingBy: null, isOpen: false } 
                  : a
              }) 
            }
          : c
      ))

      addBookingToHistory({ ...currentBooking, paidAt: new Date().toLocaleString('th-TH') })
      if (user?.id) fetchUserHistory(user.id)
    }

    if (currentBooking?.date) await fetchStatus(currentBooking.date)
    else await fetchStatus()
    
    setCurrentBooking(null)
    // Force a full state reset by going to profile and ensuring next booking starts fresh
    setView('profile')
  }

  return (
    <div className="app-shell" style={{ background: view === 'login' || view === 'registration' ? 'var(--bg-dark)' : '#f4f7f6', color: '#333' }}>
      <Header user={user?.isRegistered ? user : null} onViewChange={setView} />
      
      {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} apiSettings={apiSettings} />}
      {view === 'registration' && <ProfileRegistration onComplete={handleRegistrationComplete} />}
      
      {view === 'profile' && (
        <ProfileDashboard user={user} walletBalance={walletBalance} onStartBooking={handleStartBooking} onAdmin={() => setView('admin')} />
      )}
      
      {view === 'history' && <HistoryView bookingHistory={bookingHistory} onBack={() => setView('profile')} />}
      {view === 'wallet' && (
        <WalletView
          balance={walletBalance}
          onTopUp={(amt) => updateWallet(amt)}
          onBack={() => setView('profile')}
        />
      )}
      
      {view === 'booking' && (
        <Booking 
          user={user} 
          courts={courts}
          fetchStatus={fetchStatus}
          onBack={() => setView('profile')} 
          onCheckout={handleBookingConfirm} 
        />
      )}
      
      {view === 'checkout' && (
        <Checkout 
          user={user} 
          booking={currentBooking} 
          walletBalance={walletBalance}
          apiSettings={apiSettings}
          onBack={handleCancelBooking}
          onComplete={handlePaymentComplete}
          updateWallet={updateWallet}
          INITIAL_COURTS={INITIAL_COURTS}
        />
      )}
      
      {view === 'admin' && (
        <Admin 
          courts={courts}
          onUpdateCourts={setCourts}
          fetchStatus={fetchStatus}
          fetchAdminBookings={fetchAdminBookings}
          bookingHistory={bookingHistory}
          users={mockDatabase}
          onUpdateUsers={updateUserDB}
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
