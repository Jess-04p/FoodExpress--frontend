import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePage from './components/ProfilePage';
import RestaurantDetails from './components/RestaurantDetails';
import ServedOrders from './components/ServedOrders';
 
// Shared components
import AppNavbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Restaurants from './components/Restaurants';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import Order from './components/Order';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
 
// Dashboards
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantOrders from './components/RestaurantOrders';
import DeliveryAgentDashboard from './components/DeliveryAgentDashboard';
import CustomerPage from './components/CustomerPage';
import CurrentOrders from './components/customer/CurrentOrders';
import PastOrders from './components/customer/PastOrders';
 
// Auth components
import Login from './components/Login';
import CustomerRegister from './components/register/CustomerRegister';
import DeliveryAgentRegister from './components/register/DeliveryAgentRegister';
import RestaurantOwnerRegister from './components/register/RestaurantOwnerRegister';
 
function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
 
  return (
    <Router>
      <div style={{ paddingTop: '56px' }}> {/* Add global padding for fixed navbar */}
        <AppNavbar />
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <div style={{ paddingTop: '0' }}> {/* Reset padding for home page */}
                <Hero />
                <Features />
                <Testimonials />
                <Footer />
              </div>
            }
          />
 
          {/* Menu & Order Flow */}
          <Route path="/menu/:restaurantId" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/success" element={<Order />} />
 
          {/* Register Routes */}
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/register/delivery-agent" element={<DeliveryAgentRegister />} />
          <Route path="/register/restaurant-owner" element={<RestaurantOwnerRegister />} />
 
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
 
          {/* User Dashboards */}
          <Route path="/customer/:id" element={<CustomerPage />} />
          <Route path="/customer/:id/restaurants" element={<CustomerPage />} />
          <Route path="/customer/:id/current-orders" element={<CurrentOrders />} />
          <Route path="/customer/:id/past-orders" element={<PastOrders />} />
          <Route path="/restaurant/:id" element={<RestaurantDashboard />} />
          <Route path="/restaurant/:id/details" element={<RestaurantDetails />} />
          <Route path="/restaurant/:id/orders" element={<RestaurantOrders />} />
          <Route path="/restaurant/:id/served-orders" element={<ServedOrders />} />
          <Route path="/delivery/:id/*" element={<DeliveryAgentDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}
 
export default App;
 
 
 