import React, { useState } from 'react'
import { User, Mail, Calendar, ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'

function ProfileRegistration({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthday: '',
    lineId: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate save
    setTimeout(() => {
      setIsLoading(false)
      onComplete(formData)
    }, 1000)
  }

  // Premium Date Picker Logic
  const [currentDate, setCurrentDate] = useState(new Date())
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const handleDateSelect = (day) => {
    const formattedDate = `${String(day).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`
    setFormData({ ...formData, birthday: formattedDate })
    setShowDatePicker(false)
  }

  return (
    <div className="container fade-in">
      <div className="glass-card flex-col gap-lg" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>ข้อมูลสมาชิก</h1>
          <p style={{ color: 'var(--text-secondary)' }}>กรุณากรอกข้อมูลเพื่อเริ่มการจองสนาม</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ชื่อ-นามสกุล</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="สมชาย ใจดี" 
                style={{ width: '100%', paddingLeft: '48px' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>อีเมล</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                placeholder="somchai@example.com" 
                style={{ width: '100%', paddingLeft: '48px' }}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Line ID (ถ้ามี)</label>
            <div style={{ position: 'relative' }}>
              <MessageCircle size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="@lineid" 
                style={{ width: '100%', paddingLeft: '48px' }}
                value={formData.lineId}
                onChange={(e) => setFormData({...formData, lineId: e.target.value})}
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>วันเกิด (วว/ดด/ปปปป)</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                readOnly
                placeholder="เลือกวันเกิด..." 
                style={{ width: '100%', paddingLeft: '48px', cursor: 'pointer' }}
                value={formData.birthday}
                onClick={() => setShowDatePicker(true)}
                required
              />
            </div>
          </div>

          {showDatePicker && (
            <div className="calendar-modal-overlay" onClick={() => setShowDatePicker(false)}>
              <div className="calendar-card fade-in" onClick={e => e.stopPropagation()}>
                <div className="calendar-header">
                  <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                    <ChevronLeft size={20} />
                  </button>
                  <div style={{ fontWeight: '600' }}>
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </div>
                  <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="calendar-grid">
                  {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => (
                    <div key={d} className="calendar-day-label">{d}</div>
                  ))}
                  {[...Array(firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())).keys()].map(i => (
                    <div key={`empty-${i}`} className="calendar-day-btn empty"></div>
                  ))}
                  {[...Array(getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())).keys()].map(i => {
                    const d = i + 1
                    const isSelected = formData.birthday === `${String(d).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`
                    return (
                      <div 
                        key={d} 
                        className={`calendar-day-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDateSelect(d)}
                      >
                        {d}
                      </div>
                    )
                  })}
                </div>
                <button 
                  style={{ width: '100%', marginTop: '20px', padding: '10px', fontSize: '0.9rem', color: 'var(--accent-primary)' }}
                  onClick={() => setShowDatePicker(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="premium-button" disabled={isLoading} style={{ marginTop: '16px' }}>
            {isLoading ? 'กำลังบันทึก...' : 'ถัดไป'} <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileRegistration
