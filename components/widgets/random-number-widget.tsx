"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function RandomNumberWidget() {
  const [value, setValue] = useState(() => randomInRange(1, 1000))

  const refresh = useCallback(() => {
    setValue(randomInRange(1, 1000))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Random Number</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-2xl font-bold">{value}</p>
        <Button onClick={refresh} variant="secondary" size="sm">
          Refresh
        </Button>
      </CardContent>
    </Card>
  )
}
