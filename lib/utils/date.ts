export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function isChristmasSeason(): boolean {
  const now = new Date()
  const month = now.getMonth() + 1 // 0-indexed
  return month === 11 || month === 12 // November or December
}

