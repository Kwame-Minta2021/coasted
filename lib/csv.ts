export function parseCSV(csv: string): Record<string,string>[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/)
  const headers = headerLine.split(',').map(h => h.trim())
  return lines.filter(Boolean).map(line => {
    const cells = [] as string[]
    let cur = ''
    let inQuotes = false
    for (let i=0;i<line.length;i++){
      const ch = line[i]
      if (ch==='"') { inQuotes = !inQuotes; continue }
      if (ch===',' && !inQuotes){ cells.push(cur); cur=''; continue }
      cur += ch
    }
    cells.push(cur)
    const obj: Record<string,string> = {}
    headers.forEach((h, i) => obj[h] = (cells[i]||'').trim())
    return obj
  })
}
