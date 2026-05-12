import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ANALYTICS_FILE = path.join(process.cwd(), 'analytics.json')

export async function GET() {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, 'utf8')
      const data = JSON.parse(raw)
      return NextResponse.json({ service: 'Diesel Dude by WastedApe', ...data })
    }
    return NextResponse.json({
      service: 'Diesel Dude by WastedApe',
      totalEvents: 0,
      pageviews: 0,
      chatEvents: 0,
      signupEvents: 0,
      otherEvents: 0,
      pageBreakdown: {},
      eventBreakdown: {},
      dailyBreakdown: {},
      lastUpdated: null,
    })
  } catch {
    return NextResponse.json({ error: 'Could not read analytics' }, { status: 500 })
  }
}
