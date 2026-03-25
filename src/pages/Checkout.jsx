import React, { useState, useEffect, useRef } from 'react'
import { QrCode, Wallet, CreditCard, Landmark, CheckCircle2, ChevronLeft, ShieldCheck, X } from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'promptpay', name: 'PromptPay', icon: <QrCode size={24} />, description: 'Scan QR Code' },
  { id: 'credit',    name: 'Credit/Debit', icon: <CreditCard size={24} />, description: 'Visa/Mastercard via 2C2P' },
  { id: 'alipay',   name: 'Alipay', icon: <Landmark size={24} />, description: 'Alipay' },
  { id: 'wechat_pay', name: 'WeChat Pay', icon: <CheckCircle2 size={24} />, description: 'WeChat Pay' },
  { id: 'wallet',   name: 'Wallet', icon: <Wallet size={24} />, description: 'My Wallet' },
]

function Checkout({ user, booking, apiSettings, onBack, onComplete }) {
  const [timeLeft, setTimeLeft]           = useState(900) // 15 min
  const [selectedMethod, setSelectedMethod] = useState('promptpay')
  const [isProcessing, setIsProcessing]   = useState(false)
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [agreed, setAgreed]               = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [qrCodeUrl, setQrCodeUrl]         = useState(null)
  const [authorizeUri, setAuthorizeUri]   = useState(null)
  const [currentBookingId, setCurrentBookingId] = useState(booking?.id || null)
  const pollRef = useRef(null)

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // Cleanup polling on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Poll backend every 3s after showing QR
  const startPolling = (bookingId) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/index.php?action=check_payment_status&booking_id=${bookingId}`)
        const data = await res.json()
        if (data.status === 'Paid') {
          clearInterval(pollRef.current)
          setPaymentSuccess(true)
        }
      } catch (err) { /* API not available yet, ignore */ }
    }, 3000)
  }

  const handlePay = async () => {
    if (!agreed) { alert('กรุณายอมรับข้อตกลงในการใช้บริการ'); return }

    // Wallet or non-Omise methods fall back to legacy flow
    if (selectedMethod === 'wallet') {
      setIsProcessing(true)
      setTimeout(() => { setIsProcessing(false); setShowPaymentFlow(true) }, 1500)
      return
    }

    // Credit/Debit → 2C2P (redirect flow — handled by backend in future phase)
    if (selectedMethod === 'credit') {
      alert('ระบบ Credit/Debit Card จะเปิดใช้งานเร็วๆนี้ กรุณาเลือกช่องทางอื่นก่อนครับ')
      return
    }

    // Omise: PromptPay, Alipay, WeChat
    setIsProcessing(true)
    try {
      const res = await fetch('/api/omise_charge.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:       selectedMethod,
          amount:     50000, // 500 THB in satangs
          booking_id: currentBookingId,
          court_id:   booking?.courtId,
          date:       booking?.date || new Date().toISOString().split('T')[0],
          hour:       booking?.time,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setQrCodeUrl(data.qr_code_uri)
      setAuthorizeUri(data.authorize_uri)
      setShowPaymentFlow(true)
      startPolling(currentBookingId)

      // Redirect-based methods (Alipay, WeChat) → open in new tab
      if (data.authorize_uri && selectedMethod !== 'promptpay') {
        window.open(data.authorize_uri, '_blank')
      }
    } catch (err) {
      console.warn('Omise API not configured, using demo mode:', err)
      // Demo fallback
      setShowPaymentFlow(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmManual = () => {
    // Fallback for demo / manual confirmation button
    clearInterval(pollRef.current)
    onComplete()
  }

  const BookingHeader = () => (
    <div className="flex-col gap-lg" style={{ marginBottom: '24px' }}>
      <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
        <div style={{ padding: '12px 24px', background: '#1a1a3a', color: '#fff', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>ข้อมูลการจอง เลขที่ : {booking?.bookingNo || 'SPORTS-20263130956'}</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Booking ID: #BK-{booking?.id || '10000'}</span>
        </div>
        <div className="profile-info-grid" style={{ padding: '20px' }}>
          <div className="profile-info-item"><span className="profile-info-label">Name</span><span className="profile-info-value">{user?.name}</span></div>
          <div className="profile-info-item"><span className="profile-info-label">Nick Name</span><span className="profile-info-value">{user?.nickname || '-'}</span></div>
          <div className="profile-info-item"><span className="profile-info-label">Mobile</span><span className="profile-info-value">{user?.phone}</span></div>
          <div className="profile-info-item"><span className="profile-info-label">Email</span><span className="profile-info-value">{user?.email}</span></div>
          <div className="profile-info-item"><span className="profile-info-label">Location</span><span className="profile-info-value">Crystal Sports</span></div>
        </div>
      </div>
      <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
        <div style={{ padding: '12px 24px', background: '#fff', color: '#333', fontWeight: '600', borderBottom: '1px solid #eee', textAlign: 'center' }}>รายละเอียดการจอง</div>
        <table className="summary-table">
          <thead><tr><th>Date</th><th>Time</th><th>Courts</th><th>Type</th><th>Price</th></tr></thead>
          <tbody>
            <tr>
              <td>{booking?.date}</td>
              <td>{booking?.time}</td>
              <td>{booking?.court?.name || booking?.court}</td>
              <td>COURT</td>
              <td>500.00</td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right', fontWeight: '700', padding: '16px' }}>ราคารวม</td>
              <td style={{ fontWeight: '700', color: '#1a1a3a' }}>500.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="fade-in" style={{ paddingBottom: '100px', paddingTop: '20px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <BookingHeader />

        {!showPaymentFlow ? (
          <div className="booking-layout-grid">
            <div className="flex-col gap-lg">
              <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
                <div style={{ padding: '12px 24px', background: '#1a1a3a', color: '#fff', fontWeight: '600' }}>วิธีการชำระเงิน</div>
                <div style={{ padding: '24px', background: '#fff', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {PAYMENT_METHODS.map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      style={{
                        padding: '24px 16px', border: `2px solid ${selectedMethod === m.id ? '#1a1a3a' : '#eee'}`,
                        borderRadius: '8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                        background: selectedMethod === m.id ? '#f4f7f6' : '#fff', color: '#333',
                      }}
                    >
                      <div style={{ marginBottom: '12px', color: selectedMethod === m.id ? '#1a1a3a' : '#999' }}>{m.icon}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{m.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>{m.description}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '24px', background: '#fff', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #eee' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>หมายเหตุ***</p>
                  <p>• ลูกค้าต้องชำระเงินภายใน 15 นาที</p>
                  <p>• หากต้องการยกเลิกหรือเปลี่ยนแปลงวัน-เวลา ให้ทำการแจ้งล่วงหน้าไม่ต่ำกว่า 24 ชั่วโมง</p>
                  <p>• กรณีทำการยกเลิกล่วงหน้า ระบบจะทำการคืนเงินเข้า wallet</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                    <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    <label htmlFor="agree" style={{ fontWeight: '600' }}>ยอมรับข้อตกลงในการใช้บริการ</label>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
              <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
                <div style={{ padding: '16px 24px', background: '#1a1a3a', color: '#fff', fontWeight: '600' }}>สรุปการจอง</div>
                <div style={{ padding: '24px', background: '#fff', color: '#333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>ราคาสนาม</span><span style={{ fontWeight: '700' }}>500.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>วิธีการชำระ</span><span style={{ fontWeight: '700' }}>{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #eee', margin: '16px 0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem' }}>
                    <span>ยอดชำระ</span><span style={{ color: '#1a1a3a' }}>฿500.00</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button onClick={onBack} className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, padding: '16px', borderRadius: '12px', background: '#f8f9fa', color: '#1a1a3a', border: '1px solid #ddd', fontWeight: '600' }}>
                      <ChevronLeft size={20} /> ย้อนกลับ
                    </button>
                  </div>
                  <button className="premium-button" style={{ width: '100%', background: '#1a1a3a', color: '#fff', borderRadius: '4px', padding: '16px' }} onClick={handlePay} disabled={isProcessing}>
                    {isProcessing ? 'กำลังประมวลผล...' : 'ชำระเงิน'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card flex-col fade-in" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
            <div style={{ padding: '12px 24px', background: '#1a1a3a', color: '#fff', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Scan QR ชำระเงิน</span>
              <div style={{ background: 'var(--accent-primary)', color: '#fff', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
                เวลาคงเหลือ {formatTime(timeLeft)}
              </div>
            </div>
            <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa' }}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <div style={{ background: '#00467f', color: '#fff', padding: '8px', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay_logo.svg" alt="PromptPay" style={{ height: '20px', filter: 'brightness(0) invert(1)' }} />
                  <span style={{ fontWeight: 'bold' }}>THAI QR PAYMENT</span>
                </div>
                <img
                  src={qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PROMPTPAY_${booking?.id}_500`}
                  alt="PromptPay QR"
                  style={{ width: '250px', height: '250px', display: 'block', border: '1px solid #eee' }}
                />
              </div>
              <p style={{ color: '#666', marginBottom: '24px' }}>สแกน QR เพื่อชำระเงิน — ระบบจะยืนยันอัตโนมัติ</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <a href={qrCodeUrl} download="qr-payment.png" className="premium-button" style={{ background: '#333', color: '#fff', padding: '10px 24px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Download QR
                </a>
              </div>
              <button
                className="premium-button"
                style={{ marginTop: '40px', background: 'var(--accent-primary)', color: '#fff', padding: '16px 40px' }}
                onClick={handleConfirmManual}
              >
                แจ้งชำระเงินเรียบร้อยแล้ว
              </button>
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '12px' }}>ระบบจะยืนยันอัตโนมัติหลังชำระเงิน — หรือกดปุ่มด้านบนเพื่อดำเนินการต่อ</p>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Payment Success Modal */}
      {paymentSuccess && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div className="glass-card fade-in" style={{
            background: '#fff', borderRadius: '20px', padding: '40px 48px', maxWidth: '440px',
            width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00b894, #00cec9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <CheckCircle2 size={40} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a1a3a', marginBottom: '8px' }}>ชำระเงินสำเร็จ! 🎉</h2>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>ระบบยืนยันการรับชำระเงินเรียบร้อยแล้ว</p>
            </div>
            <div style={{ background: '#f8fffe', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left', fontSize: '0.9rem', lineHeight: '1.8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>สนาม</span><strong>{booking?.court?.name || booking?.court}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>วันที่</span><strong>{booking?.date}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>เวลา</span><strong>{booking?.time}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>ชื่อผู้จอง</span><strong>{user?.name}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#666' }}>ยอดชำระ</span><strong style={{ color: '#00b894' }}>฿500.00</strong></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '20px' }}>📱 ระบบส่ง SMS ยืนยันไปที่ {user?.phone} แล้ว</p>
            <button
              className="premium-button"
              style={{ width: '100%', background: '#1a1a3a', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: '700' }}
              onClick={onComplete}
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
