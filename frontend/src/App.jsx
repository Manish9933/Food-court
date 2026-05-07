import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { FoodProvider } from './context/FoodContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import Recommend from './pages/Recommend'
import PageTransition from './components/PageTransition'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import BuildYourPlate from './pages/BuildYourPlate'
import OrderHistory from './pages/OrderHistory'
import ChatBot from './components/ChatBot'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './admin/layout/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import ManageMenu from './admin/pages/ManageMenu'
import ManageOrders from './admin/pages/ManageOrders'
import ManageUsers from './admin/pages/ManageUsers'
import ManageCategories from './admin/pages/ManageCategories'
import Analytics from './admin/pages/Analytics'
import Revenue from './admin/pages/Revenue'
import CustomerReviews from './admin/pages/CustomerReviews'
import Settings from './admin/pages/Settings'
import OrderDetails from './admin/pages/OrderDetails'
import ManageDeliveryBoys from './admin/pages/ManageDeliveryBoys'

const AppContent = () => {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <div className={`min-h-screen bg-dark-900 font-outfit text-white selection:bg-primary-500/30 overflow-x-hidden ${!isAdminPath ? 'pt-[110px]' : ''}`}>
      {!isAdminPath && <Navbar />}
      {!isAdminPath && <ChatBot />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/track-order/:id" element={<TrackOrder />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/build-plate" element={<BuildYourPlate />} />
        <Route path="/orders" element={<OrderHistory />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="menu" element={<ManageMenu />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="delivery-boys" element={<ManageDeliveryBoys />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="reviews" element={<CustomerReviews />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <FoodProvider>
          <AppContent />
        </FoodProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
