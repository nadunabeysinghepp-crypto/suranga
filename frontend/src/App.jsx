// ✅ frontend/src/App.jsx
import { HashRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Quote from "./pages/Quote";
import Portfolio from "./pages/Portfolio";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/Login";
import RequireAdmin from "./admin/RequireAdmin";

import Dashboard from "./admin/Dashboard";
import QuotesAdmin from "./admin/QuotesAdmin";
import ServicesAdmin from "./admin/ServicesAdmin";
import DeliveryAdmin from "./admin/DeliveryAdmin";
import PortfolioAdmin from "./admin/PortfolioAdmin";
import ReviewsAdmin from "./admin/ReviewsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* ✅ ADMIN */}
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="quotes" element={<QuotesAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="delivery" element={<DeliveryAdmin />} />
          <Route path="portfolio" element={<PortfolioAdmin />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        {/* ✅ PUBLIC */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </HashRouter>
  );
}
