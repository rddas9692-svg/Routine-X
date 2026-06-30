export const EMOJIS = ['💪','📚','💻','😴','🏃','🧘','🥗','💧','🎯','✍️','🎸','🌅','🛌','🍎','🎨','🏋️','🚴','🧹','💊','🌿']

export const COLORS = ['#f5c518', '#ffffff', '#aaaaaa', '#555555']

export function seedHabits() {
  return []
}

export function seedRecords(habits) {
  const records = []
  const today = new Date()
  for (let i = 1; i <= 60; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const date = d.toISOString().slice(0, 10)
    habits.forEach(h => {
      if (Math.random() > 0.3) {
        records.push({ habitId: h.id, date, status: 'done' })
      } else if (Math.random() > 0.6) {
        records.push({ habitId: h.id, date, status: 'skip' })
      }
    })
  }
  return records
}
