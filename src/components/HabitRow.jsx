// src/components/HabitRow.jsx
// ─────────────────────────────────────────
// Props received from TodayPage:
//   habit    — { id, name, emoji }
//   status   — 'done' | 'skip' | null
//   streak   — number (current streak days)
//   onToggle — () => called when ✓ clicked
//   onSkip   — () => called when – clicked
//   onDelete — () => called when × clicked
//
// KEY LESSON: this component owns NO state.
// It only displays data and fires callbacks up.
// ─────────────────────────────────────────

function HabitRow({ habit, status, streak, onToggle, onSkip, onDelete }) {
  // --- write component here in class ---

   const cls = `habit-row ${ status === 'done' ? 'done' : status === 'skip' ? 'skipped' : '' }`
   return(
    <div className={ cls }>
      <div className="h-icon">{ habit.emoji }</div>

      <div className="h-info">
        <div className="h-name">{ habit.name }</div>
        <div className={ `h-streak ${ streak >= 3 ? 'hot' : '' }` }>
          { streak > 0 ? `🔥 ${ streak }-day streak` : 'No streak yet' }
        </div>
      </div>

      <div className="h-actions">
        <button className={ `hbtn check ${ status === 'done' ? 'on' : '' }` } onClick={ onToggle }>✓</button>
        <button className={ `hbtn skip  ${ status === 'skip' ? 'on' : '' }` } onClick={ onSkip  }>–</button>
        <button className="hbtn del" onClick={ onDelete }>×</button>
      </div>
    </div>
   )
}

export default HabitRow
