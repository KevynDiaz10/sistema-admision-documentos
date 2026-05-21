"use client"
import { useSession, signOut } from "next-auth/react"

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome to your dashboard! Here you can manage your account and view your data.</p>
    <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}