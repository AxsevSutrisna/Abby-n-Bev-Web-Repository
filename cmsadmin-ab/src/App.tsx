import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "./routes/ProtectedRoutes"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* contoh tambahan menu users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <h2 style={{ padding: 20 }}>Users Management Page</h2>
            </ProtectedRoute>
          }
        />

        {/* Redirect semua yang tidak dikenali ke login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}
