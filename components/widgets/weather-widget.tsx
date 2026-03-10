"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current=temperature_2m,weather_code"

function weatherCodeToLabel(code: number): string {
  if (code === 0) return "Clear"
  if (code >= 1 && code <= 3) return "Partly cloudy"
  if (code >= 45 && code <= 48) return "Foggy"
  if (code >= 51 && code <= 67) return "Rain"
  if (code >= 71 && code <= 77) return "Snow"
  if (code >= 80 && code <= 82) return "Rain showers"
  if (code >= 85 && code <= 86) return "Snow showers"
  if (code >= 95 && code <= 99) return "Thunderstorm"
  return "Cloudy"
}

type WeatherState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; temp: number; condition: string }

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState>({ status: "loading" })

  const fetchWeather = useCallback(async () => {
    setWeather({ status: "loading" })
    try {
      const res = await fetch(OPEN_METEO_URL)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      const current = data.current as {
        temperature_2m: number
        weather_code: number
      }
      setWeather({
        status: "success",
        temp: current.temperature_2m,
        condition: weatherCodeToLabel(current.weather_code),
      })
    } catch {
      setWeather({ status: "error", message: "Failed to load weather" })
    }
  }, [])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather — Berlin</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {weather.status === "loading" && (
          <p className="text-muted-foreground">Loading…</p>
        )}
        {weather.status === "error" && (
          <p className="text-destructive">{weather.message}</p>
        )}
        {weather.status === "success" && (
          <>
            <p className="text-2xl font-bold">{weather.temp} °C</p>
            <p className="text-muted-foreground">{weather.condition}</p>
          </>
        )}
        <Button
          onClick={fetchWeather}
          variant="secondary"
          size="sm"
          disabled={weather.status === "loading"}
        >
          Refresh
        </Button>
      </CardContent>
    </Card>
  )
}
