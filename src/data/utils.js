export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getRecord(records, habitId, date) {
  return records.find(r => r.habitId === habitId && r.date === date)?.status ?? null
}

export function toggleRecord(records, habitId, date, status) {
  const existing = records.find(r => r.habitId === habitId && r.date === date)
  if (existing?.status === status) {
    return records.filter(r => !(r.habitId === habitId && r.date === date))
  }
  if (existing) {
    return records.map(r =>
      r.habitId === habitId && r.date === date ? { ...r, status } : r
    )
  }
  return [...records, { habitId, date, status }]
}

export function getCurrentStreak(records, habitId) {
  let streak = 0
  const d = new Date()
  // if today has no record yet, start counting from yesterday
  const todayRec = records.find(r => r.habitId === habitId && r.date === d.toISOString().slice(0, 10))
  if (!todayRec) d.setDate(d.getDate() - 1)

  while (true) {
    const key = d.toISOString().slice(0, 10)
    const rec = records.find(r => r.habitId === habitId && r.date === key)
    if (rec?.status === 'done') {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function getLongestStreak(records, habitId) {
  const done = records
    .filter(r => r.habitId === habitId && r.status === 'done')
    .map(r => r.date)
    .sort()

  let longest = 0
  let current = 0
  let prev = null

  for (const date of done) {
    if (prev) {
      const diff = (new Date(date) - new Date(prev)) / 86400000
      current = diff === 1 ? current + 1 : 1
    } else {
      current = 1
    }
    if (current > longest) longest = current
    prev = date
  }
  return longest
}

export function getMonthlyRate(records, habits) {
  if (!habits.length) return 0
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()
  const daysSoFar = Math.min(today, daysInMonth)

  let done = 0
  let total = 0

  for (let d = 1; d <= daysSoFar; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    habits.forEach(h => {
      total++
      const rec = records.find(r => r.habitId === h.id && r.date === date)
      if (rec?.status === 'done') done++
    })
  }

  return total === 0 ? 0 : Math.round((done / total) * 100)
}
