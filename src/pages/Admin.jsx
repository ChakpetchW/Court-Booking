import React, { useState } from 'react'
import { ChevronLeft, Save, Calendar, DollarSign, List, ShieldCheck } from 'lucide-react'

const HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

const Admin = ({ courts, onUpdateCourts, fetchStatus, apiSettings, onUpdateSettings, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('allotment')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState(false)
  const [adminPassAttempt, setAdminPassAttempt] = useState('')

  const toggleAllotment = async (courtId, hourIdx) => {
    const hourStr = HOURS[hourIdx]
    try {
      await fetch('/api/index.php?action=toggle_allotment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ court_id: courtId, date: selectedDate, hour: hourStr })
      })
      if (fetchStatus) fetchStatus()
    } catch (err) {
      console.warn('API toggling not available, using local state.', err)
      onUpdateCourts(prev => prev.map(c => 
        c.id === courtId 
          ? { 
              ...c, 
              allotment: c.allotment.map((a, i) => 
                i === hourIdx ? { ...a, isOpen: !a.isOpen } : a
              ) 
            }
          : c
      ))
    }
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '1200px' }}>
      <div className="glass-card flex-col" style={{ padding: '0', background: '#fff', color: '#333' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBack} className="secondary-button" style={{ padding: '8px', color: 'var(--accent-primary)' }}><ChevronLeft size={20} /></button>
            <h2 style={{ fontSize: '1.2rem' }}>Admin Dashboard</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onLogout}
              className="secondary-button" 
              style={{ padding: '8px 16px', color: '#ff4d4d', border: '1px solid #ff4d4d' }}
            >
              Logout
            </button>
            <button 
              onClick={() => alert('บันทึกข้อมูลสำเร็จ (โหมดจำลอง)')}
              className="premium-button" 
              style={{ background: '#00d1ff', color: '#fff', padding: '8px 24px', fontSize: '0.9rem', borderRadius: '4px' }}
            >
               <Save size={16} style={{ marginRight: '8px' }} /> บันทึก
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '8px', borderBottom: '1px solid #eee' }}>
           <button onClick={() => setActiveTab('allotment')} style={{ flex: 1, padding: '12px', color: activeTab === 'allotment' ? 'var(--accent-primary)' : 'var(--text-secondary)', background: activeTab === 'allotment' ? 'var(--accent-court)' : 'transparent', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             <Calendar size={16} /> Allotment
           </button>
           <button onClick={() => setActiveTab('pricing')} style={{ flex: 1, padding: '12px', color: activeTab === 'pricing' ? 'var(--accent-primary)' : 'var(--text-secondary)', background: activeTab === 'pricing' ? 'var(--accent-court)' : 'transparent', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             <DollarSign size={16} /> Pricing
           </button>
           <button onClick={() => setActiveTab('transactions')} style={{ flex: 1, padding: '12px', color: activeTab === 'transactions' ? 'var(--accent-primary)' : 'var(--text-secondary)', background: activeTab === 'transactions' ? 'var(--accent-court)' : 'transparent', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             <List size={16} /> Transactions
           </button>
           <button onClick={() => setActiveTab('apiSettings')} style={{ flex: 1, padding: '12px', color: activeTab === 'apiSettings' ? 'var(--accent-primary)' : 'var(--text-secondary)', background: activeTab === 'apiSettings' ? 'var(--accent-court)' : 'transparent', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             <ShieldCheck size={16} /> API Settings
           </button>
        </div>

        <div style={{ padding: '24px' }}>
          {activeTab === 'allotment' && (
            <div className="flex-col gap-md">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', marginBottom: '16px' }}>จัดการการเปิด-ปิดสนาม (Hour-by-hour)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f2f5' }}>
                      <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid #ddd', minWidth: '150px', fontSize: '1rem' }}>ชื่อสนาม</th>
                      {HOURS.map(h => (
                        <th key={h} style={{ padding: '12px', borderBottom: '2px solid #ddd', minWidth: '100px', textAlign: 'center' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courts.map(court => (
                      <tr key={court.id}>
                        <td style={{ padding: '20px 16px', borderBottom: '1px solid #eee', fontWeight: '800', fontSize: '1.3rem', color: '#1a1a3a' }}>
                          <div className="flex-col">
                            {court.name}
                            <span style={{ fontSize: '0.7rem', fontWeight: '400', opacity: 0.6 }}>{court.type}</span>
                          </div>
                        </td>
                        {court.allotment.map((slot, idx) => (
                          <td key={idx} style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                            <div className="flex-col items-center gap-xs">
                              {slot.bookedBy ? (
                                <div style={{ 
                                  padding: '6px 8px', 
                                  background: '#e6fffa', 
                                  color: '#2c7a7b', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700',
                                  width: '100px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  textAlign: 'center'
                                }}>
                                  👤 {slot.bookedBy}
                                </div>
                              ) : slot.pendingBy ? (
                                <div style={{ 
                                  padding: '6px 8px', 
                                  background: '#fff9c4', 
                                  color: '#f57f17', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700',
                                  width: '100px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  textAlign: 'center'
                                }}>
                                  ⏳ {slot.pendingBy}
                                </div>
                              ) : (
                                <div 
                                  onClick={() => toggleAllotment(court.id, idx)}
                                  style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 8px', 
                                    background: slot.isOpen ? '#e3f2fd' : '#ffebee', 
                                    color: slot.isOpen ? '#1565c0' : '#c62828', 
                                    borderRadius: '4px', 
                                    fontSize: '0.7rem', 
                                    fontWeight: '600', 
                                    width: '100px', 
                                    cursor: 'pointer' 
                                  }}
                                >
                                  <span>{slot.isOpen ? 'ว่างอยู่' : 'CLOSED'}</span>
                                  <div style={{ 
                                    width: '28px', 
                                    height: '14px', 
                                    background: slot.isOpen ? 'var(--accent-primary)' : '#ccc',
                                    borderRadius: '7px',
                                    padding: '1px',
                                    display: 'flex',
                                    justifyContent: slot.isOpen ? 'flex-end' : 'flex-start',
                                    transition: 'all 0.3s'
                                  }}>
                                    <div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%' }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
             <div className="flex-col gap-md">
               <h3 style={{ fontSize: '1rem' }}>ตั้งราคาแต่ละสนาม</h3>
                {courts.map(court => (
                  <div key={court.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <span>{court.name} ({court.type})</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <input type="number" defaultValue={court.type === 'Tennis' ? 400 : 200} style={{ width: '80px', padding: '8px', background: '#fff', color: '#000', border: '1px solid #ddd' }} />
                       <span style={{ fontSize: '0.8rem' }}>บาท / ชม.</span>
                    </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'transactions' && (
            <div className="flex-col gap-md">
               <h3 style={{ fontSize: '1rem' }}>สรุปยอดการจอง</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                 <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                       <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                       <th style={{ padding: '12px', textAlign: 'left' }}>ชื่อผู้จอง</th>
                       <th style={{ padding: '12px', textAlign: 'left' }}>สนาม</th>
                       <th style={{ padding: '12px', textAlign: 'left' }}>เวลา</th>
                       <th style={{ padding: '12px', textAlign: 'right' }}>ยอดชำระ</th>
                       <th style={{ padding: '12px', textAlign: 'center' }}>สถานะ</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                       <td style={{ padding: '12px' }}>T001</td>
                       <td style={{ padding: '12px' }}>Somchai Jaidee</td>
                       <td style={{ padding: '12px' }}>Court 1</td>
                       <td style={{ padding: '12px' }}>25 Mar @ 13:00</td>
                       <td style={{ padding: '12px', textAlign: 'right' }}>฿200</td>
                       <td style={{ padding: '12px', textAlign: 'center' }}>
                         <span style={{ padding: '4px 8px', background: '#e6fffa', color: '#2c7a7b', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700' }}>Completed</span>
                       </td>
                    </tr>
                 </tbody>
               </table>
            </div>
          )}

          {activeTab === 'apiSettings' && (
            <div className="flex-col gap-md" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              {!isSettingsUnlocked ? (
                <div className="flex-col gap-md" style={{ textAlign: 'center', padding: '40px' }}>
                  <ShieldCheck size={48} style={{ margin: '0 auto', color: 'var(--accent-primary)' }} />
                  <h3>ระบุรหัสผ่านเพื่อแก้ไขการตั้งค่า</h3>
                  <input 
                    type="password" 
                    placeholder="ป้อนรหัสผ่าน..." 
                    value={adminPassAttempt}
                    onChange={(e) => setAdminPassAttempt(e.target.value)}
                    style={{ textAlign: 'center' }}
                  />
                  <button 
                    className="premium-button"
                    onClick={() => {
                      if (adminPassAttempt === apiSettings.adminPassword) {
                        setIsSettingsUnlocked(true)
                      } else {
                        alert('รหัสผ่านไม่ถูกต้อง')
                      }
                    }}
                  >
                    ตรวจสอบรหัสผ่าน
                  </button>
                </div>
              ) : (
                <div className="flex-col gap-lg">
                  <div style={{ padding: '12px', background: '#e1f5fe', color: '#0288d1', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <strong>OTP Login Setting</strong>
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>Your Webhook Callback URL (ให้ผู้ให้บริการ SMS เรียกมาที่นี่)</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        readOnly
                        value={`https://api.tenniscourt-booking.com/v1/webhook/otp/callback`}
                        style={{ flex: 1, background: '#f0f0f0', color: '#666', border: '1px dashed #ccc' }}
                      />
                      <button 
                        className="premium-button" 
                        style={{ width: '80px', padding: '8px', fontSize: '0.8rem' }}
                        onClick={() => {
                          navigator.clipboard.writeText(`https://api.tenniscourt-booking.com/v1/webhook/otp/callback`);
                          alert('คัดลอกลิงก์แล้ว');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>* นำลิงก์นี้ไปใส่ในหน้าตั้งค่า Webhook ของฝั่งผู้ให้บริการ SMS ของคุณ</p>
                  </div>
                  
                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Webhook URL 
                      <div 
                        title="ช่องทาง SMS สามารถใช้ได้เพียง Method GET ช่องทาง Email สามารถใช้ได้ Method GET หรือ POST ได้"
                        style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e3f2fd', color: '#1e88e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', fontSize: '0.75rem' }}
                      >?</div>
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        placeholder="ระบุ URL"
                        value={apiSettings.otpWebhookUrl}
                        onChange={(e) => onUpdateSettings({ ...apiSettings, otpWebhookUrl: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <select 
                        value={apiSettings.otpMethod}
                        onChange={(e) => onUpdateSettings({ ...apiSettings, otpMethod: e.target.value })}
                        style={{ width: '120px' }}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>API Key</label>
                    <input 
                      type="text" 
                      placeholder="ระบุ API Key"
                      value={apiSettings.otpApiKey}
                      onChange={(e) => onUpdateSettings({ ...apiSettings, otpApiKey: e.target.value })}
                    />
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>API Secret</label>
                    <input 
                      type="password" 
                      placeholder="ระบุ API Secret"
                      value={apiSettings.otpApiSecret}
                      onChange={(e) => onUpdateSettings({ ...apiSettings, otpApiSecret: e.target.value })}
                    />
                  </div>

                  <div style={{ padding: '12px', background: '#fff3e0', color: '#ef6c00', borderRadius: '8px', fontSize: '0.85rem', marginTop: '20px' }}>
                    <strong>💳 Payment API (Omise)</strong>
                    <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>สมัครที่ dashboard.omise.co เพื่อรับ keys</p>
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>Omise Public Key <span style={{ color: '#aaa', fontSize: '0.75rem' }}>(pkey_...)</span></label>
                    <input type="text" placeholder="pkey_test_xxxxxxxxxxxxxxxx" value={apiSettings.omisePublicKey || ''} onChange={(e) => onUpdateSettings({ ...apiSettings, omisePublicKey: e.target.value })} />
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>Omise Secret Key <span style={{ color: '#aaa', fontSize: '0.75rem' }}>(skey_...)</span></label>
                    <input type="password" placeholder="skey_test_xxxxxxxxxxxxxxxx" value={apiSettings.omiseSecretKey || ''} onChange={(e) => onUpdateSettings({ ...apiSettings, omiseSecretKey: e.target.value })} />
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>Omise Webhook Secret</label>
                    <input type="password" placeholder="whsec_xxxxxxxxxxxxxxxx" value={apiSettings.omiseWebhookSecret || ''} onChange={(e) => onUpdateSettings({ ...apiSettings, omiseWebhookSecret: e.target.value })} />
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>Webhook URL ของระบบ: <code>https://scaleup.co.th/court/api/webhook.php</code></p>
                  </div>

                  <div style={{ padding: '12px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', fontSize: '0.85rem', marginTop: '4px' }}>
                    <strong>📱 SMS (Thaibulksms)</strong>
                    <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>สมัครที่ thaibulksms.com — 0.15 บาท/ข้อความ</p>
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>SMS API Key</label>
                    <input type="text" placeholder="YOUR_SMS_KEY" value={apiSettings.smsApiKey || ''} onChange={(e) => onUpdateSettings({ ...apiSettings, smsApiKey: e.target.value })} />
                  </div>

                  <div className="flex-col gap-sm">
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>SMS API Secret</label>
                    <input type="password" placeholder="YOUR_SMS_SECRET" value={apiSettings.smsApiSecret || ''} onChange={(e) => onUpdateSettings({ ...apiSettings, smsApiSecret: e.target.value })} />
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                    <label style={{ fontSize: '0.9rem', color: '#333' }}>Change Setting Password</label>
                    <input type="text" value={apiSettings.adminPassword} onChange={(e) => onUpdateSettings({ ...apiSettings, adminPassword: e.target.value })} style={{ width: '100%', marginTop: '8px' }} />
                  </div>

                  <button className="premium-button" onClick={() => setIsSettingsUnlocked(false)}>ล็อคการเข้าถึง</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
