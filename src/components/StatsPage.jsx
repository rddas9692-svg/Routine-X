import { getCurrentStreak, getLongestStreak, getMonthlyRate } from '../data/utils'

function StatsPage({ habits, records }) {
  const best    = habits.length ? Math.max(...habits.map(h => getCurrentStreak(records, h.id)))  : 0
  const longest = habits.length ? Math.max(...habits.map(h => getLongestStreak(records, h.id)))  : 0
  const monthly = getMonthlyRate(records, habits)
  const total   = records.filter(r => r.status === 'done').length

  function rate(hid) {
    const d = records.filter(r => r.habitId === hid && r.status === 'done').length
    const t = records.filter(r => r.habitId === hid).length
    return t === 0 ? 0 : Math.round((d / t) * 100)
  }

  return (
    <div className="stats-page">
      <div className="page-topbar">
        <div className="page-topbar-sub">Overview</div>
        <div className="page-topbar-title">
          { new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-tile">
          <div className="stat-tile-label">Current Streak</div>
          <div className="stat-tile-value">{ best }</div>
          <div className="stat-tile-unit">days in a row</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Longest Ever</div>
          <div className="stat-tile-value">{ longest }</div>
          <div className="stat-tile-unit">days</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">This Month</div>
          <div className="stat-tile-value">{ monthly }%</div>
          <div className="stat-tile-unit">completion rate</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">All-Time</div>
          <div className="stat-tile-value">{ total }</div>
          <div className="stat-tile-unit">check-ins</div>
        </div>
      </div>

      { habits.length > 0 ? (
        <>
          <div className="section-title">Per Habit</div>
          <div className="habit-bars">
            { habits.map(h => {
              const pct    = rate(h.id)
              const streak = getCurrentStreak(records, h.id)
              return (
                <div key={ h.id } className="bar-item">
                  <div className="bar-top">
                    <div className="bar-left">
                      <span>{ h.emoji }</span>
                      <span>{ h.name }</span>
                      { streak > 0 && <span className="streak-pill">🔥 { streak }</span> }
                    </div>
                    <div className="bar-pct">{ pct }%</div>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${ pct }%` }} />
                  </div>
                </div>
              )
            }) }
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-emoji">📊</span>
          <h3>No data yet</h3>
          <p>Add habits on the Today tab<br />to see your stats here.</p>
        </div>
      ) }
    </div>
  )
}

export default StatsPage
