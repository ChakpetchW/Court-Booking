import React, { useState } from 'react'
import { ChevronLeft, Save, Calendar, DollarSign, List, ShieldCheck, ClipboardList, Users, Plus, Pencil, Trash2, X, Check } from 'lucide-react'

const HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

const Admin = ({ courts, onUpdateCourts, fetchStatus, fetchAdminBookings, bookingHistory = [], users = [], onUpdateUsers, apiSettings, onUpdateSettings, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('allotment')
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('sv-SE'))
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState(false)
  const [userFilter, setUserFilter] = useState('')

  // Fetch data when date or tab changes
  React.useEffect(() => {
    if (fetchStatus) fetchStatus(selectedDate)
    if (fetchAdminBookings) fetchAdminBookings(selectedDate)
    if (activeTab === 'pricing') fetchRates()
    if (activeTab === 'transactions') fetchAuditLogs()
  }, [selectedDate, activeTab])
  // User management state
  const [editingUserId, setEditingUserId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ phone: '', name: '', nickname: '', email: '', birthday: '' })
  const [rates, setRates] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [savingId, setSavingId] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const fetchRates = async () => {
    try {
      const res = await fetch(`api/index.php?action=get_rates&t=${Date.now()}`)
      const data = await res.json()
      if (Array.isArray(data)) setRates(data)
    } catch (err) { console.error('Fetch rates error:', err) }
  }

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('api/index.php?action=get_audit_logs')
      const data = await res.json()
      if (Array.isArray(data)) setAuditLogs(data)
    } catch (err) { console.error('Fetch logs error:', err) }
  }

  const toggleAllotment = async (courtId, hourIdx) => {
    const hourStr = HOURS[hourIdx]
    try {
      await fetch('api/index.php?action=toggle_allotment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ court_id: courtId, date: selectedDate, hour: hourStr })
      })
      if (fetchStatus) fetchStatus(selectedDate)
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

  const handleDeleteBooking = async (id) => {
    const password = window.prompt(`ยกเลิกการจอง #${id}? กรุณาระบุรหัสผ่านแอดมินเพื่อยืนยัน:`)
    if (password === null) return // Cancelled prompt
    
    try {
      const res = await fetch(`api/index.php?action=admin_delete_booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: id, password, admin_name: 'Super Admin' })
      })
      const data = await res.json()
      if (data.success) {
        if (fetchStatus) fetchStatus(selectedDate)
        if (fetchAdminBookings) fetchAdminBookings(selectedDate)
        fetchAuditLogs()
      } else {
        alert(data.error || 'ไม่สามารถยกเลิกการจองได้')
      }
    } catch (err) {
      console.error('Delete booking error:', err)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ')
    }
  }

  const updateRate = async (id, rate) => {
    setSavingId(id)
    try {
      await fetch('api/index.php?action=update_rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rate })
      })
      await fetchRates()
      setSavingId(null)
      setSavedId(id)
      setTimeout(() => setSavedId(null), 2000)
    } catch (err) { 
      console.error('Update rate error:', err)
      setSavingId(null) 
    }
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '1200px' }}>
      <div className="glass-card flex-col" style={{ padding: '0', background: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid #eee', background: 'var(--accent-primary)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
            <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', margin: 0, letterSpacing: '-0.02em' }}>MANAGEMENT CONSOLE</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Calendar size={20} color="#fff" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', fontWeight: '700', color: '#fff', cursor: 'pointer' }}
              />
            </div>
            <button 
              onClick={onLogout}
              style={{ background: 'none', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px 24px', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'none'}
            >
              Sign Out
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', background: '#fcfcfc', padding: '12px 32px', borderBottom: '1px solid #eee', overflowX: 'auto', gap: '8px' }}>
           {[
             { id: 'allotment', label: 'Availability', icon: <Calendar size={18} /> },
             { id: 'bookings', label: 'Reservations', icon: <ClipboardList size={18} /> },
             { id: 'users', label: 'Members', icon: <Users size={18} /> },
             { id: 'pricing', label: 'Rates', icon: <DollarSign size={18} /> },
             { id: 'transactions', label: 'Audit Log', icon: <List size={18} /> },
             { id: 'apiSettings', label: 'System', icon: <ShieldCheck size={18} /> },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)} 
               style={{ 
                 padding: '12px 24px', 
                 color: activeTab === tab.id ? 'var(--accent-primary)' : '#888', 
                 background: activeTab === tab.id ? 'var(--accent-court)' : 'transparent', 
                 borderRadius: '30px', border: 'none', cursor: 'pointer',
                 display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', fontSize: '0.95rem',
                 transition: 'all 0.2s'
               }}>
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        <div style={{ padding: '24px' }}>
          {activeTab === 'bookings' && (
            <div className="flex-col gap-md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)', margin: 0 }}>Reservations for {selectedDate}</h3>
              </div>

              {/* Bookings derived from allotment state (bookedBy / pendingBy) */}
              {(() => {
                // Now bookingHistory is fetched from the API for the selected date
                const allBookings = bookingHistory.filter(b => b.date === selectedDate)

                if (allBookings.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#ccc', background: '#fcfcfc', borderRadius: 'var(--radius-lg)', border: '2px dashed #eee' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>📋</div>
                      <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>No reservations found for this date.</p>
                    </div>
                  )
                }
                return (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '0.95rem' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#888', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem' }}>Customer</th>
                          <th style={{ padding: '16px 24px', textAlign: 'left', color: '#888', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem' }}>Location</th>
                          <th style={{ padding: '16px 24px', textAlign: 'center', color: '#888', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem' }}>Schedule</th>
                          <th style={{ padding: '16px 24px', textAlign: 'right', color: '#888', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem' }}>Price</th>
                          <th style={{ padding: '16px 24px', textAlign: 'center', color: '#888', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allBookings.map((b, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                            <td 
                              style={{ padding: '14px 16px', color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer' }}
                              onClick={() => {
                                setUserFilter(b.user?.name || b.name)
                                setActiveTab('users')
                              }}
                            >
                              {b.user?.name || b.name}
                            </td>
                            <td style={{ padding: '14px 16px' }}>{b.court}</td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>{b.hour} - {(parseInt(b.hour) + 1).toString().padStart(2, '0')}:00</td>
                            <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700' }}>฿{parseFloat(b.price || 0).toLocaleString()}</td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <span style={{ 
                                background: b.status === 'pending' ? '#fff9db' : '#e6fffa', 
                                color: b.status === 'pending' ? '#f59f00' : '#2c7a7b', 
                                padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' 
                              }}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })()}
            </div>
          )}

          {activeTab === 'allotment' && (
            <div className="flex-col gap-md">
              <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)', marginBottom: '24px' }}>Venue Availability Management</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                      <th style={{ textAlign: 'left', padding: '24px 32px', minWidth: '150px', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>VENUE</th>
                      {HOURS.map(h => (
                        <th key={h} style={{ padding: '16px', minWidth: '100px', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem', color: '#888' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courts.map(court => (
                      <tr key={court.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#1a1a3a', fontFamily: 'var(--font-heading)' }}>{court.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600' }}>{court.type} Venue</div>
                        </td>
                        {court.allotment.map((slot, idx) => (
                          <td key={idx} style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              {slot.bookedBy ? (
                                <div style={{ 
                                  padding: '10px 12px', background: 'var(--accent-court)', color: 'var(--accent-primary)', 
                                  borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', width: '110px'
                                }}>
                                  👤 {slot.bookedBy}
                                </div>
                              ) : slot.pendingBy ? (
                                <div style={{ 
                                  padding: '10px 12px', background: '#fffbeb', color: '#d97706', 
                                  borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', width: '110px'
                                }}>
                                  ⏳ {slot.pendingBy}
                                </div>
                              ) : (
                                <div 
                                  onClick={() => toggleAllotment(court.id, idx)}
                                  style={{ 
                                    padding: '10px 12px', background: slot.isOpen ? '#f0fdf4' : '#fef2f2', 
                                    color: slot.isOpen ? '#16a34a' : '#dc2626', 
                                    borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', width: '110px',
                                    border: `1px solid ${slot.isOpen ? '#dcfce7' : '#fee2e2'}`, cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {slot.isOpen ? 'AVAILABLE' : 'BLOCKED'}
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
          {activeTab === 'users' && (
            <div className="flex-col gap-md">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)', margin: 0 }}>Member Management ({users.length} registered)</h3>
                <button
                  className="premium-button"
                  style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                  onClick={() => { setShowAddUser(true); setNewUser({ phone: '', name: '', nickname: '', email: '', birthday: '' }) }}
                >
                  <Plus size={18} /> Add New Member
                </button>
              </div>

              {/* Add User Form */}
              {showAddUser && (
                <div style={{ background: '#f0fff4', border: '1px solid #b2f5ea', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '20px', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>Registration: New Member</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    {[
                      { key: 'phone', label: 'Phone Number *', type: 'tel', placeholder: '0812345678' },
                      { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'John Doe' },
                      { key: 'nickname', label: 'Nickname', type: 'text', placeholder: 'Johnny' },
                      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                      { key: 'birthday', label: 'Date of Birth', type: 'text', placeholder: 'DD/MM/YYYY' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#666', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={newUser[f.key]} onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="premium-button" style={{ padding: '12px 32px', fontSize: '0.95rem' }} onClick={() => {
                      if (!newUser.phone || !newUser.name) { alert('Please enter phone and name'); return }
                      const u = { ...newUser, id: Date.now(), isRegistered: true }
                      onUpdateUsers(prev => [...prev.filter(x => x.phone !== u.phone), u])
                      setShowAddUser(false)
                    }}>Create Member</button>
                    <button className="secondary-button" style={{ padding: '12px 24px', fontSize: '0.95rem' }} onClick={() => setShowAddUser(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: '#fcfcfc', padding: '16px', borderRadius: '12px', border: '1px solid #eee' }}>
                <Users size={20} color="#888" />
                <input 
                  type="text" 
                  placeholder="Search members by name or phone..." 
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
                {userFilter && (
                  <button 
                    onClick={() => setUserFilter('')}
                    style={{ padding: '12px 24px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f2f5' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>#</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ชื่อ-นามสกุล</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>เบอร์โทรศัพท์</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ชื่อเล่น</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #ddd', minWidth: '110px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = users.filter(u => 
                        !userFilter || 
                        u.name.toLowerCase().includes(userFilter.toLowerCase()) || 
                        u.phone.includes(userFilter)
                      )
                      if (filtered.length === 0) {
                        return <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>ไม่พบสมาชิกที่ค้นหา</td></tr>
                      }
                      return filtered.map((u, i) => (
                        <tr key={u.id || i} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        {editingUserId === (u.id || u.phone) ? (
                          <>
                            <td style={{ padding: '10px 16px', color: '#999' }}>{i + 1}</td>
                            <td style={{ padding: '8px 12px' }}><input value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', minWidth: '160px' }} /></td>
                            <td style={{ padding: '8px 12px' }}><input value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} style={{ width: '100%', minWidth: '130px' }} /></td>
                            <td style={{ padding: '8px 12px' }}><input value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} style={{ width: '100%', minWidth: '160px' }} /></td>
                            <td style={{ padding: '8px 12px' }}><input value={editForm.nickname || ''} onChange={e => setEditForm(p => ({ ...p, nickname: e.target.value }))} style={{ width: '100%', minWidth: '100px' }} /></td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button title="บันทึก" style={{ padding: '6px 10px', background: '#e6fffa', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#2c7a7b' }}
                                  onClick={() => {
                                    onUpdateUsers(prev => prev.map(x => (x.id || x.phone) === (u.id || u.phone) ? { ...x, ...editForm } : x))
                                    setEditingUserId(null)
                                  }}><Check size={14} /></button>
                                <button title="ยกเลิก" style={{ padding: '6px 10px', background: '#fff5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#e53e3e' }}
                                  onClick={() => setEditingUserId(null)}><X size={14} /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '12px 16px', color: '#999' }}>{i + 1}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1a1a3a' }}>{u.name}</td>
                            <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{u.phone}</td>
                            <td style={{ padding: '12px 16px', color: '#555' }}>{u.email || '-'}</td>
                            <td style={{ padding: '12px 16px', color: '#555' }}>{u.nickname || '-'}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button title="แก้ไข" style={{ padding: '6px 10px', background: '#ebf8ff', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#2b6cb0' }}
                                  onClick={() => { setEditingUserId(u.id || u.phone); setEditForm({ name: u.name, phone: u.phone, email: u.email || '', nickname: u.nickname || '' }) }}>
                                  <Pencil size={13} />
                                </button>
                                <button title="ลบ" style={{ padding: '6px 10px', background: '#fff5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#e53e3e' }}
                                  onClick={() => { if (window.confirm(`ลบ ${u.name}?`)) onUpdateUsers(prev => prev.filter(x => (x.id || x.phone) !== (u.id || u.phone))) }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  })()}
                </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
             <div className="flex-col gap-md">
               <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)', marginBottom: '24px' }}>Venue Rate Configuration</h3>
                {rates.map(court => (
                  <div key={court.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #eee', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-court)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          {court.type === 'Tennis' ? '🎾' : '🏸'}
                       </div>
                       <div>
                          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1a1a3a' }}>{court.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#888' }}>{court.type} Court</div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <input 
                         type="number" 
                         value={Math.floor(Number(court.rate) || 0)} 
                         onChange={(e) => setRates(prev => prev.map(r => r.id === court.id ? { ...r, rate: e.target.value } : r))}
                         style={{ width: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem' }} 
                       />
                       <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>THB / HR</span>
                       <button 
                         onClick={() => updateRate(court.id, court.rate)}
                         disabled={savingId === court.id}
                         style={{ 
                           background: savedId === court.id ? '#00b894' : 'var(--accent-primary)', 
                           color: '#fff', 
                           border: 'none', 
                           borderRadius: '8px', 
                           padding: '10px 16px', 
                           cursor: 'pointer', 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: '8px', 
                           fontSize: '0.9rem', 
                           fontWeight: '700',
                           transition: 'all 0.2s',
                           width: '120px',
                           justifyContent: 'center'
                         }}
                       >
                         {savingId === court.id ? 'Saving...' : savedId === court.id ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save</>}
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'transactions' && (
            <div className="flex-col gap-md">
               <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)', marginBottom: '24px' }}>Management Audit Log</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                 <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                       <th style={{ padding: '16px', textAlign: 'left', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Time</th>
                       <th style={{ padding: '16px', textAlign: 'left', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Admin</th>
                       <th style={{ padding: '16px', textAlign: 'left', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Action</th>
                       <th style={{ padding: '16px', textAlign: 'left', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Details</th>
                    </tr>
                 </thead>
                 <tbody>
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#ccc' }}>
                          No administrative actions logged yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '16px', fontSize: '0.85rem', color: '#666' }}>{new Date(log.created_at).toLocaleString('th-TH')}</td>
                          <td style={{ padding: '16px', fontWeight: '700', color: '#1a1a3a' }}>{log.admin_name}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{ padding: '16px', color: '#555' }}>{log.details}</td>
                        </tr>
                      ))
                    )}
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
