"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

function forecastUrl(lat: number, lon: number) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
}

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

type GeocodingResult = {
  name: string
  latitude: number
  longitude: number
}

type WeatherState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; temp: number; condition: string }

export function WeatherWidget() {
  const [cityName, setCityName] = useState("Berlin")
  const [lat, setLat] = useState(52.52)
  const [lon, setLon] = useState(13.405)
  const [weather, setWeather] = useState<WeatherState>({ status: "loading" })
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setWeather({ status: "loading" })
    try {
      const res = await fetch(forecastUrl(latitude, longitude))
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
    fetchWeather(lat, lon)
  }, [lat, lon, fetchWeather])

  const startEditing = useCallback(() => {
    setInputValue(cityName)
    setIsEditing(true)
  }, [cityName])

  const searchCity = useCallback(async () => {
    const name = inputValue.trim()
    if (!name) return
    try {
      const res = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1`
      )
      if (!res.ok) throw new Error("Geocoding failed")
      const data = await res.json()
      const results = data.results as GeocodingResult[] | undefined
      if (!results?.length) {
        setWeather({ status: "error", message: "City not found" })
        return
      }
      const { name: foundName, latitude, longitude } = results[0]
      setCityName(foundName)
      setLat(latitude)
      setLon(longitude)
      setIsEditing(false)
      await fetchWeather(latitude, longitude)
    } catch {
      setWeather({ status: "error", message: "Failed to find city" })
    }
  }, [inputValue, fetchWeather])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setInputValue("")
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather — {cityName}</CardTitle>
        {!isEditing && (
          <CardAction>
            <Button variant="outline" size="sm" onClick={startEditing}>
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isEditing && (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="City name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchCity()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={searchCity}>
                Search
              </Button>
              <Button variant="outline" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        {!isEditing && (
          <>
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
              onClick={() => fetchWeather(lat, lon)}
              variant="secondary"
              size="sm"
              disabled={weather.status === "loading"}
            >
              Refresh
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
