import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, CheckCircle2, X } from 'lucide-react'
import courtImage from '../assets/tennis_court_map.png'

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]

function Booking({ user, courts, onBack, onCheckout }) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [location, setLocation] = useState('Tennis Court')
  const [dates, setDates] = useState([])

  useEffect(() => {
    const d = []
    for (let i = 0; i < 14; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        d.push({
            full: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('th-TH', { weekday: 'short' }),
            date: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            year: date.getFullYear()
        })
    }
    setDates(d)
  }, [])

  const handleNextStep = () => {
    if (step === 1 && selectedCourt && selectedTime) {
      setStep(2)
    } else if (step === 2) {
      confirmBooking()
    }
  }

  const confirmBooking = () => {
    const bookingId = Math.floor(Math.random() * 90000) + 10000
    const now = new Date()
    const stamp = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0')
    const bookingNo = `SPORTS-${stamp}`
    onCheckout({ id: bookingId, bookingNo, court: selectedCourt, date: selectedDate, time: selectedTime })
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '100px' }}>
      {/* Step Indicator */}
      <div className="step-indicator-bar">
         STEP {step}/4 : {step === 1 ? 'เลือก วัน เวลา สนาม' : 'รายละเอียดการจอง'}
      </div>

      <div className="container" style={{ maxWidth: '1000px', marginTop: '20px' }}>
        {step === 1 && (
          <div className="flex-col gap-lg">
            {/* Date Selector */}
            <div className="glass-card flex-col" style={{ background: '#fff', color: '#333', padding: '20px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Select Date</span>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {dates.map((d) => (
                  <button
                    key={d.full}
                    onClick={() => setSelectedDate(d.full)}
                    style={{
                      minWidth: '50px',
                      padding: '8px',
                      borderRadius: '4px',
                      background: selectedDate === d.full ? 'var(--accent-primary)' : '#fff',
                      color: selectedDate === d.full ? '#fff' : '#333',
                      border: '1px solid #ddd',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.6rem' }}>{d.month} {d.year}</span>
                    <span style={{ fontSize: '0.7rem' }}>{d.day}</span>
                    <span style={{ fontSize: '1rem', fontWeight: '700' }}>{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="location-tab-selector">
                  <button className={`location-tab ${location === 'Tennis Court' ? 'active' : ''}`} onClick={() => setLocation('Tennis Court')}>Tennis Court</button>
                  <button className={`location-tab ${location !== 'Tennis Court' ? 'active' : ''}`} onClick={() => setLocation('Tennis Court G')}>Tennis Court G</button>
               </div>
            </div>

            <div className="booking-layout-grid">
              {/* Green Court Map */}
              <div className="court-map-container" style={{ position: 'relative', height: '500px', background: 'var(--accent-court)' }}>
                 <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--accent-primary)', opacity: 0.1, fontWeight: '900', fontSize: '3rem', pointerEvents: 'none' }}>SELECT COURT</div>
                 {courts.map(court => {
                    const isSelected = selectedCourt?.id === court.id
                    return (
                      <div 
                       key={court.id}
                       onClick={() => setSelectedCourt(court)}
                       className={`court-image-box ${isSelected ? 'selected' : ''}`}
                       style={{
                         position: 'absolute',
                         left: `${court.pos?.x}%`,
                         top: `${court.pos?.y}%`,
                         width: court.type === 'Tennis' ? '140px' : '70px',
                         height: court.type === 'Tennis' ? '90px' : '110px',
                         backgroundImage: `url(${courtImage})`,
                         cursor: 'pointer',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         justifyContent: 'center',
                         transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                         transformOrigin: 'center'
                       }}
                      >
                        {/* Selection Markers */}
                        {isSelected && (
                          <>
                            <div className="selection-marker marker-tl" />
                            <div className="selection-marker marker-tr" />
                            <div className="selection-marker marker-bl" />
                            <div className="selection-marker marker-br" />
                          </>
                        )}
                        
                        <div style={{ 
                          background: isSelected ? 'var(--accent-primary)' : 'rgba(0,0,0,0.4)', 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          zIndex: 2
                        }}>
                          <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: '700' }}>{court.name}</span>
                        </div>
                      </div>
                    )
                 })}
                 <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'var(--accent-primary)', opacity: 0.05, fontWeight: '900', fontSize: '4rem', pointerEvents: 'none' }}>TENNIS</div>
              </div>

              {/* Time Selection */}
              <div className="glass-card flex-col" style={{ background: '#fff', color: '#333', padding: '24px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Select Time</span>
                 <div className="time-slot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                   {TIME_SLOTS.map((time, idx) => {
                     const slot = selectedCourt?.allotment[idx]
                     const isUnavailable = slot && (!slot.isOpen || slot.bookedBy)
                     const isPending = slot && slot.pendingBy
                     return (
                       <button 
                         key={time} 
                         disabled={isUnavailable || isPending}
                         className={`time-slot-item ${selectedTime === time ? 'active' : ''}`}
                         onClick={() => setSelectedTime(time)}
                         style={{ 
                           opacity: (isUnavailable || isPending) ? 0.3 : 1, 
                           cursor: (isUnavailable || isPending) ? 'not-allowed' : 'pointer',
                           background: selectedTime === time ? '#1a1a3a' : isPending ? '#fff9c4' : '#fff',
                           border: '1px solid #ddd',
                           color: selectedTime === time ? '#fff' : isPending ? '#f57f17' : '#333'
                         }}
                       >
                         {slot?.bookedBy ? 'BOOKED' : isPending ? 'PENDING' : time}
                       </button>
                     )
                   })}
                 </div>
                <button 
                  className="premium-button" 
                  disabled={!selectedCourt || !selectedTime}
                  onClick={handleNextStep}
                  style={{ marginTop: 'auto', background: 'var(--accent-primary)', color: '#fff', borderRadius: '4px', padding: '16px' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col gap-lg">
             <div className="glass-card flex-col" style={{ background: '#fff', overflow: 'hidden', border: '1px solid #eee' }}>
                <div style={{ padding: '12px 24px', background: 'var(--accent-court)', color: 'var(--accent-primary)', fontWeight: '600', borderBottom: '1px solid #eee' }}>
                   รายละเอียดการจอง Tennis Court
                </div>
                <table className="summary-table">
                   <thead>
                     <tr>
                       <th>Date</th>
                       <th>Time</th>
                       <th>Courts</th>
                       <th>Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td>{selectedDate}</td>
                       <td>{selectedTime}</td>
                       <td>{selectedCourt?.name}</td>
                       <td>
                          <button style={{ padding: '8px 16px', background: '#666', color: '#fff', border: 'none', borderRadius: '4px' }} onClick={() => setStep(1)}>Cancel</button>
                       </td>
                     </tr>
                   </tbody>
                </table>
             </div>
             <button 
              className="premium-button" 
              onClick={handleNextStep}
              style={{ background: '#1a1a3a', color: '#fff', borderRadius: '4px', padding: '16px', fontSize: '1.2rem' }}
             >
               Booking
             </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Booking
