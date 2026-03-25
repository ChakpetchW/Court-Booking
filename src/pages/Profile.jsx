import React from 'react'
import { Calendar, UserCheck } from 'lucide-react'

const ProfileDashboard = ({ user, onStartBooking, onAdmin }) => {
  const infoItems = [
    { label: 'Name', value: user?.name || '-' },
    { label: 'Surname', value: user?.surname || 'Wiwatchatsukhon' },
    { label: 'Nickname', value: user?.nickname || 'Aof' },
    { label: 'Mobile Number', value: user?.phone || '-' },
    { label: 'Line ID', value: user?.lineId || '-' },
    { label: 'Email', value: user?.email || '-' },
    { label: 'Date of Birth', value: user?.birthday || '-' },
    { label: 'My Wallet', value: '0.00' },
    { label: 'Location', value: 'Tennis Court' },
  ]

  return (
    <div className="container-wide fade-in" style={{ padding: '20px' }}>
      <div className="flex-col gap-lg">
        {/* Member Info Card */}
        <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
          <div style={{ padding: '12px 24px', background: 'var(--accent-court)', color: 'var(--accent-primary)', fontWeight: '600', borderBottom: '1px solid #eee' }}>
             ข้อมูลสมาชิก
          </div>
          <div className="profile-info-grid" style={{ position: 'relative' }}>
            {infoItems.map((item, idx) => (
              <div key={idx} className="profile-info-item">
                <span className="profile-info-label">{item.label}</span>
                <span className="profile-info-value">{item.value}</span>
              </div>
            ))}
            {/* Logo/Illustration Placeholder */}
            <div style={{ position: 'absolute', right: '40px', bottom: '40px', opacity: 0.1 }}>
               <UserCheck size={120} color="#000" />
            </div>
          </div>
        </div>

        {/* Booking Options Section */}
        <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
          <div style={{ padding: '12px 24px', background: 'var(--accent-court)', color: 'var(--accent-primary)', fontWeight: '600', borderBottom: '1px solid #eee' }}>
             จองสนาม / ลงเวลา
          </div>
            <div style={{ display: 'flex', gap: '20px', padding: '24px', background: '#f8f9fa' }}>
            <div className="booking-option-card" onClick={onStartBooking}>
               <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Calendar size={24} color="#fff" />
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontWeight: '700', fontSize: '1rem' }}>จองสนาม</div>
                 <div style={{ fontSize: '0.8rem', color: '#666' }}>(Court)</div>
               </div>
            </div>
            
            <div className="booking-option-card" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <UserCheck size={24} color="#fff" />
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontWeight: '700', fontSize: '1rem' }}>จองสนามพร้อม โค้ชหรือคู่ซ้อม</div>
                 <div style={{ fontSize: '0.8rem', color: '#666' }}>(Stadium Coach and Hitting Partner)</div>
               </div>
            </div>
          </div>
        </div>

        {/* Demo Admin Access (For Testing) */}
        <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.4 }}>
           <button 
             style={{ fontSize: '0.75rem', color: '#666', textDecoration: 'underline' }}
             onClick={() => {
                if (onAdmin) onAdmin();
                window.location.hash = '#admin';
             }}
           >
             Demo Admin Dashboard (Hourly Allotment)
           </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileDashboard
