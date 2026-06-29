import { useState, useEffect } from 'react'
import { EMOJIS } from '../data/seed'

function AddModal({ open, onClose, onAdd }) {
  const [name, setName]   = useState('')
  const [emoji, setEmoji] = useState('💪')

  useEffect(() => { if (!open) { setName(''); setEmoji('💪') } }, [open])

  if (!open) return null

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), emoji)
  }

  return (
    <div className="modal-back" onClick={ onClose }>
      <div className="modal-sheet" onClick={ e => e.stopPropagation() }>
        <div className="sheet-pill" />
        <div className="sheet-title">New Habit</div>

        <form onSubmit={ submit }>
          <div className="field">
            <label className="field-label">Name</label>
            <input className="field-input" type="text" placeholder="e.g. Morning run"
              value={ name } onChange={ e => setName(e.target.value) } autoFocus maxLength={ 40 } />
          </div>

          <div className="field">
            <label className="field-label">Pick an emoji</label>
            <div className="emoji-grid">
              { EMOJIS.map(e => (
                <button key={ e } type="button"
                  className={ `emoji-opt ${ emoji === e ? 'on' : '' }` }
                  onClick={ () => setEmoji(e) }>
                  { e }
                </button>
              )) }
            </div>
          </div>

          <button type="submit" className="btn-fill" disabled={ !name.trim() }>
            Add Habit
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddModal