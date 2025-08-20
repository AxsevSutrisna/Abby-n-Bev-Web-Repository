import React from "react"
import DashboardLayout from "../layout/DashboardLayout"

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Welcome to Abby n Bev Dashboard</h1>
      <p>Ini adalah halaman utama setelah login 🚀</p>
    </DashboardLayout>
  )
}

export default DashboardPage
