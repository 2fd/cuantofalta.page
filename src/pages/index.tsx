import * as React from "react"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'

import './index.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

import Seo from "../components/seo"
import { useEffect, useMemo, useState } from "react"
import { celcius, daysTo } from "../utils"

const IndexPage = () => {
  const temp = useTemp()
  const now = useNow()
  const days = useDaysDiff(now, '2023-11-26 00:00:00')

  return <main>
    <div className="sup"><i>REITERAMOS</i></div>
    <div className="meta">
      <span>{now.format('HH:mm')}</span>
      {temp !== null && <br />}
      {temp !== null && <span>{celcius(temp)}</span>}
    </div>
    <h1>{daysTo(days)}</h1>
  </main>
}


/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => {
  const now = useNow()
  const days = useDaysDiff(now, '2023-11-26 00:00:00')
  return <Seo title="Cuánto falta para el casorio?" description={daysTo(days)}>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"></link>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
  </Seo>
}

export default IndexPage

function useNow() {
  const [time, setTime] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  return useMemo(() => dayjs.tz(time, 'America/Argentina/Buenos_Aires'), [time])
}

function useDaysDiff(from: string | number | dayjs.Dayjs | Date | null | undefined, to: string | number | dayjs.Dayjs | Date | null | undefined) {
  const diff = useMemo(() => dayjs.duration(dayjs.tz(to, 'America/Argentina/Buenos_Aires').diff(from)), [from, to])
  return useMemo(() => Math.ceil(diff.asDays()), [diff])
}

function useTemp() {
  const [temp, setTemp] = useState<null | number>(null)
  useEffect(() => {
    let cancelled = false
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.6&longitude=58.3&current_weather=true')
      .then(res => res.json())
      .then((weather: Weather) => {
        if (!cancelled) {
          setTemp(weather.current_weather.temperature)
        }
      })
      .catch(console.error)

    return () => { cancelled = true }
  }, [])

  return temp
}



export type Weather = {
  latitude: number // -34.625,
  longitude: number //58.25,
  generationtime_ms: number // 2.053976058959961,
  utc_offset_seconds: number // 0,
  timezone: "GMT",
  timezone_abbreviation: "GMT",
  elevation: number //0.0,
  current_weather: {
    temperature: number // 19.9,
    windspeed: number // 15.0,
    winddirection: number // 325.0,
    weathercode: number // 0,
    time: number // "2022-12-26T03:00"
  }
}