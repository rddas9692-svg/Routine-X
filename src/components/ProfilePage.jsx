import { useState, useRef } from 'react'
import { getCurrentStreak, getLongestStreak, getMonthlyRate } from '../data/utils'

function ProfilePage({ profile, habits, records, onSaveProfile }) {
  const hasProfile = profile.name.trim() !== ''
  const [editing, setEditing] = useState(!hasProfile)
  const [name, setName]       = useState(profile.name)
  const [handle, setHandle]   = useState(profile.handle)
  const canvasRef = useRef(null)

  const best    = habits.length ? Math.max(...habits.map(h => getCurrentStreak(records, h.id)))  : 0
  const longest = habits.length ? Math.max(...habits.map(h => getLongestStreak(records, h.id)))  : 0
  const monthly = getMonthlyRate(records, habits)

  const initials = profile.name
    ? profile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSaveProfile(name.trim(), handle.trim().replace(/^@/, ''))
    setEditing(false)
  }

  function handleDownload() {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const W = 360, H = 500

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0d0d0d'
    ctx.fillRect(0, 0, W, H)

    // Gold band
    ctx.fillStyle = '#f0c040'
    ctx.fillRect(0, 0, W, 76)

    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.font = 'bold 9px -apple-system, system-ui, sans-serif'
    ctx.fillText('ROUTINE X', 20, 20)

    ctx.fillStyle = '#000'
    ctx.font = 'bold 26px -apple-system, system-ui, sans-serif'
    ctx.fillText(profile.name || 'Your Name', 20, 56)

    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.font = '12px -apple-system, system-ui, sans-serif'
    ctx.fillText('@' + (profile.handle || 'handle'), 20, 73)

    // Stats row
    const stats = [
      { label: 'STREAK',  value: best + 'd'    },
      { label: 'LONGEST', value: longest + 'd'  },
      { label: 'MONTH',   value: monthly + '%'  },
    ]
    const bw = (W - 44) / 3
    stats.forEach((s, i) => {
      const x = 20 + i * (bw + 2)
      ctx.fillStyle = '#161616'
      ctx.beginPath(); ctx.roundRect(x, 92, bw, 52, 8); ctx.fill()
      ctx.fillStyle = '#444'
      ctx.font = 'bold 8px -apple-system, system-ui, sans-serif'
      ctx.fillText(s.label, x + 10, 108)
      ctx.fillStyle = '#f0c040'
      ctx.font = 'bold 19px -apple-system, system-ui, sans-serif'
      ctx.fillText(s.value, x + 10, 130)
    })

    ctx.fillStyle = '#333'
    ctx.font = 'bold 9px -apple-system, system-ui, sans-serif'
    ctx.fillText('MY HABITS', 20, 164)

    habits.slice(0, 5).forEach((h, i) => {
      const y = 178 + i * 40
      ctx.fillStyle = '#141414'
      ctx.beginPath(); ctx.roundRect(20, y, W - 40, 34, 8); ctx.fill()
      ctx.font = '16px -apple-system, system-ui, sans-serif'
      ctx.fillText(h.emoji, 32, y + 22)
      ctx.fillStyle = '#e8e8e8'
      ctx.font = '13px -apple-system, system-ui, sans-serif'
      ctx.fillText(h.name, 56, y + 22)
      const s = getCurrentStreak(records, h.id)
      if (s > 0) {
        ctx.fillStyle = '#f0c040'
        ctx.font = 'bold 11px -apple-system, system-ui, sans-serif'
        ctx.fillText('🔥 ' + s, 292, y + 22)
      }
    })

    ctx.fillStyle = '#222'
    ctx.fillRect(0, H - 30, W, 1)
    ctx.fillStyle = '#2a2a2a'
    ctx.font = '10px -apple-system, system-ui, sans-serif'
    ctx.fillText('routinex.app · Build better habits every day', 20, H - 10)

    const a = document.createElement('a')
    a.download = 'routine-x-card.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  return (
    <div className="profile-page">

      { editing ? (
        <div className="prof-form-wrap">
          { !hasProfile && (
            <>
              <div className="prof-form-title">Set up your profile</div>
              <div className="prof-form-sub">Your name shows on your shareable card.</div>
            </>
          ) }
          <form onSubmit={ handleSave }>
            <div className="field">
              <label className="field-label">Display Name</label>
              <input className="field-input" type="text" placeholder="Your name"
                value={ name } onChange={ e => setName(e.target.value) } maxLength={ 32 } autoFocus />
            </div>
            <div className="field">
              <label className="field-label">Handle</label>
              <input className="field-input" type="text" placeholder="@yourhandle"
                value={ handle } onChange={ e => setHandle(e.target.value) } maxLength={ 24 } />
            </div>
            <div className="form-row">
              { hasProfile && (
                <button type="button" className="btn-cancel" onClick={ () => setEditing(false) }>
                  Cancel
                </button>
              ) }
              <button type="submit" className="btn-save-sm" disabled={ !name.trim() }>
                Save Profile
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="prof-hero">
          <div className="prof-avatar">{ initials }</div>
          <div className="prof-info">
            <div className="prof-name">{ profile.name }</div>
            <div className="prof-handle">@{ profile.handle || 'no handle set' }</div>
          </div>
          <button className="btn-edit" onClick={ () => setEditing(true) } title="Edit profile">
            <svg viewBox="0 0 16 16">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
            </svg>
          </button>
        </div>
      ) }

      <div className="card-section">
        <div className="card-section-label">Your Card</div>
        <div className="hf-card">
          <div className="hf-card-band">
            <div className="hf-band-label">Routine X</div>
            <div className="hf-band-name">{ profile.name || 'Your Name' }</div>
            <div className="hf-band-handle">@{ profile.handle || 'handle' }</div>
          </div>
          <div className="hf-card-inner">
            <div className="hf-stats">
              <div className="hf-stat"><div className="hf-stat-l">Streak</div><div className="hf-stat-v">{ best }d</div></div>
              <div className="hf-stat"><div className="hf-stat-l">Longest</div><div className="hf-stat-v">{ longest }d</div></div>
              <div className="hf-stat"><div className="hf-stat-l">Month</div><div className="hf-stat-v">{ monthly }%</div></div>
            </div>
            <div className="hf-habits-label">Habits</div>
            { habits.slice(0, 5).map(h => (
              <div key={ h.id } className="hf-habit">
                <span>{ h.emoji }</span>
                <span>{ h.name }</span>
                { getCurrentStreak(records, h.id) > 0 && (
                  <span className="hf-streak-pill">🔥 { getCurrentStreak(records, h.id) }</span>
                ) }
              </div>
            )) }
            { habits.length === 0 && (
              <div style={{ fontSize: '12px', color: '#444', padding: '8px 0' }}>Add habits to show them here</div>
            ) }
          </div>
          <div className="hf-card-foot">routinex.app · Build better habits every day</div>
        </div>
        <button className="btn-dl" onClick={ handleDownload }>↓ Download Card</button>
      </div>

      <canvas ref={ canvasRef } width={ 360 } height={ 500 } style={{ display: 'none' }} />
    </div>
  )
}

export default ProfilePage
