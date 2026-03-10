"use client"

import { useRef, useState, useLayoutEffect } from "react"
import { ReactGridLayout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { RandomNumberWidget } from "@/components/widgets/random-number-widget"
import { WeatherWidget } from "@/components/widgets/weather-widget"

const WIDGET_LAYOUT = [
  { i: "random", x: 0, y: 0, w: 6, h: 2 },
  { i: "weather", x: 6, y: 0, w: 6, h: 2 },
  { i: "revenue", x: 0, y: 2, w: 8, h: 4 },
  { i: "orders", x: 8, y: 2, w: 4, h: 4 },
]

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 6000 },
]

export default function Home() {
  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined") return WIDGET_LAYOUT
  
    const saved = localStorage.getItem("dashboard-layout")
    return saved ? JSON.parse(saved) : WIDGET_LAYOUT
  })
  const gridRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el) return
    const updateWidth = () => setWidth(el.offsetWidth)
    updateWidth()
    const ro = new ResizeObserver(updateWidth)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <main className="min-h-screen flex">
      
      <aside className="w-64 border-r p-6 bg-muted/40">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-3">
          <p className="font-medium">Overview</p>
          <p className="text-muted-foreground">Analytics</p>
          <p className="text-muted-foreground">Customers</p>
          <p className="text-muted-foreground">Settings</p>
        </nav>
      </aside>

      <section className="flex-1 p-10 space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold">Awesome Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, here is your business overview.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,245</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,340</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">532</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">4.2%</p>
            </CardContent>
          </Card>
        </div>

        <div ref={gridRef} className="w-full min-h-[320px]">
          {width > 0 && (
            <ReactGridLayout
              layout={layout}
              width={width}
              gridConfig={{ cols: 12, rowHeight: 80 }}
              dragConfig={{
                handle: ".drag-handle",
                cancel: "input, button, textarea, select, [contenteditable]",
              }}
              onLayoutChange={(newLayout) => {
                setLayout([...newLayout])
                localStorage.setItem("dashboard-layout", JSON.stringify(newLayout))
              }}
              className="layout"
            >
            <div key="random" className="h-full flex flex-col">
              <div className="drag-handle cursor-grab active:cursor-grabbing h-6 flex items-center px-3 text-xs text-muted-foreground" />
              <div className="flex-1 min-h-0">
                <RandomNumberWidget />
              </div>
            </div>
          
            <div key="weather" className="h-full flex flex-col">
              <div className="drag-handle cursor-grab active:cursor-grabbing h-6 flex items-center px-3 text-xs text-muted-foreground" />
              <div className="flex-1 min-h-0">
                <WeatherWidget />
              </div>
            </div>
          
            <div key="revenue" className="h-full flex flex-col">
              <div className="drag-handle cursor-grab active:cursor-grabbing h-6 flex items-center px-3 text-xs text-muted-foreground" />
              <Card className="h-full flex-1 min-h-0">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          
            <div key="orders" className="h-full flex flex-col">
              <div className="drag-handle cursor-grab active:cursor-grabbing h-6 flex items-center px-3 text-xs text-muted-foreground" />
              <Card className="h-full flex-1 min-h-0">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Alice</TableCell>
                        <TableCell>$120</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bob</TableCell>
                        <TableCell>$80</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Charlie</TableCell>
                        <TableCell>$240</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </ReactGridLayout>
          )}
        </div>

      </section>

    </main>
  )
}