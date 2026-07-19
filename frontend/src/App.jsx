import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import BusinessDetails from './pages/BusinessDetails.jsx'
import Login from './pages/Login.jsx'
import RegisterCustomer from './pages/RegisterCustomer.jsx'
import RegisterShopBenefits from './pages/RegisterShopBenefits.jsx'
import RegisterShop from './pages/RegisterShop.jsx'
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/business/:id" element={<BusinessDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterCustomer />} />
          <Route path="/register-shop-benefits" element={<RegisterShopBenefits />} />
          <Route path="/register-shop" element={<RegisterShop />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
