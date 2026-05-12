import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ANALYTICS_FILE = path.join(process.cwd(), 'analytics.json')

interface AnalyticsData {
  totalEvents: number
  pageviews: number
  chatEvents: number
  signupEvents: number
  otherEvents: number
  pageBreakdown: Record<string, number>
  eventBreakdown: Record<string, number>
  dailyBreakdown: Record<string, { total: number; pageview: number; chat: number; signup: number }>
  lastUpdated: string | null
}

function loadAnalytics(): AnalyticsData {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const raw = fs.readFileSync(ANALYTICS_FILE, 'utf8')
      return JSON.parse(raw)
    }
  } catch {
    // ignore read errors
  }
  return {
    totalEvents: 0,
    pageviews: 0,
    chatEvents: 0,
    signupEvents: 0,
    otherEvents: 0,
    pageBreakdown: {},
    eventBreakdown: {},
    dailyBreakdown: {},
    lastUpdated: null,
  }
}

function saveAnalytics(data: AnalyticsData) {
  try {
    data.lastUpdated = new Date().toISOString()
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf8')
  } catch {
    // ignore write errors in serverless/read-only envs
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event = 'pageview', page = '/' } = body

    const data = loadAnalytics()
    const today = new Date().toISOString().split('T')[0]

    data.totalEvents++
    if (event === 'pageview') data.pageviews++
    else if (event === 'chat') data.chatEvents++
    else if (event === 'signup') data.signupEvents++
    else data.otherEvents++

    data.pageBreakdown[page] = (data.pageBreakdown[page] || 0) + 1
    data.eventBreakdown[event] = (data.eventBreakdown[event] || 0) + 1

    if (!data.dailyBreakdown[today]) {
      data.dailyBreakdown[today] = { total: 0, pageview: 0, chat: 0, signup: 0 }
    }
    data.dailyBreakdown[today].total++
    if (event === 'pageview') data.dailyBreakdown[today].pageview = (data.dailyBreakdown[today].pageview || 0) + 1
    if (event === 'chat') data.dailyBreakdown[today].chat = (data.dailyBreakdown[today].chat || 0) + 1
    if (event === 'signup') data.dailyBreakdown[today].signup = (data.dailyBreakdown[today].signup || 0) + 1

    saveAnalytics(data)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
