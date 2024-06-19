import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

export default function ProtectedRoute() {
   const { user, isAuthenticated } = useAuth()

   if (!isAuthenticated) return <Navigate to="/login" replace/>
  return (
    <Outlet />
  )
}